import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "baseui/spinner";
import { useStyletron } from "baseui";
import { DURATION, useSnackbar } from "baseui/snackbar";
import Check from "baseui/icon/check";
import Alert from "baseui/icon/alert";
import { mutate } from "swr";
import axios from "axios";

export default function ConfirmEmailChange() {
  const [css] = useStyletron();
  const { enqueue } = useSnackbar();
  const router = useRouter();
  const { token } = router.query;
  const [errorContent, setErrorContent] = useState("");
  console.log(errorContent);

  useEffect(() => {
    if (token) {
      async function confirmEmail() {
        try {
          await axios.get(
            `${process.env.NEXT_PUBLIC_REST}/users/email-confirmation`,
            { params: { confirmation: token } }
          );
          mutate("user");
          router.replace("/account");
          enqueue(
            {
              message: "Successfully updated email",
              startEnhancer: () => <Check />,
            },
            DURATION.short
          );
        } catch (error) {
          setErrorContent(error);
        }
      }
      confirmEmail();
    }
  }, [token]);

  useEffect(() => {
    if (errorContent) {
      enqueue(
        {
          message:
            errorContent.response?.data.error.message == "Invalid token"
              ? "Invalid token. Try updating the email again"
              : errorContent.response?.data.error.message == "Forbidden"
              ? "You need to be logged in"
              : "Error has occured, refresh the page and try to sign in again",
          startEnhancer: () => <Alert />,
        },
        DURATION.long
      );
      router.push("/account");
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
