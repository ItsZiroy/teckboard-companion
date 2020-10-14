import * as React from "react";
import { ScreenContext } from "./ScreenProvider";

export default function useScreen() {
  return React.useContext(ScreenContext);
}
