import { useStyletron } from "baseui";
import { ProgressSteps, Step } from "baseui/progress-steps";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { useState } from "react";
import { PhoneInput } from "baseui/phone-input";
import { validate as validateEmail } from "email-validator";
import { postData } from "@/utils/helpers";
import SpacedButton from "@/components/spaced-button";
import { Heading, HeadingLevel } from "baseui/heading";
import { StyledLink } from "baseui/link";
import Link from "next/link";
import { LabelSmall } from "baseui/typography";

function ProgressStepsContainer() {
  const [css, theme] = useStyletron();
  const [loadingState, setLoadingState] = useState(false);
  const [current, setCurrent] = useState(0);
  const [value, setValue] = useState({
    fname: {
      value: "",
      valid: false,
      visited: false,
    },
    lname: {
      value: "",
      valid: false,
      visited: false,
    },
    email: {
      value: "",
      valid: false,
      visited: false,
    },
    phone: {
      value: "",
      country: "",
      valid: false,
      visited: false,
    },
    company: {
      value: "",
      valid: false,
      visited: false,
    },
  });
  const [country, setCountry] = useState(undefined);
  const onChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: {
        ...value[e.target.name],
        value: e.target.value,
        valid:
          (e.target.name === "fname" ||
            e.target.name === "lname" ||
            e.target.name === "company") &&
          e.target.value.trim().length > 2
            ? true
            : e.target.name === "email"
            ? validateEmail(e.target.value)
            : e.target.name === "phone"
            ? /^\d+$/.test(e.target.value) && e.target.value.trim().length > 3
            : false,
      },
    });
  };
  const onBlur = (e) => {
    setValue({
      ...value,
      [e.target.name]: {
        ...value[e.target.name],
        visited: true,
      },
    });
  };

  //checks if all inputs are valid
  function allValid() {
    const arr = [];
    for (const eachInput in value) {
      arr.push(value[eachInput].valid);
    }
    return arr.every((v) => v === true);
  }

  async function register(e) {
    e.preventDefault();
    setLoadingState(true);
    const result = await postData({
      url: "/api/auth/signup",
      data: {
        email: value.email.value,
        fname: value.fname.value,
        lname: value.lname.value,
        phone: country.dialCode + value.phone.value,
        company_name: value.company.value,
      },
    });
    setLoadingState(false);
    setCurrent(2);
    return result;
  }

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
          width: "480px",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <HeadingLevel>
          <Heading styleLevel={4}>Register as Service Provider</Heading>
          <ProgressSteps current={current}>
            <Step title="Company details">
              <FormControl
                label={() => "company name"}
                error={
                  value.company.visited && !value.company.valid
                    ? "company name must include at least 3 characters"
                    : null
                }
              >
                <Input
                  name="company"
                  value={value.company.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={value.company.visited && !value.company.valid}
                  required
                />
              </FormControl>
              <SpacedButton disabled>Previous</SpacedButton>
              <SpacedButton
                disabled={!value.company.valid}
                onClick={() => setCurrent(1)}
              >
                Next
              </SpacedButton>
            </Step>
            <Step title="Contact">
              <FormControl
                label={() => "First name"}
                error={
                  value.fname.visited && !value.fname.valid
                    ? "First name must include at least 3 characters"
                    : null
                }
              >
                <Input
                  name="fname"
                  value={value.fname.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={value.fname.visited && !value.fname.valid}
                  required
                />
              </FormControl>
              <FormControl
                label={() => "Last name"}
                error={
                  value.lname.visited && !value.lname.valid
                    ? "Last name must include at least 3 characters"
                    : null
                }
              >
                <Input
                  name="lname"
                  value={value.lname.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={value.lname.visited && !value.lname.valid}
                  required
                />
              </FormControl>
              <FormControl
                label="Your email"
                error={
                  value.email.visited && !value.email.valid
                    ? "Please input a valid email address"
                    : null
                }
              >
                <Input
                  name="email"
                  value={value.email.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={value.email.visited && !value.email.valid}
                  type="email"
                  required
                />
              </FormControl>
              <FormControl label={() => "Phone"}>
                <PhoneInput
                  name="phone"
                  text={value.phone.value}
                  onTextChange={onChange}
                  country={country}
                  onBlur={onBlur}
                  error={value.phone.visited && !value.phone.valid}
                  onCountryChange={({ option }) => setCountry(option)}
                  overrides={{
                    Input: {
                      props: {
                        overrides: {
                          Root: {
                            style: {
                              width: "300px",
                            },
                          },
                        },
                      },
                    },
                  }}
                />
              </FormControl>
              <SpacedButton onClick={() => setCurrent(0)}>
                Previous
              </SpacedButton>
              <SpacedButton
                onClick={(e) => register(e)}
                disabled={!allValid()}
                isLoading={loadingState}
              >
                Next
              </SpacedButton>
            </Step>
            <Step title="Verify email">
              <div className={css({ ...theme.typography.ParagraphSmall })}>
                We sent you an email. Please click the link to verify your email
                address
              </div>
              <SpacedButton onClick={() => setCurrent(1)}>
                Previous
              </SpacedButton>
              <SpacedButton disabled>Next</SpacedButton>
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
        </HeadingLevel>
      </div>
    </div>
  );
}
export default ProgressStepsContainer;
