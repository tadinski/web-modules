import { Card, StyledBody, StyledAction } from "baseui/card";
import { Button } from "baseui/button";
import { useStyletron } from "styletron-react";

export default function LiftCard({ liftValues, timeValues }) {
  const [css] = useStyletron();
  return (
    <Card
      overrides={{ Root: { style: { maxWidth: "328px" } } }}
      title={liftValues?.plate.value}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "14px",
          marginBottom: "14px",
        })}
      >
        <div>{liftValues?.weight.value}</div>
        <div>{liftValues?.height.value}</div>
        <div>{liftValues?.price.value}</div>
      </div>
      <StyledAction>
        <Button overrides={{ BaseButton: { style: { width: "100%" } } }}>
          Submit
        </Button>
      </StyledAction>
    </Card>
  );
}
