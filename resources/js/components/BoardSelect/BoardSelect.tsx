import * as React from "react";
import { Board } from "@teckboard-companion/core";
import {
  Select,
  MenuItem,
  SelectProps,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { useBoards } from "@teckboard-companion/core/Boards";
export interface BoardSelectProps extends SelectProps {
  onChange(
    e: React.ChangeEvent<{ name?: string; value: string }>,
    board: Board
  ): void;
}
export function BoardSelect(props: BoardSelectProps) {
  const { onChange, ...rest } = props;
  const boards = useBoards();
  const [value, setValue] = React.useState("");
  const labelId = "boards-select-label" + (Math.random() * 100).toFixed(0);
  return (
    <FormControl variant="outlined">
      <InputLabel id={labelId}>{props.label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        onChange={(e: React.ChangeEvent<{ name?: string; value: string }>) => {
          if (!props.value) {
            setValue(e.target.value);
          }
          props.onChange(
            e,
            boards[boards.findIndex((value) => value.id === e.target.value)]
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
