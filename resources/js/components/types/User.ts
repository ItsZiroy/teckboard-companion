import { Channel } from "laravel-echo/dist/channel";
import Icon from "./Icon";
export default interface User {
    id: string;
    firstname: string;
    name: string;
    email: string;
    icon: Icon;
    channel: Channel;
    status: number;
    settings: {
        language?: string;
    };
}