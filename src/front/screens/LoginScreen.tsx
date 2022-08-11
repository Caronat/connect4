import { uid } from "../../func/uid";
import { QueryParams } from "../../types";
import NameSelector from "../components/NameSelector";
import { saveSession } from "../func/session";
import { updateQueryParams, urlSearchParams } from "../func/url";
import { useGame } from "../hooks/useGame";

type LoginScreenProps = {};

const LoginScreen = ({}: LoginScreenProps) => {
  const { connect } = useGame();
  const handleLogin = async (name: string) => {
    const response = await fetch("/api/players", { method: "POST" }).then((r) =>
      r.json()
    );

    const player = saveSession({
      ...response,
      name,
    });
    const gameId = urlSearchParams().get(QueryParams.GAMEID) ?? uid();
    connect(player, gameId);
    updateQueryParams({ [QueryParams.GAMEID]: gameId });
  };

  return (
    <div>
      <NameSelector onSelect={handleLogin} />
    </div>
  );
};

export default LoginScreen;
