import { Tab, Tabs } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import * as React from "react";
import MdnsTeckboards from "../MdnsTeckboards";
const drawerWidth = 57;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    hide: {
      display: "none",
    },
    paper: {
      width: "inherit",
      border: "none",
      background: "linear-gradient(-190deg, #fb6340, #fbb140)",
      boxShadow: theme.shadows[4],
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    logo: {
      width: 40,
      height: 40,
      display: "flex",
      marginRight: "auto",
    },
    tab: {
      minWidth: 57,
      padding: 0,
    },
    content: {
      marginTop: 60,
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      "& h5": {
        display: "flex",
        marginRight: "auto",
      },
    },
  })
);
interface MainProps {}
export default function Main(props: MainProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            <b>TECKboard</b> Companion
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: classes.paper,
        }}
      >
        <div className={classes.toolbar}>
          <img src="./public/images/logo.svg" className={classes.logo}></img>
        </div>
        <Tabs
          TabIndicatorProps={{ style: { left: 0 } }}
          indicatorColor="primary"
          value={"Home"}
          orientation="vertical"
        >
          <Tab value="Home" className={classes.tab} icon={<HomeIcon />}></Tab>
        </Tabs>
      </Drawer>
      <div className={classes.content}>
        <Typography variant="h2" color="primary">
          TECKboards available:
        </Typography>
        <MdnsTeckboards />
      </div>
    </div>
  );
}
