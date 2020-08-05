import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Typography, Zoom, IconButton, Tooltip } from "@material-ui/core";
import SpeakerPhoneIcon from "@material-ui/icons/SpeakerPhone";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Screen } from "@teckboard-companion/core";
import { useScreenToken } from "../ScreenToken";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 200,
      maxWidth: 300,
      position: "relative",
      height: 100,
      background: "linear-gradient(80deg, #fb6340, #fbb140)",
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
      cursor: "pointer",
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
  const classes = useStyles();
  const token = useScreenToken();
  return (
    <Zoom in>
      <div
        onClick={() => {
          if (token.token) {
            history.push("/screens/" + screen.ip, screen);
          } else {
            history.push("/setup");
          }
        }}
        className={classes.container}
      >
        <div className={classes.content}>
          <Typography variant="h6">
            <b>{screen.name}</b>
          </Typography>
        </div>
        <Tooltip title="Identify" placement="left">
          <IconButton
            size="small"
            onClick={handlePing}
            className={classes.ping}
          >
            <SpeakerPhoneIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Zoom>
  );
}
