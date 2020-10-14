import { AxiosResponse } from "axios";
import { Channel } from "laravel-echo/dist/channel";
import * as React from "react";
import { useEcho } from "../Network";
import { version as packageVersion } from "../../package.json";
import Version from "../types/Version";

const { remote } = window.require("electron");
const axios = remote.getGlobal("axios");

export const VersionContext = React.createContext<VersionProvider>({
  companion: {
    stable: packageVersion,
    upcoming: null,
    maintances: [],
  },
  teckboard: {
    stable: null,
    upcoming: null,
    maintances: [],
  },
});
export interface VersionProvider {
  companion: Version;
  teckboard: Version;
}
export interface VersionProviderProps {
  children: React.ReactChild;
}
export default function VersionProvider(props: VersionProviderProps) {
  const { children } = props;
  const [version, defaultSetVersion] = React.useState<VersionProvider>({
    companion: {
      stable: packageVersion,
      upcoming: null,
      maintances: [],
    },
    teckboard: {
      stable: null,
      upcoming: null,
      maintances: [],
    },
  });
  const versionRef = React.useRef(version);
  const echo = useEcho();
  const setVersion = (data: VersionProvider) => {
    versionRef.current = { ...data };
    defaultSetVersion(data);
  };

  const join = (): Channel => {
    const channel = echo.channel("updates");

    channel.listen(".App.Version.Update", (response: { version: Version }) => {
      const newVersion = versionRef.current;
      newVersion.teckboard = response.version;
      setVersion(newVersion);
    });

    return channel;
  };

  React.useEffect(() => {
    axios
      .get("https://teckboard.de/api/v1/version")
      .then((response: AxiosResponse) => {
        version.teckboard = response.data;
        setVersion(version);
        join();
      });
  }, []);

  return React.createElement(
    VersionContext.Provider,
    {
      value: version,
    },
    children
  );
}
