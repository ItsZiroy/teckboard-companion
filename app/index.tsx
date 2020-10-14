import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core";
import { MemoryRouter } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import ScreenTokenProvider from "./components/ScreenToken";
import Main from "./components/Main";
import theme from "./theme";
import AuthProvider from "./components/Auth";
import VersionProvider from "./components/Version";
import BoardsProvider from "./components/Boards";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <AuthProvider>
          <VersionProvider>
            <BoardsProvider>
              <ScreenTokenProvider>
                <MemoryRouter initialEntries={["/home"]} initialIndex={0}>
                  <Main />
                </MemoryRouter>
              </ScreenTokenProvider>
            </BoardsProvider>
          </VersionProvider>
        </AuthProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
