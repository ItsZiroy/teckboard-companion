import * as React from "react";
import { AxiosResponse } from "axios";
import { Board } from "@teckboard-companion/core";
const remote = window.require("electron").remote;
const axios = remote.getGlobal("axios");
export const BoardsContext = React.createContext<[Board]>([
  {
    id: "0",
    name: "Loading...",
    icon: null,
    slug: "loading...",
    color_scheme: "#192c4c|#e8e8e8|#efa834|#192c4c",
    company_id: "0",
    uri: "",
    url: "",
  },
]);
export interface BoardsProviderProps {
  children: React.ReactChild;
}
export default function BoardsProvider(props: BoardsProviderProps) {
  var children = props.children;
  const [boards, setBoards] = React.useState<[Board]>([
    {
      id: "0",
      name: "Loading...",
      icon: null,
      slug: "loading...",
      color_scheme: "#192c4c|#e8e8e8|#efa834|#192c4c",
      company_id: "0",
      uri: "",
      url: "",
    },
  ]);
  React.useEffect(() => {
    axios
      .get("https://dev.teckboard.de/api/v1" + "/user/boards")
      .then((response: AxiosResponse) => {
        setBoards(response.data.data);
      });
  }, []);
  return React.createElement(
    BoardsContext.Provider,
    {
      value: boards,
    },
    children
  );
}
