import { useMachine } from "@xstate/react";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { GameMachine } from "../../machine/GameMachine";
import {
  GameContext,
  GameEvent,
  GameEvents,
  GameStates,
  Player,
} from "../../types";
import { getSession } from "../func/session";

type GameContextType = {
  state: GameStates;
  context: GameContext;
  send: <T extends GameEvents["type"]>(
    event: { type: T; playerId?: string } & Omit<GameEvent<T>, "playerId">
  ) => void;
  can: <T extends GameEvents["type"]>(
    event: { type: T; playerId?: string } & Omit<GameEvent<T>, "playerId">
  ) => boolean;
  playerId: Player["id"];
};

const Context = createContext<GameContextType>({} as any);

export const useGame = (): GameContextType => {
  return useContext(Context);
};

export const GameContextProvider = ({ children }: PropsWithChildren) => {
  const [state, send] = useMachine(GameMachine);
  const playerId = getSession()?.id ?? "";

  const sendWidthPlayer = useCallback<GameContextType["send"]>(
    (event) => send({ playerId, ...event } as GameEvents),
    [playerId]
  );
  const can = useCallback<GameContextType["can"]>(
    (event) =>
      !!GameMachine.transition(state, { playerId, ...event } as GameEvents)
        .changed,
    [state, playerId]
  );

  return (
    <Context.Provider
      value={{
        playerId,
        state: state.value as GameStates,
        context: state.context,
        send: sendWidthPlayer,
        can: can,
      }}
    >
      {children}
    </Context.Provider>
  );
};
