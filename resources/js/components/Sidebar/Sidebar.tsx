import * as React from "react";
import {
  Drawer,
  Tab,
  makeStyles,
  Tabs,
  createStyles,
  Theme,
} from "@material-ui/core";
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import BuildRoundedIcon from "@material-ui/icons/BuildRounded";
import { spacing } from "../../config.json";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "inherit",
      border: "none",
      background: "linear-gradient(-190deg, #fb6340, #fbb140)",
      boxShadow: theme.shadows[4],
    },
    drawer: {
      width: spacing.drawerWidth,
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
export interface SidebarProps {}
export default function Sidebar(props: SidebarProps) {
  const classes = useStyles();

  const history = useHistory();

  const [index, setIndex] = React.useState("home");

  const handleChange = (e: React.ChangeEvent<{}>, value: string) => {
    setIndex(value);
    history.push(value);
  };

  return (
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
        value={index}
        orientation="vertical"
        onChange={handleChange}
      >
        <Tab
          value="home"
          className={classes.tab}
          icon={<ImportantDevicesRoundedIcon />}
        ></Tab>
        <Tab
          value="setup"
          className={classes.tab}
          icon={<BuildRoundedIcon />}
        ></Tab>
        <Tab
          value="settings"
          className={classes.tab}
          icon={<SettingsRoundedIcon />}
        ></Tab>
      </Tabs>
    </Drawer>
  );
}
