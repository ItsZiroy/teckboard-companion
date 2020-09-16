import { Fab, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TbCard from "@teckboard-companion/core/TbCard";
import * as React from "react";
import { Screen } from "@teckboard-companion/core";
import useNetwork from "../Network/UseNetwork";

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
  const network = useNetwork();
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key == "r" || e.key == "R") && e.ctrlKey) network.refresh();
  };

  React.useEffect(() => {
    const _ = require("loadsh");
    document.addEventListener("keypress", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <div className={classes.container}>
        {network.screens
          .sort((s: Screen, t: Screen) => s.name.localeCompare(t.name))
          .map((value: Screen, index: number) => {
            return <TbCard key={index} screen={value} />;
          })}
        {!network.screens.length ? (
          <Typography className={classes.loadingText} color="primary">
            No TECKscreens found.{" "}
            <Link
              color="secondary"
              variant="body1"
              onClick={() => network.refresh()}
            >
              Refresh
            </Link>
          </Typography>
        ) : (
          undefined
        )}

        <Fab
          className={classes.fab}
          color="primary"
          variant="extended"
          onClick={() => {
            network.refresh(true);
          }}
        >
          Refresh
          <Typography style={{ paddingLeft: 3 }} variant="caption">
            (Ctrl + R)
          </Typography>
        </Fab>
      </div>
    </>
  );
}
