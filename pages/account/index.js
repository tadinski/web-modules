import { Input } from "baseui/input";
import { Cell, Grid } from "baseui/layout-grid";
import useUser from "@/utils/user-fetcher";
import { Button } from "baseui/button";
import { useStyletron } from "baseui";
import { useState, useEffect } from "react";
import { FormControl } from "baseui/form-control";
import { useRouter } from "next/router";
import { useSnackbar, DURATION } from "baseui/snackbar";
import { Check, DeleteAlt } from "baseui/icon";

export default function Account() {
  const router = useRouter();

  const { userData, updateUser, userLoggedOut, userLoading } = useUser();

  useEffect(() => {
    if (userLoggedOut) router.push("/login");
  }, [userLoggedOut, router]);

  const [inputValues, setInputValues] = useState([
    {
      fieldName: "First name",
      userValueToFetch: "fname",
      buttonDisabled: true,
      fieldValue: "",
    },
    {
      fieldName: "Last name",
      userValueToFetch: "lname",
      buttonDisabled: true,
      fieldValue: "",
    },
    {
      fieldName: "Email",
      userValueToFetch: "email",
      buttonDisabled: true,
      fieldValue: "",
    },
    {
      fieldName: "Phone",
      userValueToFetch: "phone",
      buttonDisabled: true,
      fieldValue: "",
    },
  ]);

  const [css] = useStyletron();
  const { enqueue } = useSnackbar();

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index].fieldValue = value;
    setInputValues(newInputValues);
  };

  const toggleEditState = (index) => {
    const newInputValues = [...inputValues];
    newInputValues[index].buttonDisabled =
      !newInputValues[index].buttonDisabled;
    newInputValues[index].fieldValue = "";
    setInputValues(newInputValues);
  };

  async function handleSave(index) {
    const isChangeEmail = inputValues[index].userValueToFetch == "email";
    const newValue = inputValues[index].fieldValue;
    if (newValue) {
      const { data, error } = await updateUser(
        {
          [inputValues[index].userValueToFetch]: newValue,
        },
        isChangeEmail
      );
      if (data) {
        console.log(data);
        toggleEditState(index);
        enqueue(
          {
            message: isChangeEmail
              ? "Check your email to confirm change"
              : "Successfully updated",
            startEnhancer: ({ size }) => <Check size={size} />,
          },
          DURATION.medium
        );
      }
      if (error) {
        enqueue(
          {
            message: `Failed to update: ${error.response.data.error.message}`,
            startEnhancer: ({ size }) => <DeleteAlt size={size} />,
          },
          DURATION.medium
        );
      }
    }
  }

  if (userLoading) {
    return "Loading or not authenticated...";
  }
  return (
    <Grid>
      <Cell span={[4, 6]} skip={[0, 1, 3]}>
        <div className={css({ marginTop: "20px" })}>
          {userData &&
            inputValues.map((n, index) => (
              <div key={n.fieldName} className={css({ marginBottom: "10px" })}>
                <FormControl label={n.fieldName}>
                  <Input
                    disabled={n.buttonDisabled}
                    placeholder={userData[n.userValueToFetch]}
                    value={n.fieldValue}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    endEnhancer={() => (
                      <Button
                        size="compact"
                        onClick={() => {
                          if (n.buttonDisabled) {
                            toggleEditState(index);
                          } else {
                            handleSave(index);
                          }
                        }}
                      >
                        {n.buttonDisabled ? "Edit" : "Save"}
                      </Button>
                    )}
                  />
                </FormControl>
              </div>
            ))}
        </div>
      </Cell>
    </Grid>
  );
}
