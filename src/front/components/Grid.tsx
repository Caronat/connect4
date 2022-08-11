import { CSSProperties } from "react";
import { winingPositions } from "../../func/game";
import { GridState, PlayerColor, Position } from "../../types";
import Cell from "./Cell";
import Column from "./Column";

type GridProps = {
  grid: GridState;
  color?: PlayerColor;
  onDrop: (x: number) => void;
  winingPositions: Position[];
  canDrop: (x: number) => boolean;
};

const Grid = ({ grid, color, onDrop, winingPositions, canDrop }: GridProps) => {
  const cols = grid[0].length;
  const showColumns = color && onDrop;
  const isWining = (x: number, y: number) =>
    !!winingPositions.find((pos) => pos.x === x && pos.y === y);

  return (
    <div
      className="grid"
      style={{ "--rows": grid.length, "--cols": cols } as CSSProperties}
    >
      {grid.map((row, y) =>
        row.map((c, x) => {
          return (
            <Cell
              x={x}
              y={y}
              color={c}
              active={isWining(x, y)}
              key={`cell-${x}-${y}`}
            />
          );
        })
      )}
      {showColumns && (
        <div className="columns">
          {new Array(cols).fill(1).map((_, i) => (
            <Column
              x={i}
              onDrop={onDrop}
              color={color}
              key={i}
              disabled={!canDrop(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Grid;
