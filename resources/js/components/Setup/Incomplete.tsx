import {
  Button,
  createStyles,
  makeStyles,
  Step,
  Stepper,
  Theme,
  Typography,
} from "@material-ui/core";
import * as React from "react";
import CustomStepContainer from "../CustomStepContainer";
const remote = window.require("electron").remote;
const screenProcess = remote.require("./main/screenAuth-process.js");
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    container: {
      width: 400,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    step1_container: {},
  })
);
export interface SetupIncompleteProps {
  refresh(): void;
}
export default function Incomplete(props: SetupIncompleteProps) {
  const classes = useStyles();
  const [step, setStep] = React.useState(0);
  const handleAuth = () => {
    screenProcess.createAuthWindow(() => {
      props.refresh();
    });
  };
  return (
    <div className={classes.root}>
      <Stepper connector={<></>} activeStep={step} orientation="vertical">
        <Step key={0}>
          <CustomStepContainer className={classes.container}>
            <Typography variant={"h6"}>
              Hey! I am Max. I will take you through the process of installing
              your TECKscreen! Shall we begin?
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setStep(1)}
            >
              Start
            </Button>
          </CustomStepContainer>
        </Step>
        <Step key={1}>
          <CustomStepContainer className={classes.container}>
            <Typography variant={"h6"}>
              I need you to authorize the TECKscreen application for me. Please
              click on the button and proceed to the authorization website :)
            </Typography>
            <Button color="secondary" variant="contained" onClick={handleAuth}>
              Authorize
            </Button>
          </CustomStepContainer>
        </Step>
      </Stepper>
    </div>
  );
}
