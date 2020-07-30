import * as React from "react";
import { BoardsContext } from "./BoardsProvider";
export default function useAuth() {
  var boards = React.useContext(BoardsContext);
  return boards;
}
