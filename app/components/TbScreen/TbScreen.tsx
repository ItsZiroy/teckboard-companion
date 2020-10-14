import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Link,
  makeStyles,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { RotateLeftRounded } from "@material-ui/icons";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { isEmpty } from "lodash";
import * as React from "react";
import { useHistory } from "react-router-dom";
import BoardSelect from "../BoardSelect";
import { Gradients } from "../../theme";
import { useScreen } from "../Screen";

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
  const screen = useScreen();
  const [board, setBoard] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  const classes = useStyles();
  const history = useHistory();
  const handleSave = () => {
    screen.update("name", name).then(() => {
      setOpen(false);
    });
  };
  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    screen.axios
      .patch("board", {
        id: e.target.value,
      })
      .then(() => setBoard(e.target.value as string));
  };

  const handleRemoveBoard = () => {
    screen.axios.delete("board").then(() => {
      setBoard(null);
    });
  };

  const handleRestart = () => {
    screen.axios.post("restart").then(() => {
      screen.update("restarting", true);
      history.push("/home");
    });
  };

  React.useEffect(() => {
    if (screen.axios) {
      screen.axios.get("board").then((response) => {
        setBoard(!isEmpty(response.data) ? response.data.id : null);
      });
    }
  }, [screen]);
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography color="primary" variant="h1" className={classes.name}>
          {screen.name}
        </Typography>
        <IconButton color="primary" onClick={toggleOpen}>
          <EditRoundedIcon fontSize="large" />
        </IconButton>
        <Tooltip title="Restart">
          <Fab
            style={{ marginLeft: "auto", marginRight: 5 }}
            color="primary"
            onClick={handleRestart}
          >
            <RotateLeftRounded fontSize="large" />
          </Fab>
        </Tooltip>
      </div>
      <div className={classes.container}>
        <Typography style={{ marginRight: 10 }} variant="h6">
          Board:
        </Typography>
        <BoardSelect
          className={classes.boardSelect}
          value={board || ""}
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
        ) : undefined}
      </div>
      <div className={classes.currentBoardPanel}>
        <Typography variant="h6">Currently Displaying:</Typography>
        <Typography>Board</Typography>
      </div>
      <Dialog open={open} maxWidth="xs" fullWidth>
        <DialogTitle>Change Name</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            placeholder="Name"
            defaultValue={screen.name === "TECKscreen" ? "" : screen.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              return setName(e.target.value);
            }}
          />
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
