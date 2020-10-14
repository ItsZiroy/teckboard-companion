import { createStyles, makeStyles, Theme } from "@material-ui/core";
import * as React from "react";
import { useScreenToken } from "../ScreenToken";
import Complete from "./Complete";
import Incomplete from "./Incomplete";

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
  const token = useScreenToken();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {token.token ? (
        <Complete refresh={token.refresh} />
      ) : (
        <Incomplete refresh={token.refresh} />
      )}
    </div>
  );
}
