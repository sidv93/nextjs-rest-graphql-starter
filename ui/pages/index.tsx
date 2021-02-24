import Head from 'next/head';
import styled from 'styled-components';
import { useGetUsersQuery } from '../generated/graphql';

const Container = styled.div`
    min-height: 100vh;
    padding: 0 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Main = styled.main`
    padding: 5rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Title = styled.h1`
    margin: 0;
    line-height: 1.15;
    font-size: 4rem;
    text-align: center;

    & > a {
        color: #0070f3;
        text-decoration: none;
    }
    & > a:hover, & > a:focus, & > a:active {
        text-decoration: underline;
    }

`;
const Description = styled.p`
    line-height: 1.5;
    font-size: 1.5rem;
`;
const Code = styled.code`
    background: #fafafa;
    border-radius: 5px;
    padding: 0.75rem;
    font-size: 1.1rem;
    font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
        Bitstream Vera Sans Mono, Courier New, monospace;
`;

export default function Home() {
    const [result, reexecuteQuery] = useGetUsersQuery();
    const { data, fetching, error } = result;
    if (fetching) return <p>Loading...</p>
    if (error) return <p>{error.message}</p>
    return (
        <Container>
            <p>{data.users[0].email}</p>
            <Head>
                <title>Next Sample App</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Main>
                <Title>Welcome to <a href='https://nextjs.org'>Next.js!</a></Title>
                <Description>
                    Get started by editing{' '}
                    <Code>pages/index.tsx</Code>
                </Description>
            </Main>
        </Container>
    )
}
