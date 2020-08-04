import Icon from "./Icon";
export default interface Board {
    id: string;
    name: string;
    icon: Icon | null;
    slug: string;
    color_scheme: string;
    company_id: string;
    uri: string;
    url: string;
}