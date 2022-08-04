import { beforeEach, describe, expect, it } from "vitest";
import { interpret, InterpreterFrom } from "xstate";
import {
  GameMachine,
  GameModel,
  makeGame,
} from "../../src/machine/GameMachine";
import { GameStates, PlayerColor } from "../../src/types";

describe("machine/GameMachine", () => {
  describe("join", () => {
    let machine: InterpreterFrom<typeof GameMachine>;

    beforeEach(() => {
      machine = interpret(GameMachine).start();
    });

    it("should let join 2 players maximum", () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
      expect(machine.state.context.players).toHaveLength(1);
      expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true);
      expect(machine.state.context.players).toHaveLength(2);
      expect(machine.send(GameModel.events.join("3", "3")).changed).toBe(false);
    });

    it("should not let join palyer twice", () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(false);
    });
  });

  describe("leave", () => {
    let machine: InterpreterFrom<typeof GameMachine>;

    beforeEach(() => {
      machine = makeGame(GameStates.LOBBY, {
        players: [
          { id: "1", name: "1" },
          { id: "2", name: "2" },
        ],
      });
    });

    it("should let me leave", () => {
      expect(machine.send(GameModel.events.leave("1")).changed).toBe(true);
      expect(machine.state.context.players).toHaveLength(1);
      expect(machine.send(GameModel.events.leave("2")).changed).toBe(true);
      expect(machine.state.context.players).toHaveLength(0);
    });

    it("should let me leave only if i'm in lobby", () => {
      expect(machine.send(GameModel.events.leave("1")).changed).toBe(true);
      expect(machine.send(GameModel.events.leave("1")).changed).toBe(false);
    });
  });

  describe("chooseColor", () => {
    let machine: InterpreterFrom<typeof GameMachine>;

    beforeEach(() => {
      machine = makeGame(GameStates.LOBBY, {
        players: [
          { id: "1", name: "1" },
          { id: "2", name: "2" },
        ],
      });
    });

    it("should let me choose color", () => {
      expect(
        machine.send(GameModel.events.chooseColor("1", PlayerColor.RED)).changed
      ).toBe(true);
      expect(
        machine.send(GameModel.events.chooseColor("2", PlayerColor.YELLOW))
          .changed
      ).toBe(true);
    });

    it("should not let me choose same color", () => {
      expect(
        machine.send(GameModel.events.chooseColor("1", PlayerColor.RED)).changed
      ).toBe(true);
      expect(
        machine.send(GameModel.events.chooseColor("2", PlayerColor.RED)).changed
      ).toBe(false);
    });

    it("should let me choose color only if i'm in lobby", () => {
      expect(
        machine.send(GameModel.events.chooseColor("4", PlayerColor.RED)).changed
      ).toBe(false);
    });
  });

  describe("dropToken", () => {
    let machine: InterpreterFrom<typeof GameMachine>;

    beforeEach(() => {
      machine = makeGame(GameStates.PLAY, {
        players: [
          { id: "1", name: "1", color: PlayerColor.RED },
          { id: "2", name: "2", color: PlayerColor.YELLOW },
        ],
        currentPlayer: "1",
        grid: [
          ["E", "E", "E", "E", "E", "E", "R"],
          ["E", "E", "E", "E", "E", "R", "Y"],
          ["E", "E", "E", "E", "E", "R", "R"],
          ["E", "E", "E", "E", "E", "R", "Y"],
          ["E", "E", "E", "E", "E", "Y", "R"],
          ["E", "E", "E", "E", "E", "Y", "Y"],
        ],
      });
    });

    it("should let me drop a token", () => {
      expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(
        true
      );
      expect(machine.state.context.grid[5][0]).toBe(PlayerColor.RED);
      expect(machine.state.value).toBe(GameStates.PLAY);
      expect(machine.state.context.currentPlayer).toBe("2");
      expect(machine.send(GameModel.events.dropToken("2", 0)).changed).toBe(
        true
      );
      expect(machine.state.context.grid[4][0]).toBe(PlayerColor.YELLOW);
      expect(machine.state.value).toBe(GameStates.PLAY);
      expect(machine.state.context.currentPlayer).toBe("1");
    });

    it("should not let me drop the token on filled columns", () => {
      expect(machine.send(GameModel.events.dropToken("1", 6)).changed).toBe(
        false
      );
    });

    it("should make me win", () => {
      expect(machine.send(GameModel.events.dropToken("1", 5)).changed).toBe(
        true
      );
      expect(machine.state.value).toBe(GameStates.VICTORY);
      expect(machine.state.context.winingPositions).toHaveLength(4);
    });

    it("should handle draw", () => {
      machine = makeGame(GameStates.PLAY, {
        ...machine.state.context,
        grid: [
          ["E", "Y", "Y", "Y", "Y", "Y", "Y"],
          ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
          ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
          ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
          ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
          ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
        ],
      });

      expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(
        true
      );
      expect(machine.state.value).toBe(GameStates.DRAW);
    });
  });
});
