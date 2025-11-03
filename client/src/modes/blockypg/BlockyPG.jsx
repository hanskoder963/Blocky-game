import { useEffect, useRef } from "react";
import { startPG } from "./start";
import "./blockypg.css"; // din gamle CSS er allerede her

export default function BlockyPG() {
  const boardRef = useRef(null);
  const playerRef = useRef(null);
  const startRef = useRef(null);
  const goalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current) return;
    const stop = startPG({
      board: boardRef.current,
      player: playerRef.current,
      start: startRef.current,
      goal: goalRef.current,
      overlay: overlayRef.current,
    });
    return stop;
  }, []);

  return (
    <div className="view">
      <div className="wrap">
        <h1>BlockPG</h1>
        <div className="board" ref={boardRef} style={{ "--cell": "64px" }}>
          <div className="start" ref={startRef} />
          <div className="goal" ref={goalRef} />
          <div className="player-grid" ref={playerRef} />
        </div>
        <div className="hint">WASD / Piltaster for å flytte. Nå mål-ruta.</div>
      </div>

      <div className="overlay hidden" ref={overlayRef}>
        <div className="modal">
          <h2>Level clear!</h2>
          <button
            className="btn"
            onClick={() => overlayRef.current?.classList.add("hidden")}
          >
            Spill videre
          </button>
        </div>
      </div>
    </div>
  );
}
