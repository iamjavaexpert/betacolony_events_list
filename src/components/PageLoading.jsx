import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  progress: {
    margin: theme.spacing(2),
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    height: "100%",
  },
}));

export default function PageLoading() {
  const classes = useStyles();

  return (
    <div className={classes.loader}>
      <CircularProgress
        className={classes.progress}
        color="primary"
        disableShrink
      />
    </div>
  );
}
