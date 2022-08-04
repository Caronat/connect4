import { prevent } from "../../func/dom";

type DrawProps = {
  onRestart?: () => void;
};

const Draw = ({ onRestart }: DrawProps) => {
  return (
    <div className="flex" style={{ justifyContent: "space-between" }}>
      <h2>Belle bataille mais pas de vainqueur !</h2>
      <button className="button" onClick={prevent(onRestart)}>
        Rejouer
      </button>
    </div>
  );
};

export default Draw;
