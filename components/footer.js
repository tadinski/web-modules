import { useStyletron } from "baseui";
import { Button } from "baseui/button";

function Footer({ toggleTheme }) {
  const [css, theme] = useStyletron();

  return (
    <div
      className={css({
        background: theme.colors.backgroundPrimary,
        height: "100px",
      })}
    >
      <Button onClick={() => toggleTheme()}>Change theme</Button>
    </div>
  );
}

export default Footer;
