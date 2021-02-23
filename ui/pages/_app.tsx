import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme} from '../styles';

export default function App({ Component, pageProps }) {
    return (
        <>
            <GlobalStyles />
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
}
