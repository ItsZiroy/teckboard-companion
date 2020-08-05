import * as React from "react";
const remote = window.require("electron").remote;
const screenService = remote.require("./services/screen-service");

export const ScreenTokenContext = React.createContext<{
  token: string;
  refresh(): void;
}>({ token: null, refresh: undefined });
export interface ScreenTokenProviderProps {
  children: React.ReactChild;
}
export default function ScreenTokenProvider(props: ScreenTokenProviderProps) {
  var children = props.children;
  const [token, setToken] = React.useState<string>(null);
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
        token: token,
        refresh: refresh,
      },
    },
    children
  );
}
