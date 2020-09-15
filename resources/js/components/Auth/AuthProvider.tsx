import * as React from "react";
import {AxiosResponse} from "axios";
import {User} from "@teckboard-companion/core";

const remote = window.require("electron").remote;
const axios = remote.getGlobal("axios");

export const AuthContext = React.createContext<User>({
  id: "0",
  firstname: "First",
  name: "Last",
  email: "first@last.com",
  icon: null,
  status: 0,
  settings: {
    language: "en",
  },
});
export interface AuthProviderProps {
  children: React.ReactChild;
}
export default function AuthProvider(props: AuthProviderProps) {
  const children = props.children;
  const [user, setUser] = React.useState<User>({
    id: "0",
    firstname: "First",
    name: "Last",
    email: "first@last.com",
    icon: null,
    status: 0,
    settings: {
      language: "en",
    },
  });
  React.useEffect(() => {
    axios
        .get("https://teckboard.de/api/v1" + "/user")
      .then((response: AxiosResponse) => {
        let {
          id,
          firstname,
          name,
          email,
          icon,
          settings,
          status,
        } = response.data.data;
        setUser({
          id: id,
          firstname: firstname,
          name: name,
          email: email,
          icon: icon,
          settings: settings,
          status: status,
        });
      });
  }, []);
  return React.createElement(
    AuthContext.Provider,
    {
      value: user,
    },
    children
  );
}
