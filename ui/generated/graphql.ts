import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users: Array<User>;
  book?: Maybe<Book>;
  books: Array<Book>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  userQuery: UserQueryInput;
};


export type QueryBookArgs = {
  id: Scalars['String'];
};


export type QueryBooksArgs = {
  bookQuery: BookQueryInput;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  uuid: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  age: Scalars['Float'];
  email: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type UserQueryInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  orderBy?: Maybe<Scalars['Float']>;
  sortBy?: Maybe<Scalars['String']>;
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID'];
  uuid: Scalars['String'];
  title: Scalars['String'];
  price: Scalars['Float'];
  author: User;
  authorId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type BookQueryInput = {
  title?: Maybe<Scalars['String']>;
  authorId?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  orderBy?: Maybe<Scalars['Float']>;
  sortBy?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUser: User;
  updateUser: User;
  deleteUser: Scalars['String'];
  addBook: Book;
  updateBook: Book;
  deleteBook: Scalars['String'];
};


export type MutationAddUserArgs = {
  user: UserInput;
};


export type MutationUpdateUserArgs = {
  user: UserInputPartial;
  id: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationAddBookArgs = {
  book: BookInput;
};


export type MutationUpdateBookArgs = {
  book: BookInputPartial;
  id: Scalars['String'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['String'];
};

export type UserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  age: Scalars['Float'];
};

export type UserInputPartial = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['Float']>;
};

export type BookInput = {
  title: Scalars['String'];
  price: Scalars['Float'];
  authorId: Scalars['String'];
};

export type BookInputPartial = {
  title?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  authorId?: Maybe<Scalars['String']>;
};

export type AddBookMutationVariables = Exact<{
  book: BookInput;
}>;


export type AddBookMutation = (
  { __typename?: 'Mutation' }
  & { addBook: (
    { __typename?: 'Book' }
    & Pick<Book, 'uuid' | 'title' | 'price'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'firstName'>
    ) }
  ) }
);

export type UpdateookMutationVariables = Exact<{
  book: BookInputPartial;
  id: Scalars['String'];
}>;


export type UpdateookMutation = (
  { __typename?: 'Mutation' }
  & { updateBook: (
    { __typename?: 'Book' }
    & Pick<Book, 'uuid' | 'title' | 'price'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'firstName'>
    ) }
  ) }
);

export type DeleteBookMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteBookMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteBook'>
);

export type GetBooksQueryVariables = Exact<{
  booksQuery: BookQueryInput;
}>;


export type GetBooksQuery = (
  { __typename?: 'Query' }
  & { books: Array<(
    { __typename?: 'Book' }
    & Pick<Book, 'uuid' | 'title' | 'price'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'firstName'>
    ) }
  )> }
);

export type GetBookQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetBookQuery = (
  { __typename?: 'Query' }
  & { book?: Maybe<(
    { __typename?: 'Book' }
    & Pick<Book, 'uuid' | 'title' | 'price'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'firstName'>
    ) }
  )> }
);

export type AddUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & { addUser: (
    { __typename?: 'User' }
    & Pick<User, 'uuid' | 'firstName' | 'lastName' | 'email' | 'age'>
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  user: UserInputPartial;
  id: Scalars['String'];
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & Pick<User, 'uuid' | 'firstName' | 'lastName' | 'email' | 'age'>
  ) }
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);

export type GetUsersQueryVariables = Exact<{
  userQuery: UserQueryInput;
}>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'uuid' | 'firstName' | 'lastName' | 'email' | 'age'>
  )> }
);

export type GetUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'uuid' | 'firstName' | 'lastName' | 'email' | 'age'>
  )> }
);


export const AddBookDocument = gql`
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

export function useAddBookMutation() {
  return Urql.useMutation<AddBookMutation, AddBookMutationVariables>(AddBookDocument);
};
export const UpdateookDocument = gql`
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

export function useUpdateookMutation() {
  return Urql.useMutation<UpdateookMutation, UpdateookMutationVariables>(UpdateookDocument);
};
export const DeleteBookDocument = gql`
    mutation DeleteBook($id: String!) {
  deleteBook(id: $id)
}
    `;

export function useDeleteBookMutation() {
  return Urql.useMutation<DeleteBookMutation, DeleteBookMutationVariables>(DeleteBookDocument);
};
export const GetBooksDocument = gql`
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

export function useGetBooksQuery(options: Omit<Urql.UseQueryArgs<GetBooksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetBooksQuery>({ query: GetBooksDocument, ...options });
};
export const GetBookDocument = gql`
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

export function useGetBookQuery(options: Omit<Urql.UseQueryArgs<GetBookQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetBookQuery>({ query: GetBookDocument, ...options });
};
export const AddUserDocument = gql`
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

export function useAddUserMutation() {
  return Urql.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument);
};
export const UpdateUserDocument = gql`
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

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
};
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: String!) {
  deleteUser(id: $id)
}
    `;

export function useDeleteUserMutation() {
  return Urql.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument);
};
export const GetUsersDocument = gql`
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

export function useGetUsersQuery(options: Omit<Urql.UseQueryArgs<GetUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUsersQuery>({ query: GetUsersDocument, ...options });
};
export const GetUserDocument = gql`
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

export function useGetUserQuery(options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
};