import { prevent } from "../../func/dom";
import { PlayerColor } from "../../types";
import ColorSelector from "../components/ColorSelector";
import NameSelector from "../components/NameSelector";
import { useGame } from "../hooks/useGame";

type LobbyScreenProps = {};

const LobbyScreen = (props: LobbyScreenProps) => {
  const { context, send, can, state } = useGame();
  const colors = [PlayerColor.YELLOW, PlayerColor.RED];

  const joinGame = (name: string) =>
    send({ type: "join", name, playerId: name });
  const chooseColor = (color: PlayerColor) =>
    send({
      type: "chooseColor",
      color,
      playerId: color === PlayerColor.YELLOW ? "John" : "Marc",
    });
  const startGame = () => send({ type: "start" });

  const canStart = can({ type: "start" });

  return (
    <div>
      <ColorSelector
        onSelect={chooseColor}
        colors={colors}
        players={context.players}
      />
      <p>
        <button
          className="button"
          onClick={prevent(startGame)}
          disabled={!canStart}
        >
          Démarrer
        </button>
      </p>
    </div>
  );
};

export default LobbyScreen;
