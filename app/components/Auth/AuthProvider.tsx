import * as React from "react";
import { AxiosResponse } from "axios";
import { Channel } from "laravel-echo/dist/channel";
import { useEcho } from "../Network";
import { User } from "../types";

const remote = window.require("@electron/remote");
const axios = remote.getGlobal("axios");

export const AuthContext = React.createContext<User>({
  id: "0",
  firstname: "First",
  name: "Last",
  email: "first@last.com",
  icon: null,
  channel: null,
  status: 0,
  settings: {
    language: "en",
  },
});
export interface AuthProviderProps {
  children: React.ReactChild;
}
export default function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [user, _setUser] = React.useState<User>({
    id: "0",
    firstname: "First",
    name: "Last",
    email: "first@last.com",
    icon: null,
    channel: null,
    status: 0,
    settings: {
      language: "en",
    },
  });
  const userRef = React.useRef(user);
  const setUser = (data: User) => {
    userRef.current = data;
    _setUser({ ...data });
  };

  const join = (id: string): Channel => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const echo = useEcho();
    echo.private("main");

    const channel = echo.private(`user.${id}`);

    channel.listen("UserStatusChange", (response: { user: User }) => {
      const newUser = userRef.current;
      newUser.status = response.user.status;
      setUser(newUser);
    });

    window.setInterval(() => {
      echo.leave("main");
      echo.private("main");
    }, 290000);

    return channel;
  };

  React.useEffect(() => {
    axios
      .get("https://teckboard.teckdigital.de/api/v1/user")
      .then((response: AxiosResponse) => {
        const { id, firstname, name, email, icon, settings, status } =
          response.data.data;
        setUser({
          id,
          firstname,
          name,
          email,
          icon,
          channel: join(id),
          settings,
          status,
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
