import { FormControl } from "baseui/form-control";
import { useStyletron } from "baseui";
import { Input } from "baseui/input";
import { useState } from "react";
import { validate as validateEmail } from "email-validator";
import { DURATION, useSnackbar } from "baseui/snackbar";
import EmailIcon from "@/components/icons/email-icon";
import { postData } from "@/utils/helpers";
import { Button } from "baseui/button";
import { StyledLink } from "baseui/link";
import Link from "next/link";
import { LabelSmall } from "baseui/typography";
import { Heading, HeadingLevel } from "baseui/heading";

function Login() {
  const [css] = useStyletron();
  const { enqueue } = useSnackbar();
  const [loadingState, setLoadingState] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const [value, setValue] = useState({
    value: "",
    valid: false,
    visited: false,
  });

  const onChange = (e) => {
    setErrorContent("");
    setValue({
      ...value,
      value: e.target.value,
      valid: validateEmail(e.target.value),
    });
  };

  const onBlur = () => {
    setValue({
      ...value,
      visited: true,
    });
  };

  const handleLogin = async (email) => {
    setLoadingState(true);
    try {
      if (!email || !email.includes("@") || email.trim().length < 3) {
        throw "Please check your email";
      }
      const res = await postData({
        url: process.env.NEXT_PUBLIC_REST + "/passwordless/send-link",
        data: { username: email },
      });
      if (res.error) {
        throw res.error.message;
      }

      enqueue(
        {
          message:
            "We emailed you a link. Please click on that link to sign in",
          startEnhancer: () => <EmailIcon />,
        },
        DURATION.infinite
      );
      setValue({ value: "" });
    } catch (error) {
      setErrorContent(error);
      setLoadingState(false);
    }
    setLoadingState(false);
  };
  return (
    <div
      className={css({
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
      })}
    >
      <div
        className={css({
          width: "360px",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <HeadingLevel>
          <Heading styleLevel={4}>Welcome back. Sign In</Heading>
          <FormControl
            label="Your email"
            error={
              errorContent
                ? errorContent == "wrong.email"
                  ? "We don't recognize this email, are you sure you have an account?"
                  : errorContent
                : value.visited && !value.valid
                ? "Please input a valid email address"
                : null
            }
          >
            <Input
              name="email"
              value={value.value}
              onChange={onChange}
              onBlur={onBlur}
              error={value.visited && !value.valid}
              type="email"
              required
            />
          </FormControl>
          <Button
            onClick={() => handleLogin(value.value)}
            disabled={!value.valid}
            isLoading={loadingState}
          >
            Sign In
          </Button>
          <LabelSmall className={css({ marginTop: "24px" })}>
            Don't have an account?
            <Link href="/signup" passHref>
              <StyledLink className={css({ paddingLeft: "10px" })}>
                Sign Up as a Service Provider
              </StyledLink>
            </Link>
          </LabelSmall>
        </HeadingLevel>
      </div>
    </div>
  );
}

export default Login;
