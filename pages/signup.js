import useUser from "@/utils/user-fetcher";
import { useRouter } from "next/router";
import { useStyletron } from "baseui";
import { ProgressSteps, Step } from "baseui/progress-steps";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { useState, useEffect } from "react";
import { PhoneInput, COUNTRIES } from "baseui/phone-input";
import { validate as validateEmail } from "email-validator";
import { postData } from "@/utils/helpers";
import SpacedButton from "@/components/spaced-button";
import { Heading, HeadingLevel } from "baseui/heading";
import { StyledLink } from "baseui/link";
import Link from "next/link";
import { LabelSmall, HeadingMedium, LabelXSmall } from "baseui/typography";
import { useSnackbar, DURATION } from "baseui/snackbar";
import { PinCode } from "baseui/pin-code";
import { Toast, KIND, ToasterContainer, toaster } from "baseui/toast";
import axios from "axios";
import { Button } from "baseui/button";
import useSecondCounter from "hooks/counter";
import { EditIcon, RefreshIcon } from "@/components/icons/icons";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/mobile";
import { valuesPreset } from "@/utils/presets";

function ProgressStepsContainer() {
  const router = useRouter();
  const { userLoggedOut, userLoading } = useUser();

  useEffect(() => {
    if (!userLoggedOut && !userLoading) router.replace("/");
  }, [userLoggedOut, userLoading]);

  const [css, theme] = useStyletron();
  const { enqueue } = useSnackbar();
  const [seconds, isFinished, isRunning, startCounter, resetCounter] =
    useSecondCounter(5);
  const [loadingState, setLoadingState] = useState(false);
  const [current, setCurrent] = useState(0);
  const [formattedNumber, setFormattedNumber] = useState("");
  const [isPhoneVerificationError, setIsPhoneVerificationError] =
    useState(false);

  const [values, setValues] = useState(valuesPreset);
  const [pinValues, setPinValues] = useState(Array(6).fill(""));
  const [verificationID, setverificationID] = useState("");
  const [country, setCountry] = useState(COUNTRIES.BE);

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: {
        ...values[e.target.name],
        data: e.target.value,
        valid:
          (e.target.name === "fname" ||
            e.target.name === "lname" ||
            e.target.name === "company") &&
          e.target.value.trim().length > 2
            ? true
            : e.target.name === "email"
            ? validateEmail(e.target.value)
            : e.target.name === "phone"
            ? e.target.value.trim().length > 2 &&
              isValidPhoneNumber(e.target.value, country.id)
            : false,
      },
    });
  };

  const onBlur = (e) => {
    setValues({
      ...values,
      [e.target.name]: {
        ...values[e.target.name],
        visited: true,
      },
    });
  };

  const resetPinForm = () => {
    setPinValues(Array(6).fill(""));
    setIsPhoneVerificationError(false);
  };

  useEffect(() => {
    if (!values.phone.data) return;
    if (isValidPhoneNumber(values.phone.data, country.id)) {
      const number = parsePhoneNumber(values.phone.data, country.id);
      setFormattedNumber(number.format("E.164"));
    } else {
      setFormattedNumber("");
    }
  }, [values.phone.data]);

  //checks if all inputs are valid
  function allValid() {
    const arr = [];
    for (const eachInput in values) {
      arr.push(values[eachInput].valid);
    }
    return arr.every((v) => v === true);
  }

  async function register(e) {
    e?.preventDefault();
    setLoadingState(true);
    const result = await axios.post("/api/auth/signup", {
      email: values.email.data,
      fname: values.fname.data,
      lname: values.lname.data,
      phone: formattedNumber,
      company_name: values.company.data,
    });
    console.log(result);
    setLoadingState(false);
    if (result.data.isAlreadyregisteredBefore) {
      enqueue(
        {
          message:
            "Account already exists. Check email for sign-in link to update contact details.",
        },
        DURATION.infinite
      );
    }
    setCurrent(current + 1);
    return result;
  }

  async function sendVerificationSMS(e) {
    e?.preventDefault();
    setLoadingState(true);
    resetPinForm();
    resetCounter();
    try {
      const {
        data: { id, status, recipient, error },
      } = await axios.post("/api/sms/send", {
        phone: formattedNumber,
      });
      if (status === "sent") {
        setverificationID(id);
        setLoadingState(false);
        setCurrent(current + 1);
      }
      if (error) toaster.negative(error.message);
      setLoadingState(false);
    } catch (error) {
      toaster.negative(error);
      setLoadingState(false);
    }
  }

  async function verifyToken(e, token) {
    e?.preventDefault();
    setLoadingState(true);
    try {
      const { data } = await axios.post("/api/sms/verify", {
        id: verificationID,
        token: token,
      });
      console.log(data);
      if (data.status === "verified") {
        setLoadingState(false);
        setCurrent(current + 1);
      } else {
        console.log(data);
        setIsPhoneVerificationError(true);
      }
      setCurrent(current + 1);
      setLoadingState(false);
    } catch (error) {
      setCurrent(current + 1);
      setIsPhoneVerificationError(true);
    }
    setLoadingState(false);
  }

  console.log(values);

  return (
    <ToasterContainer>
      <div
        className={css({
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          background: theme.colors.backgroundPrimary,
        })}
      >
        <div
          className={css({
            width: "480px",
            display: "flex",
            flexDirection: "column",
          })}
        >
          <HeadingMedium>Become a Service Provider</HeadingMedium>
          <ProgressSteps current={current}>
            <Step title="Personal Details">
              <FormControl
                label={() => "Company name"}
                error={
                  values.company.visited && !values.company.valid
                    ? "company name must include at least 3 characters"
                    : null
                }
              >
                <Input
                  name="company"
                  value={values.company.data}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={values.company.visited && !values.company.valid}
                  required
                />
              </FormControl>
              <FormControl
                label={() => "First name"}
                error={
                  values.fname.visited && !values.fname.valid
                    ? "First name must include at least 3 characters"
                    : null
                }
              >
                <Input
                  name="fname"
                  value={values.fname.data}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={values.fname.visited && !values.fname.valid}
                  required
                />
              </FormControl>
              <FormControl
                label={() => "Last name"}
                error={
                  values.lname.visited && !values.lname.valid
                    ? "Last name must include at least 3 characters"
                    : null
                }
              >
                <Input
                  name="lname"
                  value={values.lname.data}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={values.lname.visited && !values.lname.valid}
                  required
                />
              </FormControl>
              <SpacedButton
                disabled={
                  !values.company.valid ||
                  !values.fname.valid ||
                  !values.lname.valid
                }
                onClick={() => setCurrent(current + 1)}
              >
                Next
              </SpacedButton>
            </Step>
            <Step title="Phone">
              <FormControl>
                <PhoneInput
                  name="phone"
                  text={values.phone.data}
                  onTextChange={(e) => onChange(e)}
                  country={country}
                  onBlur={onBlur}
                  error={values.phone.visited && !values.phone.valid}
                  onCountryChange={({ option }) => setCountry(option)}
                />
              </FormControl>
              <SpacedButton onClick={() => setCurrent(current - 1)}>
                Previous
              </SpacedButton>
              <SpacedButton
                onClick={(e) => sendVerificationSMS(e)}
                disabled={!values.phone.valid}
                isLoading={loadingState}
              >
                Next
              </SpacedButton>
            </Step>
            <Step title="Verify phone">
              <LabelXSmall>
                <LabelXSmall>
                  Enter the code we sent to {formattedNumber}
                </LabelXSmall>
              </LabelXSmall>
              <div className={css({ margin: "40px 0px" })}>
                <PinCode
                  size="compact"
                  values={pinValues}
                  error={isPhoneVerificationError}
                  onChange={({ event, values }) => {
                    setPinValues(values);
                    // if all of our inputs are filled in,
                    // shift focus to our submit button
                    if (!values.includes("")) {
                      verifyToken(event, values.join(""));
                    }
                  }}
                />
              </div>
              <div
                className={css({
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "20px",
                  justifyContent: "left",
                  gap: "10px",
                })}
              >
                <Button
                  size="mini"
                  shape="pill"
                  kind="secondary"
                  startEnhancer={() => <EditIcon />}
                  onClick={() => setCurrent(current - 1)}
                >
                  change number
                </Button>
                <Button
                  size="mini"
                  shape="pill"
                  kind="secondary"
                  disabled={isRunning && !isFinished}
                  startEnhancer={() =>
                    isRunning && !isFinished ? seconds : <RefreshIcon />
                  }
                  onClick={() => sendVerificationSMS()}
                >
                  request new code
                </Button>
              </div>
            </Step>
            <Step title="Email">
              <FormControl
                label="Your email"
                error={
                  values.email.visited && !values.email.valid
                    ? "Please input a valid email address"
                    : null
                }
              >
                <Input
                  name="email"
                  value={values.email.data}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={values.email.visited && !values.email.valid}
                  type="email"
                  required
                />
              </FormControl>
              <SpacedButton
                onClick={(e) => register(e)}
                disabled={!allValid()}
                isLoading={loadingState}
              >
                Next
              </SpacedButton>
            </Step>
            <Step title="Verify email">
              <LabelXSmall>
                Click on the link received at {values.email.data}
              </LabelXSmall>
              <SpacedButton onClick={() => setCurrent(current - 1)}>
                Change email
              </SpacedButton>
            </Step>
          </ProgressSteps>
          <LabelSmall className={css({ marginTop: "24px" })}>
            Already have an ccount?
            <Link href="/login" passHref>
              <StyledLink className={css({ paddingLeft: "10px" })}>
                Sign In
              </StyledLink>
            </Link>
          </LabelSmall>
        </div>
      </div>
    </ToasterContainer>
  );
}
export default ProgressStepsContainer;
