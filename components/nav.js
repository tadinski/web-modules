import { AppNavBar, setItemActive } from "baseui/app-nav-bar";
import { ChevronDown, Delete, Overflow, Upload } from "baseui/icon";
import { useEffect, useState } from "react";
import Logo from "./icons/logo";
import { useRouter } from "next/router";
import { useStyletron } from "styletron-react";
import LogoutIcon from "./icons/logout";
import { useSession, signOut } from "next-auth/react";
import { Button } from "baseui/button";
import Link from "next/link";
import { StyledLink } from "baseui/link";
import { StyledMainMenuItem } from "baseui/app-nav-bar";

export default function Nav() {
  const [css, theme] = useStyletron();
  const router = useRouter();
  const { data: session, status } = useSession();
  function handleMainItemSelect(item) {
    setMainItems((prev) => setItemActive(prev, item));
    router.push(item.url);
  }
  const [mainItems, setMainItems] = useState([
    {
      icon: ChevronDown,
      label: "Bookings",
      url: "/bookings",
      navExitIcon: Delete,
      children: [
        { icon: Upload, label: "Today" },
        { icon: Upload, label: "Upcoming" },
      ],
    },
    { icon: Upload, label: "Lifts", url: "/lifts" },
  ]);

  return (
    <div className={css({ marginBottom: "24px" })}>
      <AppNavBar
        overrides={
          !session &&
          status !== "loading" && {
            PrimaryMenuContainer: () => (
              <div className={css({ display: "flex", flexDirection: "row" })}>
                <Link href={"/login"} passHref>
                  <StyledMainMenuItem>Login</StyledMainMenuItem>
                </Link>
                <Button onClick={() => router.push("/signup")} size="mini">
                  Join
                </Button>
              </div>
            ),
          }
        }
        title={<Logo />}
        mainItems={mainItems}
        onMainItemSelect={handleMainItemSelect}
        username="Marshmallow"
        usernameSubtitle="profile"
        userItems={
          session && status != "loading"
            ? [{ icon: LogoutIcon, label: "Log out" }]
            : ""
        }
        onUserItemSelect={(item) => (item.label === "Log out" ? signOut() : "")}
      />
    </div>
  );
}
