import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
  Link,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Axios from "Axios";
import * as React from "react";
import TbCard from "../TbCard";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(3),
      maxWidth: "100vw",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    loading: {
      width: 200,
      height: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    loadingText: {
      marginTop: theme.spacing(1),
    },
    fab: {
      position: "fixed",
      right: 10,
      bottom: 10,
    },
    modalContent: {
      display: "flex",
      justifyContent: "center",
    },
  })
);
export default function MdnsTeckboards() {
  const classes = useStyles();
  const [screens, setScreens] = React.useState([]);
  const [queried, setQueried] = React.useState(false);
  const [modal, setModal] = React.useState({
    open: false,
    ip: null,
    input: "",
  });
  let mdns = window.require("multicast-dns")();

  const handleOpenModal = (ip: string) => {
    setModal({ ip: ip, open: true, input: "" });
  };

  const handleSubmit = () => {
    Axios.post("http://" + modal.ip, {
      accessToken: "12345678",
      boardId: modal.input,
    }).then(() => {
      setModal({ ip: modal.ip, open: false, input: modal.input });
    });
  };
  const query = () => {
    setScreens([]);
    setQueried(false);
    let counter = 0;
    const mdnsQuery = () => {
      mdns.query({
        questions: [
          {
            name: "teckboard.local",
            type: "A",
          },
        ],
      });
      if (counter == 3) {
        clearInterval(query);
        setQueried(true);
      }
      counter++;
    };
    mdnsQuery();
    let query = setInterval(mdnsQuery, 2000);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key == "r" || e.key == "R") && e.ctrlKey) query();
  };

  React.useEffect(() => {
    const _ = require("loadsh");

    document.addEventListener("keypress", handleKeyDown);

    mdns.on("response", (response: any) => {
      let teckscreens = [...screens];
      response.answers.forEach((answer: any, index: number) => {
        if (
          answer.name == "teckboard.local" &&
          /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm.test(
            answer.data
          )
        ) {
          teckscreens.push(answer.data);
        }
      });

      teckscreens = _.union(teckscreens);

      if (teckscreens.length && !_.isEqual(teckscreens, screens))
        setScreens(teckscreens);
    });
    query();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <div className={classes.container}>
        {screens.map((value: string, index: number) => {
          return <TbCard key={index} openModal={handleOpenModal} ip={value} />;
        })}
        {!screens.length ? (
          !queried ? (
            <div className={classes.loading}>
              <CircularProgress color="primary"></CircularProgress>
              <Typography className={classes.loadingText} color="primary">
                Loading...
              </Typography>
            </div>
          ) : (
            <Typography className={classes.loadingText} color="primary">
              No TECKscreens found.{" "}
              <Link
                color="secondary"
                onClick={query}
                style={{ cursor: "pointer" }}
              >
                Try again.
              </Link>
            </Typography>
          )
        ) : (
          undefined
        )}

        <Fab
          className={classes.fab}
          color="primary"
          variant="extended"
          onClick={query}
        >
          Refresh
          <Typography style={{ paddingLeft: 3 }} variant="caption">
            (Ctrl + R)
          </Typography>
        </Fab>
      </div>
      <Dialog
        onExited={() => {
          setModal({ open: false, ip: null, input: "" });
        }}
        open={modal.open}
        fullWidth
      >
        <DialogTitle disableTypography>
          <Typography align="center" variant="h4">
            <b>{modal.ip}</b>
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <TextField
            value={modal.input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setModal({
                open: modal.open,
                ip: modal.ip,
                input: e.target.value,
              });
            }}
            placeholder="Board"
            color="secondary"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModal({ open: false, ip: modal.ip, input: "" });
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
