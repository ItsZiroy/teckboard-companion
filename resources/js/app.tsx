import * as React from "react";
import * as ReactDOM from "react-dom";
import Main from "./components/Main";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
