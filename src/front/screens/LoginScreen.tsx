import NameSelector from "../components/NameSelector";
import { saveSession } from "../func/session";

type LoginScreenProps = {};

const LoginScreen = ({}: LoginScreenProps) => {
  const handleLogin = async (name: string) => {
    const response = await fetch("/api/players", { method: "POST" }).then((r) =>
      r.json()
    );

    const player = saveSession({
      ...response,
      name,
    });
  };

  return (
    <div>
      <NameSelector onSelect={handleLogin} />
    </div>
  );
};

export default LoginScreen;
