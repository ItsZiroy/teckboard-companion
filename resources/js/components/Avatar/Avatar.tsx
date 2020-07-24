import * as React from "react";
import MuiAvatar from "@material-ui/core/Avatar";
import { Badge } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { User } from "../Auth";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
  height: number;
  badgeHeight?: number;
  badgeWidth?: number;
  onClick?(event: React.MouseEvent<HTMLDivElement>): any;
}

export default function Avatar(props: AvatarProps) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      avatar: {
        cursor: props.onClick ? "pointer" : "default",
        width: props.height,
        height: props.height,
      },
      badge: {
        width: props.badgeHeight ? props.badgeHeight : props.height - 29,
        height: props.badgeWidth ? props.badgeWidth : props.height - 29,
        borderRadius: "50%",
        boxShadow: theme.shadows[2],
        backgroundColor:
          props.user.status == 0
            ? "grey"
            : props.user.status == 1
            ? theme.palette.success.main
            : theme.palette.error.dark,
      },
    })
  );
  const classes = useStyles();
  const { user, ...rest } = props;
  return (
    <div style={{ height: props.height }} {...rest}>
      <Badge
        variant="dot"
        overlap="circle"
        classes={{ badge: classes.badge }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MuiAvatar src={user.icon?.location} className={classes.avatar}>
          {props.height < 35
            ? user.firstname.charAt(0).toUpperCase()
            : user.firstname.charAt(0).toUpperCase() +
              user.name.charAt(0).toUpperCase()}
        </MuiAvatar>
      </Badge>
    </div>
  );
}
