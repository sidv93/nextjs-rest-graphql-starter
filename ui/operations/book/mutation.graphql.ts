import gql from 'graphql-tag';

export const addBook = gql`
    mutation AddBook($book: BookInput!) {
        addBook(book: $book) {
            uuid
            title
            price
            author {
                firstName
            }
        }
    }
`;

export const updateBook = gql`
    mutation Updateook($book: BookInputPartial!, $id: String!) {
        updateBook(book: $book, id: $id) {
            uuid
            title
            price
            author {
                firstName
            }
        }
    }
`;

export const deleteBook = gql`
    mutation DeleteBook($id: String!) {
        deleteBook(id: $id)
    }
`;
