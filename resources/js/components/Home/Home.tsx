import * as React from "react";
import MdnsTeckboards from "../MdnsTeckboards";
import { Typography } from "@material-ui/core";

export default function Home() {
  return (
    <>
      <Typography variant="h2" color="primary">
        TECKscreens nearby:
      </Typography>
      <MdnsTeckboards />
    </>
  );
}
