import { Provider as StyletronProvider } from "styletron-react";
import { styletron } from "../styletron";
import { LightTheme, BaseProvider } from "baseui";
import Nav from "../components/nav";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "baseui/snackbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={LightTheme}>
        <SnackbarProvider>
          <SessionProvider session={session}>
            <Nav />
            <Component {...pageProps} />
          </SessionProvider>
        </SnackbarProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}
