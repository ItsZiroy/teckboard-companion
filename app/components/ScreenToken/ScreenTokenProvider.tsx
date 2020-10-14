import * as React from "react";

const { remote } = window.require("electron");
const { screenService } = remote.require("./main.prod.js");

export const ScreenTokenContext = React.createContext<{
  token: string;
  refresh(): void;
}>({ token: null, refresh: undefined });
export interface ScreenTokenProviderProps {
  children: React.ReactChild;
}
export default function ScreenTokenProvider(props: ScreenTokenProviderProps) {
  const { children } = props;
  const [token, setToken] = React.useState<string>(undefined);
  React.useEffect(() => {
    screenService.getKeyChainToken().then((t: string) => {
      setToken(t);
    });
  }, []);
  const refresh = () => {
    screenService.getKeyChainToken().then((t: string) => {
      setToken(t);
    });
  };
  return React.createElement(
    ScreenTokenContext.Provider,
    {
      value: {
        token,
        refresh,
      },
    },
    children
  );
}
