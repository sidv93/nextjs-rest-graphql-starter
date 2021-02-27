import gql from 'graphql-tag';

export const getUsers = gql`
    query GetUsers($userQuery: UserQueryInput!) {
        users(userQuery: $userQuery) {
            uuid
            firstName
            lastName
            email
            age
        }
    }
`;

export const getUser = gql`
    query GetUser($id: String!) {
        user(id: $id) {
            uuid
            firstName
            lastName
            email
            age
        }
    }
`;
