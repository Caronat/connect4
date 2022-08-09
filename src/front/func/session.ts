import { PlayerSession } from "../../types";

export const saveSession = (session: PlayerSession): PlayerSession => {
  localStorage.setItem("playerId", session.id);
  localStorage.setItem("signature", session.signature);
  localStorage.setItem("name", session.name);
  return session;
};

export const getSession = (): PlayerSession | null => {
  const playerId = localStorage.getItem("playerId");
  const signature = localStorage.getItem("signature");
  const name = localStorage.getItem("name");

  if (!playerId || !signature || !name) return null;
  return { id: playerId, signature, name };
};
export const logout = (): void => {
  localStorage.clear();
};
