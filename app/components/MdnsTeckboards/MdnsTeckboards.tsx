import { Fab, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import TbCard from "../TbCard";
import useNetwork from "../Network/UseNetwork";
import { NetworkScreen } from "../types";

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
    if ((e.key === "r" || e.key === "R") && e.ctrlKey) network.refresh();
  };

  React.useEffect(() => {
    document.addEventListener("keypress", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <div className={classes.container}>
        {network.screens
          .sort((s: NetworkScreen, t: NetworkScreen) =>
            s.name.localeCompare(t.name)
          )
          .map((value: NetworkScreen) => {
            return <TbCard key={value.id} screen={value} />;
          })}
        {!network.screens.length ? (
          <Typography
            className={classes.loadingText}
            color="primary"
            component="div"
          >
            No TECKscreens found.
            <Link
              color="secondary"
              variant="body1"
              onClick={() => network.refresh()}
              style={{ cursor: "pointer" }}
            >
              {" Refresh"}
            </Link>
          </Typography>
        ) : undefined}

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
