import { ValidationError } from 'apollo-server-express';
import to from 'await-to-js';
import { Resolver, Query, Arg, Mutation, ResolverInterface, FieldResolver, Root } from 'type-graphql';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { v4 as uuid } from 'uuid';

import { Book, User } from '../../entities';
import { logErrorObject, logger } from '../../utils';
import { Pipeline } from '../../utils/types';
import { BookQueryInput, BookQuery, BookInputPartial, BookInput } from './inputs';

@Resolver(of => Book)
export default class BookResolver implements ResolverInterface<Book> {
    private bookRepository: MongoRepository<Book>;
    private userRepository: MongoRepository<User>;
    constructor() {
        this.bookRepository = getMongoRepository(Book);
        this.userRepository = getMongoRepository(User);
    }

    @Query(returns => Book, { nullable: true })
    async book(@Arg('id', type => String) id: string): Promise<Book> {
        const [error, book] = await to<Book>(this.bookRepository.findOne({ uuid: id }));
        if (error) {
            logErrorObject(error, 'Error in fetching book');
            throw new Error('Error in finding book');
        }
        if (!book) {
            logger.warn(`No book found for id ${id}`);
            throw new ValidationError(`No book found for id ${id}`);
        }
        return book;
    }

    @Query(returns => [Book])
    async books(@Arg('bookQuery') bookQuery: BookQueryInput): Promise<Book[]> {
        const pipeline = this.buildPipeline(bookQuery);
        const [error, books] = await to<Array<Book>>(this.bookRepository.aggregate(pipeline).toArray());
        if (error) {
            logErrorObject(error, 'Error in fetching books');
            throw new Error('Error in fetching books');
        }
        if (books) {
            logger.info(`Found ${books.length} books`);
            return books;
        }
    }

    @Mutation(returns => Book)
    async addBook(
        @Arg('book') bookInput: BookInput
    ): Promise<Book> {
        let error, book, author;
        const { title, authorId } = bookInput;
        [error, book] = await to<Book>(this.bookRepository.findOne({ title }));
        if (error) {
            logErrorObject(error, 'Error in fetching book');
            throw new Error('Error in adding book');
        }
        if (book) {
            logger.warn(`Book of title ${title} already exists`);
            throw new ValidationError(`Book of title ${title} already exists`);
        }
        [error, author] = await to<User>(this.userRepository.findOne({ uuid: authorId }));
        if (error) {
            logErrorObject(error, 'Error in fetching author');
            throw new Error('Error in adding author');
        }
        if (!author) {
            logger.warn(`Author of id ${authorId} does not exist`);
            throw new ValidationError(`Author of id ${authorId} does not exist`);
        }
        console.log('author', author);
        const newBook = this.bookRepository.create({ uuid: uuid(), ...bookInput });
        [error, book] = await to<Book>(this.bookRepository.save(newBook));
        if (error) {
            logErrorObject(error, 'Error in saving book');
            throw new Error('Error in adding book');
        }
        logger.info(`Book of title ${title} added`);
        console.log('new book', book);
        return book;
    }

    @Mutation(returns => Book)
    async updateBook(@Arg('id', type => String) id: string, @Arg('book') bookInput: BookInputPartial): Promise<Book> {
        let error: Error, book: Book, bookCheck: Book, authorCheck: User;
        const { title, authorId, price } = bookInput;
        [error, book] = await to<Book>(this.bookRepository.findOne({ uuid: id }));
        if (error) {
            logErrorObject(error, 'Error in fetching book');
            throw new Error('Error in updating book');
        }
        if (!book) {
            logger.warn(`Book of id ${id} does not exist`);
            throw new ValidationError(`Book of id ${id} does not exist`);
        }
        if (title) {
            [error, bookCheck] = await to<Book>(this.bookRepository.findOne({ title }));
            if (error) {
                logErrorObject(error, 'Error in fetching book');
                throw new Error('Error in updating book');
            }
            if (bookCheck) {
                logger.warn(`Book of title ${title} already exists`);
                throw new ValidationError(`Book of title ${title} already exists`);
            }
            book.title = title;
        }

        if (authorId) {
            [error, authorCheck] = await to<User>(this.userRepository.findOne({ uuid: authorId }));
            if (error) {
                logErrorObject(error, 'Error in fetching author');
                throw new Error('Error in updating author');
            }
            if (authorCheck) {
                logger.warn(`Author of id ${authorId} does not exist`);
                throw new ValidationError(`Author of id ${authorId} does not exist`);
            }
            book.authorId = authorId;
        }

        price && (book.price = price);

        [error, bookCheck] = await to<Book>(this.bookRepository.save(book));
        if (error) {
            logErrorObject(error, 'Error in saving book');
            throw new Error('Error in updating book');
        }
        logger.info(`Book ${bookCheck.title} updated`);

        return bookCheck;
    }

    @Mutation(returns => String)
    async deleteBook(@Arg('id', type => String) id: string): Promise<string> {
        let error, book;
        [error, book] = await to<Book>(this.bookRepository.findOne({ uuid: id }));
        if (error) {
            logErrorObject(error, 'Error when fetching book');
            throw new Error('Error in deleting book');
        }
        if (!book) {
            logger.warn(`Book of id ${id} does not exist`);
            throw new ValidationError(`Book of id ${id} does not exist`);
        }

        [error] = await to(this.bookRepository.remove(book));
        if (error) {
            logErrorObject(error, 'Error when deleting book');
            throw new Error('Error in deleting book');
        }

        logger.info(`Book of id ${id} removed`);

        return id;
    }

    @FieldResolver()
    async author(@Root() book: Book): Promise<User> {
        console.log('in field resolver');
        const [error, author] = await to<User>(this.userRepository.findOne({ uuid: book.authorId }));
        console.log('author', author);
        return author;
    }

    private buildPipeline = (query: BookQuery): Array<Pipeline> => {
        const pipeline: Array<Pipeline> = [];
        const limit = query.limit;
        const skip = query.skip;
        const sort = {
            [query.sortBy as string]: query.orderBy
        };

        const match = {};
        Object.assign(
            match,
            query.title && { title: { $regex: `${String(query.title)}`, $options: 'i' } },
            query.authorId && { authorId: String(query.authorId) }
        );

        const projection = {
            _id: 0,
            __v: 0
        };

        pipeline.push({ $match: match });
        pipeline.push({ $sort: sort });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        pipeline.push({ $project: projection });

        return pipeline;
    }
}
