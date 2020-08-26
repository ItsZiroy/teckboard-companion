import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Link,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import BoardSelect from "@teckboard-companion/core/BoardSelect";
import TbCard from "@teckboard-companion/core/TbCard";
import Axios from "axios";
import * as React from "react";
import { Screen } from "@teckboard-companion/core";
import * as _ from "lodash";
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
    boardSelect: {
      minWidth: 250,
    },
  })
);
export default function MdnsTeckboards() {
  const classes = useStyles();
  const [screens, _setScreens] = React.useState<Screen[]>([]);
  const [queried, setQueried] = React.useState(false);
  const screensRef = React.useRef(screens);
  const setScreens = (data: Screen[]) => {
    screensRef.current = data;
    _setScreens(data);
  };
  const [modal, setModal] = React.useState({
    open: false,
    ip: null,
    input: "",
  });
  let bonjour = window.require("bonjour")();
  let browser = bonjour.find({ type: "http" });
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
    browser.update();
    setScreens([]);
    servicesToScreens();
  };
  const servicesToScreens = () => {
    let teckscreens: Screen[] = [...screensRef.current];
    browser.services.forEach((service: any, index: number) => {
      if (
        service.name.split("-")[0] == "TECKscreen" &&
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm.test(
          service.addresses[0]
        )
      ) {
        if (
          !teckscreens[index] ||
          !_.isEqual(teckscreens[index].ip, service.addresses[0])
        ) {
          Axios.get("http://" + service.addresses[0] + "/info")
            .then((response) => {
              let name = response.data.name;
              teckscreens.push({
                name: name ?? "TECKscreen",
                ip: service.addresses[0],
              });
              teckscreens = _.union(teckscreens);
              setScreens(teckscreens);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key == "r" || e.key == "R") && e.ctrlKey) query();
  };

  React.useEffect(() => {
    const _ = require("loadsh");

    document.addEventListener("keypress", handleKeyDown);
    browser.on("up", (service: any) => {
      let teckscreens: Screen[] = [...screensRef.current];
      if (
        service.name.split("-")[0] == "TECKscreen" &&
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm.test(
          service.addresses[0]
        )
      ) {
        Axios.get("http://" + service.addresses[0] + "/info")
          .then((response) => {
            let name = response.data.name;
            teckscreens.push({
              name: name ?? "TECKscreen",
              ip: service.addresses[0],
            });
            teckscreens = _.union(teckscreens);
            setScreens(teckscreens);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <div className={classes.container}>
        {screens
          .sort((s: Screen, t: Screen) => s.name.localeCompare(t.name))
          .map((value: Screen, index: number) => {
            return <TbCard key={index} screen={value} />;
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
          <BoardSelect
            onChange={(e: React.ChangeEvent<{ value: string }>) => {
              setModal({
                open: modal.open,
                ip: modal.ip,
                input: e.target.value,
              });
            }}
            className={classes.boardSelect}
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
