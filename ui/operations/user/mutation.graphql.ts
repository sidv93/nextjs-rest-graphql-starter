import gql from 'graphql-tag';

export const addUser = gql`
    mutation AddUser($user: UserInput!) {
        addUser(user: $user) {
            uuid
            firstName
            lastName
            email
            age
        }
    }
`;

export const updateUser = gql`
    mutation UpdateUser($user: UserInputPartial!, $id: String!) {
        updateUser(user: $user, id: $id) {
            uuid
            firstName
            lastName
            email
            age
        }
    }
`;

export const deleteUser = gql`
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
    }
`;
