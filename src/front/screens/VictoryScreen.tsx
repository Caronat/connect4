import { currentPlayer } from "../../func/game";
import Victory from "../components/Victory";
import { useGame } from "../hooks/useGame";

type VictoryScreenProps = {};

const VictoryScreen = ({}: VictoryScreenProps) => {
  const { context, send } = useGame();
  const player = currentPlayer(context);
  const restart = () => send({ type: "restart" });

  return (
    <div>
      <Victory name={player.name} color={player.color!} onRestart={restart} />
    </div>
  );
};

export default VictoryScreen;
