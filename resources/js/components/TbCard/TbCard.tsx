import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Typography, Zoom } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 200,
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
  })
);
export interface TbCardProps {
  ip: string;
  openModal(ip: string): void;
}
export default function TBCard(props: TbCardProps) {
  const { ip, openModal } = props;
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
          <Typography variant="h6"><b>{ip}</b></Typography>
        </div>
      </div>
    </Zoom>
  );
}
