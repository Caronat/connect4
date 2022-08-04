import { currentPlayer } from "../func/game";
import { GameStates } from "../types";
import Grid from "./components/Grid";
import { useGame } from "./hooks/useGame";
import DrawScreen from "./screens/DrawScreen";
import LobbyScreen from "./screens/LobbyScreen";
import PlayScreen from "./screens/PlayScreen";
import VictoryScreen from "./screens/VictoryScreen";

function App() {
  const { state, context, send } = useGame();

  const canDrop = state === GameStates.PLAY;
  const player = canDrop ? currentPlayer(context) : undefined;
  const dropToken = canDrop
    ? (x: number) => {
        send({ type: "dropToken", x: x });
      }
    : undefined;

  return (
    <div className="container">
      {state === GameStates.LOBBY && <LobbyScreen />}
      {state === GameStates.PLAY && <PlayScreen />}
      {state === GameStates.VICTORY && <VictoryScreen />}
      {state === GameStates.DRAW && <DrawScreen />}
      {state !== GameStates.LOBBY && (
        <Grid
          grid={context.grid}
          onDrop={dropToken}
          color={player?.color}
          winingPositions={context.winingPositions}
        />
      )}
    </div>
  );
}

export default App;
