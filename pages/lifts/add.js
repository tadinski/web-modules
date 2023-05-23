import { ProgressSteps, NumberedStep } from "baseui/progress-steps";
import { Button, SHAPE, KIND, SIZE } from "baseui/button";
import { useState } from "react";
import Wrapper from "@/components/styling/wrapper";
import LiftDetails from "@/components/forms/lift-details";
import AreaOfService from "@/components/forms/area-service";
import ScheduleLift from "@/components/forms/schedule-lift";
import { SnackbarProvider } from "baseui/snackbar";
import Review from "@/components/forms/review";

function SpacedButton(props) {
  return (
    <Button
      {...props}
      shape={SHAPE.pill}
      kind={KIND.secondary}
      size={SIZE.compact}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => ({
            marginLeft: $theme.sizing.scale200,
            marginRight: $theme.sizing.scale200,
            marginTop: $theme.sizing.scale800,
          }),
        },
      }}
    />
  );
}
function ProgressStepsContainer() {
  const [current, setCurrent] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [liftValues, setLiftValues] = useState({
    plate: {
      value: "",
      valid: false,
      visited: false,
    },
    weight: {
      value: "",
      valid: false,
      visited: false,
    },
    height: {
      value: "",
      valid: false,
      visited: false,
    },
    price: {
      value: "",
      valid: false,
      visited: false,
    },
  });

  const [timeValues, setTimeValues] = useState([
    {
      day: "Monday",
      from: new Date().setHours(8, 0),
      to: new Date().setHours(18, 0),
      enabled: true,
    },
    {
      day: "Tuesday",
      from: new Date().setHours(8, 0),
      to: new Date().setHours(18, 0),
      enabled: true,
    },
    {
      day: "Wednesday",
      from: new Date().setHours(8, 0),
      to: new Date().setHours(18, 0),
      enabled: true,
    },
    {
      day: "Thursday",
      from: new Date().setHours(8, 0),
      to: new Date().setHours(18, 0),
      enabled: true,
    },
    {
      day: "Friday",
      from: new Date().setHours(8, 0),
      to: new Date().setHours(18, 0),
      enabled: true,
    },
    {
      day: "Saturday",
      from: new Date().setHours(8, 0),
      to: new Date().setHours(18, 0),
      enabled: true,
    },
    {
      day: "Sunday",
      from: new Date().setHours(8, 0),
      to: new Date().setHours(18, 0),
      enabled: true,
    },
  ]);

  return (
    <SnackbarProvider>
      <ProgressSteps
        current={current}
        overrides={{
          Tail: {
            style: {
              width: `calc(100% - 12px)`,
              height: "2px",
              marginTop: `calc(24px + 20px + (20px - 36px) / 2)`,
              left: "calc(50% + 20px)",
            },
          },
          Root: { style: { display: "flex", justifyContent: "center" } },
          StepRoot: {
            style: {
              width: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },
          },
          Title: {
            style: {
              paddingTop: "10px",
            },
          },
          Content: { style: { marginLeft: null } },
          Description: () => null,
        }}
      >
        <NumberedStep title="Lift details" />
        <NumberedStep title="Area" />
        <NumberedStep title="Calendar" />
        <NumberedStep title="Review" />
      </ProgressSteps>
      {current == 0 ? (
        <LiftDetails values={liftValues} setValue={setLiftValues} />
      ) : current == 1 ? (
        <AreaOfService />
      ) : current == 2 ? (
        <ScheduleLift timeValues={timeValues} setTimeValues={setTimeValues} />
      ) : current == 3 ? (
        <Review liftValues={liftValues} timeValues={timeValues} />
      ) : null}
      <SpacedButton onClick={() => setCurrent((prev) => prev - 1)}>
        Previous
      </SpacedButton>
      <SpacedButton onClick={() => setCurrent((prev) => prev + 1)}>
        Next
      </SpacedButton>
    </SnackbarProvider>
  );
}
export default ProgressStepsContainer;
