import * as React from "react";
import { AuthContext } from "./AuthProvider";
export default function useAuth() {
  var user = React.useContext(AuthContext);
  return user;
}
