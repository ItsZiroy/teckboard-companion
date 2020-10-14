import {
  Button,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Step,
  Stepper,
  Switch,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { KeyboardTimePicker } from "@material-ui/pickers";
import Axios from "axios";
import { toPairs } from "lodash";
import moment from "moment-timezone";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import BoardSelect from "../BoardSelect";
import CustomStepContainer from "../CustomStepContainer";
import { useNetworkScreen } from "../Network";
import { useScreenToken } from "../ScreenToken";
import { useStore } from "../Store";
import timezones from "./timezones.json";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      fontWeight: "bold",
    },
    nextButton: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    buttonContainer: {
      display: "flex",
    },
    input: {
      width: 300,
    },
    autoUpdates: {
      marginTop: theme.spacing(2),
    },
  })
);
const languages = ["en", "de"] as const;
export type Languages = typeof languages[number];
export type Timezones = keyof typeof timezones;

export default function ScreenSetup() {
  const { id } = useParams<{ id: string }>();
  const store = useStore("token");
  const classes = useStyles();
  const screen = useNetworkScreen(id);
  const screenToken = useScreenToken();
  const history = useHistory();
  const [name, setName] = React.useState<string>(null);
  const [language, setLanguage] = React.useState<Languages>("en");
  const [timezone, setTimezone] = React.useState<Timezones>("Europe/London");
  const [board, setBoard] = React.useState<string>("");
  const [step, setStep] = React.useState(0);
  const [autoUpdates, setAutoUpdates] = React.useState({
    enabled: true,
    time: "00:00",
  });
  const lastStep = 3;
  const handleSubmit = async () => {
    const response = await Axios.post(`http://${screen.ip}/authorize`, {
      access_token: screenToken.token,
    });
    store.set(id, response.data);
    const axios = Axios.create({
      baseURL: `http://${screen.ip}`,
      headers: {
        Authorization: response.data,
      },
    });
    await axios.patch("info", {
      name,
      language,
      timezone,
      autoUpdates,
    });
    if (board) {
      await axios.patch("board", { id: board });
    }
    screen.update({
      name,
      timezone,
      autoUpdates,
      setup: true,
      owned: true,
    });
    history.push(`/home/screens/${id}`);
  };
  const isNextDisabled = (): boolean => {
    switch (step) {
      case 0:
        return !name;
      default:
        return false;
    }
  };
  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h1" color="primary">
        Setup
      </Typography>

      <Stepper connector={<></>} activeStep={step} orientation="vertical">
        <Step key={0}>
          <CustomStepContainer className={classes.container}>
            <Typography variant="h6">
              Please enter a name for you TECKscreen!
            </Typography>
            <FormControl margin="normal" className={classes.input}>
              <TextField
                defaultValue={name}
                placeholder="Name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>
          </CustomStepContainer>
        </Step>
        <Step key={1}>
          <CustomStepContainer className={classes.container}>
            <Typography variant="h6">
              Choose your language and timezone!
            </Typography>
            <FormGroup>
              <FormControl
                margin="normal"
                variant="outlined"
                className={classes.input}
              >
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  label="Language"
                  defaultValue={() => {
                    const navigatorLanguage = navigator.language
                      .split("-")[0]
                      .toLowerCase();
                    return (languages as readonly string[]).includes(
                      navigatorLanguage
                    )
                      ? navigatorLanguage
                      : "en";
                  }}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setLanguage(e.target.value as Languages);
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                margin="normal"
                variant="outlined"
                className={classes.input}
              >
                <InputLabel id="timezone-label">Timezone</InputLabel>
                <Select
                  labelId="timezone-label"
                  label="Timezone"
                  defaultValue={moment.tz.guess(true)}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setTimezone(e.target.value as Timezones);
                  }}
                >
                  {toPairs(timezones).map((value) => (
                    <MenuItem key={value[0]} value={value[0]}>
                      {value[1]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormGroup>
          </CustomStepContainer>
        </Step>
        <Step key={2}>
          <CustomStepContainer className={classes.container}>
            <Typography variant="h6">
              Select one of your boards to be displayed!
            </Typography>
            <BoardSelect
              value={board}
              FormControlProps={{ margin: "normal" }}
              className={classes.input}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setBoard(e.target.value as string);
              }}
            />
          </CustomStepContainer>
        </Step>
        <Step key={3}>
          <CustomStepContainer className={classes.container}>
            <FormGroup>
              <FormControl
                margin="normal"
                color="primary"
                className={classes.autoUpdates}
              >
                <FormControlLabel
                  label="Enable auto updates"
                  control={
                    <Switch
                      size="medium"
                      checked={autoUpdates.enabled}
                      onChange={(e) =>
                        setAutoUpdates({
                          enabled: e.target.checked,
                          time: autoUpdates.time,
                        })
                      }
                    />
                  }
                />
              </FormControl>
              <FormControl margin="normal">
                <KeyboardTimePicker
                  value={moment(autoUpdates.time, ["HH:mm"])}
                  ampm={false}
                  label="Time"
                  className={classes.input}
                  inputVariant="outlined"
                  helperText="The time TECKscreen should install updates."
                  onChange={(moment: moment.Moment, value: string) =>
                    setAutoUpdates({
                      enabled: autoUpdates.enabled,
                      time: value,
                    })
                  }
                />
              </FormControl>
            </FormGroup>
          </CustomStepContainer>
        </Step>
      </Stepper>
      <div className={classes.buttonContainer}>
        <Button
          color="secondary"
          className={classes.nextButton}
          onClick={() => {
            return step === 0 ? history.push("/home") : setStep(step - 1);
          }}
        >
          Back
        </Button>
        <Button
          color="primary"
          className={classes.nextButton}
          disabled={isNextDisabled()}
          variant="contained"
          onClick={() => {
            return step === lastStep ? handleSubmit() : setStep(step + 1);
          }}
        >
          {step === lastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
