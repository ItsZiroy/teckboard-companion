import Axios, { AxiosResponse } from "axios";
import { Browser } from "bonjour";
import * as _ from "lodash";
import * as React from "react";
import NetworkScreen from "../types/NetworkScreen";
import { useScreenToken } from "../ScreenToken";

const remote = window.require("@electron/remote");
const Bonjour = remote.require("bonjour");
const bonjour = new Bonjour();
export const NetworkContext = React.createContext<NetworkContextProps>({
  screens: [],
  refresh: undefined,
  updateScreens: undefined,
});

export interface NetworkContextProps {
  screens: NetworkScreen[];
  refresh(hardRefresh?: boolean): void;
  updateScreens(screens: NetworkScreen[]): NetworkScreen[];
}

export interface AuthProviderProps {
  children: React.ReactChild;
}

export default function Network(props: AuthProviderProps) {
  const { children } = props;
  const [browser, setBrowser] = React.useState<Browser>(null);
  const [screens, defaultSetScreens] = React.useState<NetworkScreen[]>([]);
  const screensRef = React.useRef(screens);
  const token = useScreenToken();
  const setScreens = (data: NetworkScreen[]) => {
    screensRef.current = data;
    defaultSetScreens([...data]);
  };
  const handleServiceFound = (service: any): void => {
    let teckscreens: NetworkScreen[] = screensRef.current;
    if (
      service.name.split("-")[0] === "TECKscreen" &&
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm.test(
        service.addresses[0]
      )
    ) {
      const teckscreen = teckscreens.find(
        (value) => value.ip === service.addresses[0]
      );
      if (!teckscreen) {
        Axios.get(
          `http://${service.addresses[0]}/authorize/info?access_token=${token.token}`
        )
          .then((response: AxiosResponse) => {
            const { id, name, owned, setup } = response.data;
            teckscreens.push({
              id,
              name: name ?? "TECKscreen",
              ip: service.addresses[0],
              restarting: false,
              owned,
              setup,
            });
            teckscreens = _.union(teckscreens);
            setScreens(teckscreens);
          })
          .catch((e) => {});
      } else if (teckscreen.restarting) {
        teckscreen.restarting = false;
        screens[screens.indexOf(teckscreen)] = teckscreen;
        setScreens(screens);
      }
    }
  };

  const handleRefresh = (hard = false) => {
    if (hard) {
      setScreens([]);
      browser.stop();
      setBrowser(bonjour.find({ type: "http" }, handleServiceFound));
    } else {
      browser.update();
    }
  };

  const updateScreens = (s: NetworkScreen[]) => {
    setScreens([...s]);
    return s;
  };

  React.useEffect(() => {
    if (token.token) {
      setBrowser(bonjour.find({ type: "http" }, handleServiceFound));
    }
  }, [token.token]);

  return React.createElement(
    NetworkContext.Provider,
    {
      value: {
        screens,
        refresh: handleRefresh,
        updateScreens,
      },
    },
    children
  );
}
