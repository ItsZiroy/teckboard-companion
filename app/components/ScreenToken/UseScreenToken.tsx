import * as React from "react";
import { ScreenTokenContext } from "./ScreenTokenProvider";

export default function useScreenToken() {
  const token = React.useContext(ScreenTokenContext);
  return token;
}
