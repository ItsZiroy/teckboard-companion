import Axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Screen } from "../types";
import useNetwork from "./UseNetwork";

export interface useScreenProps extends Screen {
  update(name: string): Promise<Screen>;
}
export default function useScreen(ip: string): useScreenProps {
  const network = useNetwork();
  const screen = network.screens.find((screens) => screens.ip === ip);

  const handleUpdate = async (name: string): Promise<Screen> => {
    Axios.post("http://" + screen.ip + "/info", {
      name: name,
    }).then((response: AxiosResponse) => {
      let screens = network.screens;
      let newScreen = screen;
      newScreen.name = response.data.information.name;
      screens[screens.indexOf(screen)] = newScreen;
      network.updateScreens(screens);
      return newScreen;
    });
    return null;
  };

  return {
    ...screen,
    update: handleUpdate,
  };
}
