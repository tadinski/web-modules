import { Button } from "baseui/button";
function SpacedButton(props) {
  return (
    <Button
      {...props}
      disabled={props.disabled}
      shape="pill"
      kind="secondary"
      size="compact"
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

export default SpacedButton;
