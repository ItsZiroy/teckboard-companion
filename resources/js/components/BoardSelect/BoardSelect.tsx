import * as React from "react";
import { useBoards, Board } from "../Boards";
import {
  Select,
  MenuItem,
  SelectProps,
  FormControl,
  InputLabel,
} from "@material-ui/core";
export interface BoardSelectProps extends SelectProps {
  onChange(e: React.ChangeEvent<{ name?: string; value: string }>): void;
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
          setValue(e.target.value);
          props.onChange(e);
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
