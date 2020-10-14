import * as React from "react";
import { BoardsContext } from "./BoardsProvider";

export default function useAuth() {
  const boards = React.useContext(BoardsContext);
  return boards;
}
