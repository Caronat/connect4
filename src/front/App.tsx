import { currentPlayer } from "../func/game";
import { GameStates } from "../types";
import Grid from "./components/Grid";
import { useGame } from "./hooks/useGame";
import DrawScreen from "./screens/DrawScreen";
import LobbyScreen from "./screens/LobbyScreen";
import LoginScreen from "./screens/LoginScreen";
import PlayScreen from "./screens/PlayScreen";
import VictoryScreen from "./screens/VictoryScreen";

function App() {
  const { state, context, send, playerId, can } = useGame();
  const showGrid = state !== GameStates.LOBBY;
  const dropToken = (x: number) => {
    send({ type: "dropToken", x });
  };

  if (!playerId) {
    return (
      <div className="container">
        <LoginScreen />
      </div>
    );
  }

  return (
    <div className="container">
      {state === GameStates.LOBBY && <LobbyScreen />}
      {state === GameStates.PLAY && <PlayScreen />}
      {state === GameStates.VICTORY && <VictoryScreen />}
      {state === GameStates.DRAW && <DrawScreen />}
      {showGrid && (
        <Grid
          winingPositions={context!.winingPositions}
          grid={context!.grid}
          onDrop={dropToken}
          color={currentPlayer(context)?.color}
          canDrop={(x) => can({ type: "dropToken", x })}
        />
      )}
    </div>
  );
}

export default App;
