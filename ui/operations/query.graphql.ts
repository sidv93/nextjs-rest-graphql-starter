import gql from 'graphql-tag';

export const getUsers = gql`
    query GetUsers {
        users(userQuery: {firstName: "ram", orderBy:1}) {
            email
        }
    }
`;
