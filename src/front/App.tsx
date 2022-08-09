import { useEffect } from "react";
import { currentPlayer } from "../func/game";
import { GameStates, ServerErrors } from "../types";
import Grid from "./components/Grid";
import { getSession, logout } from "./func/session";
import { useGame } from "./hooks/useGame";
import DrawScreen from "./screens/DrawScreen";
import LobbyScreen from "./screens/LobbyScreen";
import LoginScreen from "./screens/LoginScreen";
import PlayScreen from "./screens/PlayScreen";
import VictoryScreen from "./screens/VictoryScreen";

function App() {
  const { state, context, send, playerId } = useGame();

  const canDrop = state === GameStates.PLAY;
  const player = canDrop ? currentPlayer(context) : undefined;
  const dropToken = canDrop
    ? (x: number) => {
        send({ type: "dropToken", x: x });
      }
    : undefined;

  useEffect(() => {
    if (playerId) {
      const searchParams = new URLSearchParams({
        id: playerId,
        signature: getSession()!.signature!,
        name: getSession()!.name!,
        gameId: "test",
      });
      const protocol = window.location.protocol;
      const host = window.location.host;
      const socket = new WebSocket(
        `${protocol.replace(
          "http",
          "ws"
        )}//${host}/ws?${searchParams.toString()}`
      );
      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        if (
          message.type === "error" &&
          message.code === ServerErrors.AuthError
        ) {
          logout();
        }
      });
    }
  }, [playerId]);

  if (!playerId) {
    return (
      <div className="container">
        <LoginScreen />
      </div>
    );
  }

  return (
    <div className="container">
      Player : {playerId}
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
