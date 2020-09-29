import * as React from "react";
import * as ReactDOM from "react-dom";
import Main from "./components/Main";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
import AuthProvider from "./components/Auth";
import VersionProvider from "./components/Version";
import BoardsProvider from "./components/Boards";
import { MemoryRouter } from "react-router-dom";
import ScreenTokenProvider from "@teckboard-companion/core/ScreenToken";
export default function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
