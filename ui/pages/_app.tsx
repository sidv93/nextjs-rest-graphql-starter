import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from '../styles';
import { createClient, Provider as UrqlProvider } from 'urql';

const client = createClient({
    url: 'http://localhost/graphql',
});

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
