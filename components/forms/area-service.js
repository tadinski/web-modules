import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";

export default function AreaOfService({ values, onChange, onBlur }) {
  return (
    <FormControl label={() => "Area"}>
      <Input name="company" required />
    </FormControl>
  );
}
