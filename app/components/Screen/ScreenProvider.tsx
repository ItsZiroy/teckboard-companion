import Axios, { AxiosResponse } from "axios";
import { assign, has, isEqual, isObject } from "lodash";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import { NetworkScreen, Screen } from "../types";
import { useNetworkScreen } from "../Network";
import { useScreenToken } from "../ScreenToken";
import { useStore } from "../Store";

export const ScreenContext = React.createContext<ScreenContextProps>(null);

export interface ScreenContextProps extends Screen {
  update(
    param: keyof Screen | Record<string, unknown>,
    value: any
  ): Promise<Screen>;
}

export interface ScreenProviderProps {
  children: React.ReactChild;
}

export default function ScreenProvider(props: ScreenProviderProps) {
  const { children } = props;
  const { id } = useParams<{ id: string }>();
  const store = useStore("token");
  const screenToken = useScreenToken();
  const history = useHistory();
  const networkScreen = useNetworkScreen(id);
  const [screen, setScreen] = React.useState<Screen>(null);

  const update = async (
    param: keyof Screen | Record<string, unknown>,
    value: any
  ): Promise<Screen> => {
    const newScreen = { ...screen };
    if (isObject(param)) {
      networkScreen.update(param);
      assign(newScreen, param);
    } else {
      if (has(networkScreen, param)) {
        networkScreen.update(param as keyof NetworkScreen, value);
      }
      (newScreen[param] as any) = value;
    }
    if (!isEqual(screen, newScreen)) {
      await screen.axios.patch("info", { ...newScreen });
      setScreen(newScreen);
    }
    return newScreen;
  };
  React.useEffect(() => {
    const fetch = async () => {
      let token = store.get(id);
      if (!networkScreen.setup && !networkScreen.owned) {
        history.push(`${history.location.pathname}/setup`);
        return;
      }
      if (networkScreen.setup && networkScreen.owned && !token) {
        const response = await Axios.post(
          `http://${networkScreen.ip}/authorize`,
          {
            access_token: screenToken.token,
          }
        );
        store.set(id, response.data);
        token = response.data;
        networkScreen.update({ setup: true, owned: true });
      }
      const axios = Axios.create({
        baseURL: `http://${networkScreen.ip}`,
        headers: {
          Authorization: token,
        },
      });
      const response: AxiosResponse = await axios.get("info");

      const { autoUpdates, language, timezone, versions } = response.data;
      setScreen({
        ...networkScreen,
        autoUpdates,
        language,
        versions,
        timezone,
        axios,
      });
    };
    fetch();
  }, []);

  return React.createElement(
    ScreenContext.Provider,
    {
      value: {
        ...screen,
        update,
      },
    },
    children
  );
}
