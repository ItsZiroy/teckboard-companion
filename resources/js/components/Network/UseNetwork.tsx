import * as React from "react";
import {NetworkContext} from "./Network";


export default function useNetwork() {
  return React.useContext(NetworkContext);
}
