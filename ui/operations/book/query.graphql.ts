import gql from 'graphql-tag';

export const getBooks = gql`
    query GetBooks($booksQuery: BookQueryInput!) {
        books(bookQuery: $booksQuery) {
            uuid
            title
            price
            author {
                firstName
            }
        }
    }
`;

export const getBook = gql`
    query GetBook($id: String!) {
        book(id: $id) {
            uuid
            title
            price
            author {
                firstName
            }
        }
    }
`;
