import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Typography, Zoom, IconButton, Tooltip } from "@material-ui/core";
import SpeakerPhoneIcon from "@material-ui/icons/SpeakerPhone";
import axios from "axios";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 200,
      position: "relative",
      height: 100,
      background: "linear-gradient(80deg, #fb6340, #fbb140)",
      borderRadius: theme.spacing(3),
      boxShadow: theme.shadows[5],
      marginLeft: theme.spacing(4),
      marginBottom: theme.spacing(4),
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
  ip: string;
  openModal(ip: string): void;
}
export default function TBCard(props: TbCardProps) {
  const { ip, openModal } = props;
  const handlePing = (e: React.MouseEvent) => {
    axios.post("http://" + ip + "/ping");
    e.stopPropagation();
  };
  const classes = useStyles();
  return (
    <Zoom in>
      <div
        onClick={() => {
          openModal(ip);
        }}
        className={classes.container}
      >
        <div className={classes.content}>
          <Typography variant="h6">
            <b>{ip}</b>
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
