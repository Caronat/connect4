import { CSSProperties } from "react";
import { discColorClass } from "../../func/color";
import { CellState } from "../../types";

type CellProps = {
  x: number;
  y: number;
  color: CellState;
  active: boolean;
};

const Cell = ({ x, y, color, active }: CellProps) => {
  return (
    <div
      className={discColorClass(color) + (active ? " disc-active" : "")}
      style={{ "--row": y } as CSSProperties}
    />
  );
};

export default Cell;
