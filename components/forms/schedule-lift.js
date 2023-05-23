import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { useStyletron } from "baseui";
import { TimePicker } from "baseui/timepicker";
import { LabelSmall } from "baseui/typography";
import { Cell, Grid } from "baseui/layout-grid";
import { Button, KIND } from "baseui/button";
import { HeadingMedium } from "baseui/typography";
import DuplicateIcon from "../icons/duplicate-icon";
import { DURATION, useSnackbar, PLACEMENT } from "baseui/snackbar";

export default function ScheduleLift({ timeValues, setTimeValues }) {
  const [css] = useStyletron();
  const { enqueue } = useSnackbar();

  const setOnWeekendsOnly = () => {
    timeValues.forEach((n) => {
      n.day == "Saturday" || n.day == "Sunday"
        ? (n.enabled = true)
        : (n.enabled = false);
    });
    setTimeValues([...timeValues]);
  };
  const setWeekdaysOnly = () => {
    timeValues.forEach((n) => {
      n.day == "Saturday" || n.day == "Sunday"
        ? (n.enabled = false)
        : (n.enabled = true);
    });
    setTimeValues([...timeValues]);
  };

  const updateAllDays = (date, preposition) => {
    if (preposition === "from") timeValues.forEach((n) => (n.from = date));
    if (preposition === "to") timeValues.forEach((n) => (n.to = date));
  };

  const handleUpdateTime = (date, item, preposition) => {
    if (preposition === "from") {
      item.from = date;
    }
    if (preposition === "to") {
      item.to = date;
    }
    enqueue(
      {
        message: "Update all days ?",
        actionMessage: <DuplicateIcon />,
        actionOnClick: () => updateAllDays(date, preposition),
        focus: false,
      },
      DURATION.medium,
      PLACEMENT.bottom
    );
  };

  return (
    <Grid>
      <Cell span={[4, 3]} skip={[0, 1]}>
        <HeadingMedium>Quick options</HeadingMedium>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          })}
        >
          <Button onClick={setWeekdaysOnly} kind={KIND.secondary}>
            Mon-Fri
          </Button>
          <Button
            className={css({ marginTop: "20px" })}
            onClick={setOnWeekendsOnly}
            kind={KIND.secondary}
          >
            Weekends
          </Button>
        </div>
      </Cell>
      <Cell span={[1, 6]}>
        <HeadingMedium>Schedule</HeadingMedium>
        {timeValues?.map((each) => (
          <div
            key={each.day}
            dayid={each.day}
            className={css({
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
            })}
          >
            <LabelSmall className={css({ width: "88px" })}>
              {each.day}
            </LabelSmall>
            <Checkbox
              checked={each.enabled}
              onChange={(e) => {
                each.enabled = e.currentTarget.checked;
                setTimeValues([...timeValues]);
              }}
              checkmarkType={STYLE_TYPE.toggle_round}
            />

            <LabelSmall
              className={css({ marginLeft: "20px", marginRight: "14px" })}
            >
              from
            </LabelSmall>
            <div className={css({ width: "130px" })}>
              <TimePicker
                disabled={!each.enabled}
                value={each.from}
                onChange={(date) =>
                  handleUpdateTime(date, each, Object.keys(each)[1])
                }
                format="24"
                step={1800}
              />
            </div>
            <LabelSmall
              className={css({ marginLeft: "20px", marginRight: "14px" })}
            >
              to
            </LabelSmall>
            <div className={css({ width: "130px" })}>
              <TimePicker
                disabled={!each.enabled}
                value={each.to}
                onChange={(date) =>
                  handleUpdateTime(date, each, Object.keys(each)[2])
                }
                format="24"
                step={1800}
              />
            </div>
          </div>
        ))}
      </Cell>
    </Grid>
  );
}
