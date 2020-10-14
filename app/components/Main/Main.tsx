import { createStyles, makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../Home";
import Navbar from "../Navbar";
import Setup from "../Setup";
import Sidebar from "../Sidebar";
import TbScreen from "../TbScreen";
import Network from "../Network/Network";
import { spacing } from "../../config.json";
import Settings from "../Settings";
import Screen from "../Screen";
import ScreenSetup from "../ScreenSetup";
import { useScreenToken } from "../ScreenToken";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
    },
    content: {
      marginTop: 60,
      width: `calc(100% - ${spacing.drawerWidth}px)`,
    },
  })
);

export default function Main() {
  const classes = useStyles();
  const token = useScreenToken();
  return (
    <div className={classes.root}>
      <Navbar />
      <Sidebar />
      <div className={classes.content}>
        <Network>
          <Switch>
            {token.token === null ? (
              <Redirect from="/home" to="/setup" />
            ) : undefined}
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/home/screens/:id">
              <Screen>
                <TbScreen />
              </Screen>
            </Route>
            <Route exact path="/home/screens/:id/setup">
              <ScreenSetup />
            </Route>
            <Route exact path="/setup">
              <Setup />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
          </Switch>
        </Network>
      </div>
    </div>
  );
}
