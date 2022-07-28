import { CSSProperties } from "react";
import { discColorClass } from "../../func/color";
import { CellState } from "../../types";

type CellProps = {
  x: number;
  y: number;
  color: CellState;
};

const Cell = ({ x, y, color }: CellProps) => {
  return (
    <div
      className={discColorClass(color)}
      style={{ "--row": y } as CSSProperties}
    />
  );
};

export default Cell;
