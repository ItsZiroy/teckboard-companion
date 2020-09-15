import {createStyles, makeStyles, StepProps, Theme} from "@material-ui/core";
import clsx from "clsx";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      opacity: (props: StepProps) => (props.active ? 1 : 0),
      transition: theme.transitions.create(["opacity"], {
        duration: 500,
      }),
    },
  })
);
export interface CutstomStepProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  children?: React.ReactNode;
}
export default function CustomStepContainer(props: CutstomStepProps) {
  const classes = useStyles(props);
  const { active, children, className } = props;
  return (
    <div className={clsx(classes.root, className)}>
      {active ? children : undefined}
    </div>
  );
}
