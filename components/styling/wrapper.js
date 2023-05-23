import { Grid, Cell } from "baseui/layout-grid";

export default function Wrapper({ children }) {
  return (
    <Grid
      overrides={{
        Grid: {
          style: {
            marginTop: "24px",
          },
        },
      }}
    >
      <Cell span={12}>{children}</Cell>
    </Grid>
  );
}
