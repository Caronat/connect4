import { createMachine, interpret, InterpreterFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  GameContext,
  GameStates,
  GridState,
  Player,
  PlayerColor,
  Position,
} from "../types";
import {
  chooseColorAction,
  dropTokenAction,
  joinGameAction,
  leaveGameAction,
  restartAction,
  saveWiningPositionsAction,
  setCurrentPlayerAction,
  switchPlayerAction,
} from "./actions";
import {
  canChooseColorGuard,
  canDropGuard,
  canJoinGuard,
  canLeaveGuard,
  canStartGameGuard,
  isDrawMoveGuard,
  isWiningMoveGuard,
} from "./guards";

export const GameModel = createModel(
  {
    players: [] as Player[],
    currentPlayer: null as null | Player["id"],
    rowLength: 4,
    winingPositions: [] as Position[],
    grid: [
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
      ["E", "E", "E", "E", "E", "E", "E"],
    ] as GridState,
  },
  {
    events: {
      join: (playerId: Player["id"], name: Player["name"]) => ({
        playerId,
        name,
      }),
      leave: (playerId: Player["id"]) => ({ playerId }),
      chooseColor: (playerId: Player["id"], color: PlayerColor) => ({
        playerId,
        color,
      }),
      start: (playerId: Player["id"]) => ({ playerId }),
      dropToken: (playerId: Player["id"], x: number) => ({ playerId, x }),
      restart: (playerId: Player["id"]) => ({ playerId }),
    },
  }
);

export const GameMachine = createMachine({
  id: "game",
  context: GameModel.initialContext,
  initial: GameStates.LOBBY,
  states: {
    [GameStates.LOBBY]: {
      on: {
        join: {
          cond: canJoinGuard,
          actions: [GameModel.assign(joinGameAction)],
          target: GameStates.LOBBY,
        },
        leave: {
          cond: canLeaveGuard,
          actions: [GameModel.assign(leaveGameAction)],
          target: GameStates.LOBBY,
        },
        chooseColor: {
          cond: canChooseColorGuard,
          actions: [GameModel.assign(chooseColorAction)],
          target: GameStates.LOBBY,
        },
        start: {
          cond: canStartGameGuard,
          actions: [GameModel.assign(setCurrentPlayerAction)],
          target: GameStates.PLAY,
        },
      },
    },
    [GameStates.PLAY]: {
      after: {
        30000: {
          target: GameStates.PLAY,
          actions: [GameModel.assign(switchPlayerAction)],
        },
      },
      on: {
        dropToken: [
          {
            cond: isDrawMoveGuard,
            target: GameStates.DRAW,
            actions: [GameModel.assign(dropTokenAction)],
          },
          {
            cond: isWiningMoveGuard,
            target: GameStates.VICTORY,
            actions: [
              GameModel.assign(saveWiningPositionsAction),
              GameModel.assign(dropTokenAction),
            ],
          },
          {
            cond: canDropGuard,
            target: GameStates.PLAY,
            actions: [
              GameModel.assign(dropTokenAction),
              GameModel.assign(switchPlayerAction),
            ],
          },
        ],
      },
    },
    [GameStates.VICTORY]: {
      on: {
        restart: {
          target: GameStates.LOBBY,
          actions: [GameModel.assign(restartAction)],
        },
      },
    },
    [GameStates.DRAW]: {
      on: {
        restart: {
          target: GameStates.LOBBY,
          actions: [GameModel.assign(restartAction)],
        },
      },
    },
  },
});

export const makeGame = (
  state: GameStates = GameStates.LOBBY,
  context: Partial<GameContext> = {}
): InterpreterFrom<typeof GameMachine> => {
  const machine = interpret(
    GameMachine.withContext({
      ...GameModel.initialContext,
      ...context,
    })
  ).start();

  machine.state.value = state;
  return machine;
};