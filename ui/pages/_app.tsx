import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from '../styles';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { createClient, Provider as UrqlProvider } from 'urql';
const client = createClient({
    url: 'http://localhost/graphql',
});

// const client = new ApolloClient({
//     uri: 'http://localhost/graphql',
//     cache: new InMemoryCache()
// });

export default function App({ Component, pageProps }) {
    return (
        <>
            <GlobalStyles />
            <ThemeProvider theme={theme}>
                <UrqlProvider value={client}>
                    <Component {...pageProps} />
                </UrqlProvider>
            </ThemeProvider>
        </>
    )
}
