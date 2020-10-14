import { Typography } from "@material-ui/core";
import * as React from "react";
import { useVersion } from "../Version";

const { remote } = window.require("electron");

export default function Settings() {
  const version = useVersion();
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="body2">TECKboard - Companion</Typography>
      <Typography variant="caption" component="div" color="textSecondary">
        Stable:
        {` ${version.companion.stable}`}
      </Typography>
      <Typography variant="caption" component="div" color="textSecondary">
        Platform:
        {` ${remote.process.platform}`}
      </Typography>
      <Typography variant="body2">TECKboard</Typography>
      <Typography variant="caption" component="div" color="textSecondary">
        Stable:
        {` ${version.teckboard.stable}`}
      </Typography>
    </div>
  );
}
