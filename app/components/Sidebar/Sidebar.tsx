import {
  createStyles,
  Drawer,
  makeStyles,
  Tab,
  Tabs,
  Theme,
} from "@material-ui/core";
import BuildRoundedIcon from "@material-ui/icons/BuildRounded";
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { spacing } from "../../config.json";
import logo from "../../../resources/images/logo.svg";

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
export default function Sidebar() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const handleChange = (e: React.ChangeEvent<unknown>, value: string) => {
    history.push(`/${value}`);
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
        <img src={logo} alt="logo" className={classes.logo} />
      </div>
      <Tabs
        TabIndicatorProps={{ style: { left: 0 } }}
        indicatorColor="primary"
        value={location.pathname.split("/")[1]}
        orientation="vertical"
        onChange={handleChange}
      >
        <Tab
          value="home"
          className={classes.tab}
          icon={<ImportantDevicesRoundedIcon />}
        />
        <Tab
          value="setup"
          className={classes.tab}
          icon={<BuildRoundedIcon />}
        />
        <Tab
          value="settings"
          className={classes.tab}
          icon={<SettingsRoundedIcon />}
        />
      </Tabs>
    </Drawer>
  );
}
