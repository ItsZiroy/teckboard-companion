import { assign, isObject } from "lodash";
import NetworkScreen from "../types/NetworkScreen";
import useNetwork from "./UseNetwork";

export interface UseScreenProps extends NetworkScreen {
  update(
    param: keyof NetworkScreen | unknown,
    value?: any
  ): Promise<NetworkScreen>;
}
export default function useNetworkScreen(id: string): UseScreenProps {
  const network = useNetwork();

  const screen = network.screens.find((screens) => screens.id === id);
  const update = async (
    param: keyof NetworkScreen | unknown,
    value?: any
  ): Promise<NetworkScreen> => {
    const { screens } = network;
    const newScreen = screen;
    if (isObject(param)) {
      assign(newScreen, param);
    } else {
      (newScreen[param as keyof NetworkScreen] as any) = value;
    }
    screens[screens.indexOf(screen)] = newScreen;
    network.updateScreens(screens);
    return newScreen;
  };

  return {
    ...screen,
    update,
  };
}
