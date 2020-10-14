import * as React from "react";
import { VersionContext } from "./VersionProvider";

export default function useVersion() {
  return React.useContext(VersionContext);
}
