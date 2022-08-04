import { discColorClass } from "../../func/color";
import { prevent } from "../../func/dom";
import { PlayerColor } from "../../types";

type ColumnProps = {
  color: PlayerColor;
  onDrop: () => void;
};

const Column = ({ color, onDrop }: ColumnProps) => {
  return (
    <button onClick={prevent(onDrop)} className="column">
      <div className={discColorClass(color)}></div>
    </button>
  );
};

export default Column;
