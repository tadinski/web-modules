import { Provider as StyletronProvider } from "styletron-react";
import { styletron } from "../styletron";
import { BaseProvider, LightTheme, DarkTheme } from "baseui";
import Nav from "../components/nav";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { SnackbarProvider } from "baseui/snackbar";
import "styles/global.css";

const THEME = {
  light: "light",
  dark: "dark",
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [theme, setTheme] = useState(THEME.light);
  function toggleTheme() {
    setTheme(theme === THEME.light ? THEME.dark : THEME.light);
  }

  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={theme === THEME.light ? LightTheme : DarkTheme}>
        <SessionProvider session={session}>
          <SnackbarProvider>
            <Nav toggleTheme={toggleTheme} />
            <Component {...pageProps} />
          </SnackbarProvider>
        </SessionProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}
