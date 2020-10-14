import { AxiosInstance } from "axios";
import { UseScreenProps } from "../Network/UseNetwokScreen";

export default interface Screen extends UseScreenProps {
  autoUpdates: {
    enabled: boolean;
    time: string;
  };
  language: string;
  timezone: string;
  versions: {
    teckboard: string;
    teckscreen: string;
  };
  axios: AxiosInstance;
}
