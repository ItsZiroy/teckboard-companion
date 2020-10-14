import * as React from "react";

import {
  Select,
  MenuItem,
  SelectProps,
  FormControl,
  InputLabel,
  FormControlProps as ControlProps,
} from "@material-ui/core";
import { useBoards } from "../Boards";
import { Board } from "../types";

interface BoardSelectPropsU {
  onChange?: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    child: React.ReactNode
  ) => void;

  children?: React.ReactChildren;
}
export interface BoardSelectProps
  extends Exclude<SelectProps, BoardSelectPropsU> {
  FormControlProps?: ControlProps;
}
export function BoardSelect(props: BoardSelectProps) {
  const { onChange, className, label, FormControlProps, ...rest } = props;
  const boards = useBoards();
  const [value, setValue] = React.useState("");
  const labelId = `boards-select-label${(Math.random() * 100).toFixed(0)}`;
  return (
    <FormControl variant="outlined" className={className} {...FormControlProps}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
          if (!props.value) {
            setValue(e.target.value as string);
          }
          props.onChange(
            e,
            boards[boards.findIndex((board) => board.id === e.target.value)]
          );
        }}
        color="secondary"
        {...rest}
      >
        {boards.map((value: Board) => {
          return (
            <MenuItem key={value.id} value={value.id}>
              {value.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
BoardSelect.defaultProps = {
  label: "Select Board",
};
export default BoardSelect;
