import Icon from "./Icon";
export default interface User {
    id: string;
    firstname: string;
    name: string;
    email: string;
    icon: Icon;
    status: number;
    settings: {
        language?: string;
    };
}