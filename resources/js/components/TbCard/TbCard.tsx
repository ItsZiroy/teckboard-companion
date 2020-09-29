import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Typography, Zoom, IconButton, Tooltip } from "@material-ui/core";
import SpeakerPhoneIcon from "@material-ui/icons/SpeakerPhone";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Screen } from "@teckboard-companion/core";
import { useScreenToken } from "../ScreenToken";
import { RotateLeftRounded } from "@material-ui/icons";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 200,
      maxWidth: 300,
      position: "relative",
      height: 100,
      background: (props: Screen) =>
        props.restarting
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
      cursor: (props: Screen) => (props.restarting ? "wait" : "pointer"),
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
  screen: Screen;
}
export default function TBCard(props: TbCardProps) {
  const { screen } = props;
  const history = useHistory();
  const handlePing = (e: React.MouseEvent) => {
    axios.post("http://" + screen.ip + "/ping");
    e.stopPropagation();
  };
  const classes = useStyles(screen);
  const token = useScreenToken();
  return (
    <Zoom in>
      <div
        onClick={
          screen.restarting
            ? undefined
            : () => {
                if (token.token) {
                  history.push("/home/screens/" + screen.ip, screen);
                } else {
                  history.push("/setup");
                }
              }
        }
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
