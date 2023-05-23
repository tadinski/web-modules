import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Spinner } from "baseui/spinner";
import { useStyletron } from "baseui";
import { DURATION, useSnackbar } from "baseui/snackbar";
import Check from "baseui/icon/check";
import Alert from "baseui/icon/alert";

export default function LoginVerification() {
  const [css] = useStyletron();
  const { enqueue } = useSnackbar();
  const router = useRouter();
  const { token } = router.query;
  const [errorContent, setErrorContent] = useState("");

  useEffect(() => {
    if (token) {
      const signInUser = async () => {
        try {
          const { data: user, error } = await signIn("credentials", {
            redirect: false,
            token: token,
          });
          if (error) {
            throw error;
          }
          router.replace("/");
          enqueue(
            {
              message: "Successfully signed in",
              startEnhancer: () => <Check />,
            },
            DURATION.short
          );
        } catch (error) {
          setErrorContent(error);
        }
      };
      signInUser();
    }
  }, [token]);

  useEffect(() => {
    if (errorContent) {
      enqueue(
        {
          message:
            errorContent == "token.invalid"
              ? "Invalid token. Sign in again to receive a new link"
              : "Error has occured, refresh the page and try to sign in again",
          startEnhancer: () => <Alert />,
        },
        DURATION.long
      );
      router.push("/login");
    }
  }, [errorContent]);

  return (
    <div
      className={css({
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      })}
    >
      <Spinner />
    </div>
  );
}
