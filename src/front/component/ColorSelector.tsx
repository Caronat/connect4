import { discColorClass } from "../../func/color";
import { Player, PlayerColor } from "../../types";

type ColorSelectorProps = {
  onSelect: (color: PlayerColor, players: Player[]) => void;
  players: Player[];
  colors: PlayerColor[];
};

const ColorSelector = ({ onSelect, players, colors }: ColorSelectorProps) => {
  return (
    <>
      <div className="players">
        {players.map((player) => (
          <div className="player" key={player.id}>
            {player.name}
            {player.color && <div className={discColorClass(player.color)} />}
          </div>
        ))}
      </div>
      <h3>Sélectionnez une couleur</h3>
      <div className="selector">
        {colors.map((color) => {
          return (
            <button className={discColorClass(color)} key={color}></button>
          );
        })}
      </div>
    </>
  );
};

export default ColorSelector;
