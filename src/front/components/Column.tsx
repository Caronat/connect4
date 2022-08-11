import { discColorClass } from "../../func/color";
import { prevent } from "../../func/dom";
import { PlayerColor } from "../../types";

type ColumnProps = {
  x: number;
  color: PlayerColor;
  onDrop: (x: number) => void;
  disabled?: boolean;
};

const Column = ({ x, color, onDrop, disabled }: ColumnProps) => {
  return (
    <button
      onClick={prevent(() => onDrop(x))}
      className="column"
      disabled={disabled}
    >
      <div className={discColorClass(color)}></div>
    </button>
  );
};

export default Column;
