import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth } from "../Auth";
import Home from "../Home";
import Navbar from "../Navbar";
import Setup from "../Setup";
import Sidebar from "../Sidebar";
import TbScreen from "../TbScreen";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    content: {
      marginTop: 60,
      width: "100%",
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
        <Switch>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/setup">
            <Setup />
          </Route>
          <Route exact path="/settings"></Route>
          <Route exact path="/screens/:id" children={<TbScreen />} />
        </Switch>
      </div>
    </div>
  );
}
