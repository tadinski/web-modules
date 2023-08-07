import { AppNavBar, setItemActive } from "baseui/app-nav-bar";
import { ChevronDown, Delete, Upload } from "baseui/icon";
import { useState } from "react";
import { LogoutIcon, SettingsIcon, SunIcon } from "./icons/icons";
import { useRouter } from "next/router";
import { useStyletron } from "baseui";
import { signOut, useSession } from "next-auth/react";
import { Button } from "baseui/button";
import Link from "next/link";
import Logo from "./icons/logo";
import {
  StyledPrimaryMenuContainer,
  StyledMainMenuItem,
} from "baseui/app-nav-bar";

export default function Nav({ toggleTheme }) {
  const { data: session } = useSession();
  const [css, theme] = useStyletron();
  const router = useRouter();
  function handleMainItemSelect(item) {
    setMainItems((prev) => setItemActive(prev, item));
    router.push(item.url);
  }
  const [mainItems, setMainItems] = useState([
    {
      icon: ChevronDown,
      label: "Bookings",
      url: "/lifts",
      navExitIcon: Delete,
      children: [
        { icon: Upload, label: "Today" },
        { icon: Upload, label: "Upcoming" },
      ],
    },
    { icon: Upload, label: "Lifts", url: "/lifts" },
  ]);
  return (
    <div>
      <AppNavBar
        overrides={{
          PrimaryMenuContainer: ({ ...children }) => (
            <StyledPrimaryMenuContainer>
              <StyledMainMenuItem {...children} />
              {!session && (
                <div
                  className={css({
                    display: "flex",
                    alignItems: "flex-start",
                    marginLeft: "40px",
                  })}
                >
                  <Link href={"/login"} passHref>
                    <StyledMainMenuItem>Login</StyledMainMenuItem>
                  </Link>
                  <Button onClick={() => router.push("/signup")} size="mini">
                    Join
                  </Button>
                </div>
              )}
              <div
                className={css({
                  display: "flex",
                  marginLeft: "8px",
                  cursor: "pointer",
                  color: theme.colors.primaryA,
                })}
                onClick={() => toggleTheme()}
              >
                <SunIcon />
              </div>
            </StyledPrimaryMenuContainer>
          ),
        }}
        title={<Logo />}
        mainItems={mainItems}
        onMainItemSelect={handleMainItemSelect}
        username="Marshmallow"
        userItems={
          session
            ? [
                { icon: SettingsIcon, label: "Settings" },
                { icon: LogoutIcon, label: "Log out" },
              ]
            : ""
        }
        onUserItemSelect={(item) =>
          item.label === "Log out"
            ? signOut()
            : item.label === "Settings"
            ? router.push("/account")
            : ""
        }
      />
    </div>
  );
}
