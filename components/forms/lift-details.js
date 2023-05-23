import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { useStyletron } from "baseui";
import { Grid, Cell } from "baseui/layout-grid";

export default function LiftDetails({ values, setValue }) {
  const [css] = useStyletron();

  const onChange = (e) => {
    setValue({
      ...values,
      [e.target.name]: {
        ...values[e.target.name],
        value: e.target.value,
        valid:
          (e.target.name === "weight" ||
            e.target.name === "height" ||
            e.target.name === "price") &&
          e.target.value.trim().length > 0 &&
          /^\d+$/.test(e.target.value)
            ? true
            : e.target.name === "plate"
            ? e.target.value.trim().length > 3
            : false,
      },
    });
  };
  const onBlur = (e) => {
    setValue({
      ...values,
      [e.target.name]: {
        ...values[e.target.name],
        visited: true,
      },
    });
  };

  return (
    <Grid>
      <Cell span={[3, 3, 3]} skip={[0, 1]}>
        <FormControl
          label={() => "Number Plate"}
          error={
            values.plate.visited && !values.plate.valid
              ? "company name must include at least 4 characters"
              : null
          }
        >
          <Input
            name="plate"
            value={values.plate.value}
            onChange={onChange}
            onBlur={onBlur}
            error={values.plate.visited && !values.plate.valid}
            required
          />
        </FormControl>
        <FormControl
          label={() => "Max weight"}
          error={
            values.weight.visited && !values.weight.valid
              ? "company name must include at least 3 characters"
              : null
          }
        >
          <Input
            name="weight"
            value={values.weight.value}
            onChange={onChange}
            onBlur={onBlur}
            error={values.weight.visited && !values.weight.valid}
            type="number"
            endEnhancer="kg"
            inputMode="number"
            required
          />
        </FormControl>
        <FormControl
          label={() => "Max height"}
          error={
            values.height.visited && !values.height.valid
              ? "company name must include at least 3 characters"
              : null
          }
        >
          <Input
            name="height"
            value={values.height.value}
            onChange={onChange}
            onBlur={onBlur}
            error={values.height.visited && !values.height.valid}
            type="number"
            endEnhancer="meters"
            inputMode="number"
            min={10}
            step="5"
            required
          />
        </FormControl>
        <span>± {Math.round(values.height.value / 3)} floors</span>
        <FormControl
          label={() => "Price"}
          error={
            values.price.visited && !values.price.valid
              ? "company name must include at least 3 characters"
              : null
          }
        >
          <Input
            name="price"
            value={values.price.value}
            onChange={onChange}
            onBlur={onBlur}
            error={values.price.visited && !values.price.valid}
            type="number"
            startEnhancer="€"
            endEnhancer="/hour"
            inputMode="number"
            min={10}
            step="5"
            required
          />
        </FormControl>
      </Cell>
      <Cell span={[1, 2, 2, 2]}>
        <div>This is infobox</div>
      </Cell>
    </Grid>
  );
}
