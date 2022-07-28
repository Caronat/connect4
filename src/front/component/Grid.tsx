import { CSSProperties } from "react";
import { GridState, PlayerColor } from "../../types";
import Cell from "./Cell";
import Column from "./Column";

type GridProps = {
  grid: GridState;
  color?: PlayerColor;
  onDrop?: (x: number) => void;
};

const Grid = ({ grid, color, onDrop }: GridProps) => {
  const cols = grid[0].length;
  const showColumns = color && onDrop;

  return (
    <div
      className="grid"
      style={{ "--rows": grid.length, "--cols": cols } as CSSProperties}
    >
      {grid.map((row, y) =>
        row.map((c, x) => {
          return <Cell x={x} y={y} color={c} key={`cell-${x}-${y}`} />;
        })
      )}
      {showColumns && (
        <div className="columns">
          {new Array(cols).fill(1).map((_, i) => (
            <Column onDrop={() => onDrop(i)} color={color} key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Grid;
