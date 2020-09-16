import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { Board } from "@teckboard-companion/core";
import BoardSelect from "@teckboard-companion/core/BoardSelect";
import Axios from "axios";
import { isEmpty } from "lodash";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Gradients } from "../../theme";
import useScreen from "../Network/UseScreen";
import { useScreenToken } from "../ScreenToken";

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
    header: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      position: "relative",
    },
    name: {
      fontWeight: 800,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginRight: theme.spacing(1),
      [theme.breakpoints.down("sm")]: {
        fontSize: theme.typography.h2.fontSize,
      },
    },
    success: {
      background: Gradients.success,
      color: "#fff",
    },
    remove: {
      marginLeft: theme.spacing(1),
      color: theme.palette.error.main,
    },
    dialogActions: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);
export default function TbScreen() {
  const { id } = useParams<{ id: string }>();
  const screen = useScreen(id);
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
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  const classes = useStyles();
  const screenToken = useScreenToken();

  const handleSave = () => {
    screen.update(name);
  };
  const toggleOpen = () => {
    setOpen(open ? false : true);
  };

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

  const handleRemoveBoard = () => {
    Axios.delete("http://" + screen.ip + "/remove").then((response) => {
      setBoard(null);
    });
  };

  React.useEffect(() => {
    Axios.get("http://" + screen.ip + "/board").then((response) => {
      setBoard(!isEmpty(response.data) ? response.data : null);
    });
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography color="primary" variant="h1" className={classes.name}>
          {screen.name}
        </Typography>
        <IconButton color="primary" onClick={toggleOpen}>
          <EditRoundedIcon fontSize="large" />
        </IconButton>
      </div>
      <div className={classes.container}>
        <Typography style={{ marginRight: 10 }} variant="h6">
          Board:{" "}
        </Typography>
        <BoardSelect
          className={classes.boardSelect}
          value={board ? board.id : ""}
          onChange={handleChange}
        />
        {board ? (
          <Button
            variant="text"
            component="div"
            className={classes.remove}
            onClick={handleRemoveBoard}
          >
            Remove
          </Button>
        ) : (
          undefined
        )}
      </div>
      <div className={classes.currentBoardPanel}>
        <Typography variant="h6">Currently Displaying:</Typography>
        <Typography>
          Board{" "}
          {board ? (
            <Link target="_blank" href={board.url}>
              {board.name}
            </Link>
          ) : (
            undefined
          )}
        </Typography>
      </div>
      <Dialog open={open} maxWidth="xs" fullWidth>
        <DialogTitle>Change Name</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            placeholder="Name"
            defaultValue={screen.name == "TECKscreen" ? "" : screen.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          ></TextField>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={toggleOpen}>Cancel</Button>
          <Button onClick={handleSave} className={classes.success}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
