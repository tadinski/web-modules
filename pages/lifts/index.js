import LiftCard from "@/components/lift-card";
import { Grid, Cell } from "baseui/layout-grid";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button } from "baseui/button";
import { Plus } from "baseui/icon";
import { useRouter } from "next/router";
import { useStyletron } from "baseui";

export default function Lifts() {
  const router = useRouter();

  const [css, theme] = useStyletron();
  return (
    <Grid>
      <Button
        onClick={() => router.push("lifts/add")}
        startEnhancer={() => <Plus size={24} />}
        className={css({ marginBottom: theme.sizing.scale1600 })}
      >
        Add lift service
      </Button>
      <FlexGrid
        flexGridColumnCount={[1, 1, 2, 3]}
        flexGridColumnGap="scale800"
        flexGridRowGap="scale800"
      >
        <FlexGridItem>
          <LiftCard />
        </FlexGridItem>
        <FlexGridItem>
          <LiftCard />
        </FlexGridItem>
        <FlexGridItem>
          <LiftCard />
        </FlexGridItem>
      </FlexGrid>
    </Grid>
  );
}
