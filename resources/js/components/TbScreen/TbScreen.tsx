import {
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import BoardSelect from "@teckboard-companion/core/BoardSelect";
import Axios from "axios";
import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useScreenToken } from "../ScreenToken";
import { Screen, Board } from "@teckboard-companion/core";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "center",
    },
    container: {
      display: "flex",
      alignItems: "center",
      marginTop: theme.spacing(3),
    },
    currentBoardPanel: {
      position: "fixed",
      zIndex: 1200,
      bottom: 0,
      right: 0,
      width: 500,
      height: 100,
      color: "#fff",
      padding: theme.spacing(4),
      borderTopLeftRadius: theme.spacing(1.5),
      background: "linear-gradient(80deg, #fb6340, #fbb140)",
      boxShadow: theme.shadows[5],
    },
    boardSelect: {
      width: 300,
    },
  })
);
export default function TbScreen() {
  const { id } = useParams();
  const location = useLocation<Screen>();
  const screen: Screen = location.state;
  const [board, setBoard] = React.useState<Board>({
    id: "0",
    name: "Loading...",
    icon: null,
    slug: "loading...",
    color_scheme: "#192c4c|#e8e8e8|#efa834|#192c4c",
    company_id: "0",
    uri: "",
    url: "",
  });
  const classes = useStyles();
  const screenToken = useScreenToken();
  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: string }>,
    board: Board
  ) => {
    Axios.post("http://" + screen.ip, {
      accessToken: screenToken.token,
      boardId: e.target.value,
    }).then((response) => console.log(response));
    setBoard(board);
  };

  React.useEffect(() => {
    Axios.get("http://" + screen.ip + "/board").then((response) => {
      setBoard(response.data);
    });
  }, []);
  return (
    <div className={classes.root}>
      <Typography color="primary" variant="h3">
        {screen.name}
      </Typography>
      <div className={classes.container}>
        <Typography style={{ marginRight: 10 }} variant="h6">
          Board:{" "}
        </Typography>
        <BoardSelect className={classes.boardSelect} onChange={handleChange} />
      </div>
      <div className={classes.currentBoardPanel}>
        <Typography variant="h6">Currently Displaying:</Typography>
        <Typography>
          Board{" "}
          <Link target="_blank" href={board.url}>
            {board.name}
          </Link>
        </Typography>
      </div>
    </div>
  );
}
