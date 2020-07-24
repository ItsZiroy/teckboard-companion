import { Tab, Tabs } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded";
import * as React from "react";
import { useAuth } from "../Auth";
import MdnsTeckboards from "../MdnsTeckboards";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { spacing } from "../../config.json";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    content: {
      marginTop: 60,
    },
  })
);
interface MainProps {}
export default function Main(props: MainProps) {
  const classes = useStyles();
  const user = useAuth();
  return (
    <div className={classes.root}>
      <Navbar />
      <Sidebar />
      <div className={classes.content}>
        <Typography variant="h2" color="primary">
          TECKscreens nearby:
        </Typography>
        <MdnsTeckboards />
      </div>
    </div>
  );
}
