import * as React from "react";
import * as ReactDOM from "react-dom";
import Main from "./components/Main";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
import AuthProvider from "./components/Auth";
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </ThemeProvider>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
