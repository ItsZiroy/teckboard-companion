import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import * as React from "react";
import { useHistory } from "react-router-dom";

const remote = window.require("@electron/remote");
const { screenService } = remote.require("./main.prod.js");
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    body: {
      width: 400,
      marginBottom: theme.spacing(2),
    },
    activateButton: {
      width: 200,
      marginBottom: theme.spacing(2),
    },
    revokeButton: {
      width: 200,
      backgroundColor: theme.palette.error.main,
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
  })
);
export interface SetupCompleteProps {
  refresh(): void;
}
export default function Complete(props: SetupCompleteProps) {
  const classes = useStyles();
  const history = useHistory();
  const handleRevoke = async () => {
    await screenService.logout();
    props.refresh();
  };
  return (
    <div className={classes.root}>
      <Typography color="primary" variant="h2" gutterBottom>
        All set!
      </Typography>
      <Typography variant="body1" className={classes.body}>
        You may now go ahead and set up any board on any of your TECKscreens.
        Isn&#39;t that cool? No? Anyway... Go ahead and try!
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        className={classes.activateButton}
        onClick={() => history.push("/home")}
      >
        Activate Board
      </Button>
      <Button
        variant="contained"
        className={classes.revokeButton}
        onClick={handleRevoke}
      >
        Revoke Access
      </Button>
    </div>
  );
}
