/* eslint-disable jsx-a11y/interactive-supports-focus */
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Typography, Zoom, IconButton, Tooltip } from "@material-ui/core";
import SpeakerPhoneIcon from "@material-ui/icons/SpeakerPhone";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { RotateLeftRounded } from "@material-ui/icons";
import { useScreenToken } from "../ScreenToken";
import { useStore } from "../Store";
import { NetworkScreen } from "../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 200,
      maxWidth: 300,
      position: "relative",
      height: 100,
      background: (props: NetworkScreen) =>
        props.restarting || (!props.owned && props.setup)
          ? theme.palette.grey[500]
          : "linear-gradient(80deg, #fb6340, #fbb140)",
      borderRadius: theme.spacing(3),
      boxShadow: theme.shadows[5],
      marginLeft: theme.spacing(4),
      marginBottom: theme.spacing(4),
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      cursor: (props: NetworkScreen) => {
        if (!props.owned && props.setup) return "not-allowed";
        return props.restarting ? "wait" : "pointer";
      },
    },
    content: {
      color: "#fff",
    },
    ping: {
      position: "absolute",
      top: 5,
      right: 5,
      color: theme.palette.primary.main,
    },
    restarting: {
      position: "absolute",
      top: 5,
      right: 5,
      animation: "$spin 2s linear infinite",
    },
    "@keyframes spin": { "100%": { transform: "rotate(-360deg)" } },
  })
);
export interface TbCardProps {
  screen: NetworkScreen;
}
export default function TBCard(props: TbCardProps) {
  const { screen } = props;
  const history = useHistory();
  const store = useStore("token");
  const handlePing = (e: React.MouseEvent) => {
    axios.post(`http://${screen.ip}/ping`, null, {
      headers: {
        Authorization: store.get(screen.id),
      },
    });
    e.stopPropagation();
  };
  const classes = useStyles(screen);
  const token = useScreenToken();
  const handleClick = () => {
    if (!screen.restarting) {
      if (screen.owned || (!screen.owned && !screen.setup))
        history.push(`/home/screens/${screen.id}`, screen);
    }
  };
  return (
    <Zoom in>
      <div
        role="button"
        onClick={handleClick}
        onKeyPress={handleClick}
        className={classes.container}
      >
        <div className={classes.content}>
          <Typography variant="h6">
            <b>{screen.name}</b>
          </Typography>
        </div>
        {screen.restarting ? (
          <Tooltip title="Restarting..." placement="left">
            <IconButton size="small" className={classes.restarting}>
              <RotateLeftRounded />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Identify" placement="left">
            <IconButton
              size="small"
              onClick={handlePing}
              className={classes.ping}
            >
              <SpeakerPhoneIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Zoom>
  );
}
