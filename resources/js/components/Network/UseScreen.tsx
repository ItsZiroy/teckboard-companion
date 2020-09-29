import Axios, { AxiosResponse } from "axios";
import { Screen } from "../types";
import useNetwork from "./UseNetwork";

export interface useScreenProps extends Screen {
  update(name: string): Promise<Screen>;
  setRestarting(restarting: boolean): Screen;
}
export default function useScreen(ip: string): useScreenProps {
  const network = useNetwork();

  const screen = network.screens.find((screens) => screens.ip === ip);

  const _update = (param: keyof Screen, value: any): Screen => {
    let screens = network.screens;
    let newScreen = screen;
    (newScreen[param] as any) = value;
    screens[screens.indexOf(screen)] = newScreen;
    network.updateScreens(screens);
    return newScreen;
  };

  const handleSetRestarting = (restarting: boolean): Screen => {
    return _update("restarting", true);
  };

  const handleUpdate = async (name: string): Promise<Screen> => {
    if (name.length) {
      Axios.post("http://" + screen.ip + "/info", {
        name: name,
      }).then((response: AxiosResponse) => {
        return _update("name", name);
      });
    } else {
      Axios.delete("http://" + screen.ip + "/info").then(
        (response: AxiosResponse) => {
          return _update("name", "TECKscreen");
        }
      );
    }
    return null;
  };

  return {
    ...screen,
    update: handleUpdate,
    setRestarting: handleSetRestarting,
  };
}
