import * as React from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Typography,
  createStyles,
  Theme,
} from "@material-ui/core";
import AvatarMenu from "./AvatarMenu";
import { spacing } from "../../config.json";

export interface NavbarProps {
  disableGutter?: boolean;
}
export default function Navbar(props: NavbarProps) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
        marginLeft: props.disableGutter ? 0 : spacing.drawerWidth,
        width: props.disableGutter
          ? "100%"
          : `calc(100% - ${spacing.drawerWidth}px)`,
      },
      toolbarRight: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
      },
    })
  );
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          <b>{"TECKboard "}</b>
          Companion
        </Typography>
        <div className={classes.toolbarRight}>
          <AvatarMenu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
