import { GameContext, GridState, Player, PlayerColor } from "../types";

export const currentPlayer = (context: GameContext): Player => {
  const player = context.players.find((p) => p.id === context.currentPlayer);
  if (player === undefined) {
    throw new Error("Impossible de récupérer le jouer courant");
  }
  return player;
};

export const freePositionY = (grid: GridState, x: number): number => {
  for (let y = grid.length - 1; y >= 0; y--) {
    if (grid[y][x] === "E") return y;
  }
  return -1;
};

export const winingPositions = (
  grid: GridState,
  color: PlayerColor,
  x: number,
  size: number
) => {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  const position = {
    y: freePositionY(grid, x),
    x: x,
  };

  for (const direction of directions) {
    let items = [position];
    for (const forward of [1, -1]) {
      for (let i = 1; i < size; i++) {
        const x = position.x + i * direction[0] * forward;
        const y = position.y + i * direction[1] * forward;
        if (grid?.[y]?.[x] !== color) break;
        items.push({ x, y });
      }
      if (items.length >= size) return items;
    }
  }
  return [];
};

export const countEmptyCells = (grid: GridState): number => {
  return grid
    .map((row) => row.filter((v) => v === "E").length)
    .reduce((a, b) => a + b);
};
