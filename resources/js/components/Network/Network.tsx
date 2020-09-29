import { Screen } from "@teckboard-companion/core";
import Axios, { AxiosResponse } from "axios";
import { Browser } from "bonjour";
import * as _ from "lodash";
import * as React from "react";

let bonjour = window.require("bonjour")();

export const NetworkContext = React.createContext<NetworkContextProps>({
  screens: [],
  refresh: undefined,
  updateScreens: undefined,
});

export interface NetworkContextProps {
  screens: Screen[];
  refresh(hardRefresh?: boolean): void;
  updateScreens(screens: Screen[]): Screen[];
}

export interface AuthProviderProps {
  children: React.ReactChild;
}

export default function Network(props: AuthProviderProps) {
  const [browser, setBrowser] = React.useState<Browser>(null);
  const [screens, _setScreens] = React.useState<Screen[]>([]);
  const screensRef = React.useRef(screens);
  const setScreens = (data: Screen[]) => {
    screensRef.current = [...data];
    _setScreens(data);
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

  const updateScreens = (screens: Screen[]) => {
    setScreens([...screens]);
    return screens;
  };

  const handleServiceFound = (service: any) => {
    let teckscreens: Screen[] = screensRef.current;
    if (
      service.name.split("-")[0] == "TECKscreen" &&
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm.test(
        service.addresses[0]
      )
    ) {
      let teckscreen = teckscreens.find(
        (value) => value.ip == service.addresses[0]
      );
      if (!teckscreen) {
        Axios.get("http://" + service.addresses[0] + "/info")
          .then((response: AxiosResponse) => {
            let name = response.data.name;
            teckscreens.push({
              name: name ?? "TECKscreen",
              ip: service.addresses[0],
              restarting: false,
            });
            teckscreens = _.union(teckscreens);
            setScreens(teckscreens);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (teckscreen.restarting) {
        teckscreen.restarting = false;
        screens[screens.indexOf(teckscreen)] = teckscreen;
        setScreens(screens);
        return teckscreen;
      }
    }
  };

  React.useEffect(() => {
    setBrowser(bonjour.find({ type: "http" }, handleServiceFound));
  }, []);

  return React.createElement(
    NetworkContext.Provider,
    {
      value: {
        screens: screens,
        refresh: handleRefresh,
        updateScreens: updateScreens,
      },
    },
    props.children
  );
}
