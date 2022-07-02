import {
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import * as React from "react";
import { useAuth } from "../Auth";
import Avatar from "../Avatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    icon: {
      marginRight: theme.spacing(3),
    },
  })
);

export default function AvatarMenu() {
  const user = useAuth();

  const classes = useStyles();

  const logout = () => {
    const remote = window.require("@electron/remote");
    const mainProcess = remote.require("./main.prod.js");
    mainProcess.createLogoutWindow();
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar height={40} user={user} onClick={handleClick} />
      <Menu
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar height={40} user={user} />
          </ListItemAvatar>
          <ListItemText
            primary={`${user.firstname} ${user.name}`}
            secondary={user.email}
          />
        </ListItem>
        <Divider />
        <MenuItem className={classes.menuItem} onClick={logout}>
          <ExitToAppIcon className={classes.icon} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
