import * as React from "react";
import { NetworkContext } from "./Network";
import useEcho from "./UseEcho";

export default function useNetwork() {
  const echo = useEcho();
  return { ...React.useContext(NetworkContext), echo };
}
