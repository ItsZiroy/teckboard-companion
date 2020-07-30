import * as React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  makeStyles,
  createStyles,
  Theme,
  StepIcon,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    iconContainer: {
      background: "linear-gradient(-45deg, #fb6340, #fbb140)",
    },
  })
);
export default function Setup() {
  const [step, setStep] = React.useState(0);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Stepper activeStep={step}>
        <Step key={0}>
          <StepLabel>Log in at TECKscreen</StepLabel>
        </Step>
        <Step key={1}>
          <StepLabel>Authorize TECKscreen</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>Add TECKscreen to your Board</StepLabel>
        </Step>
      </Stepper>
    </div>
  );
}
