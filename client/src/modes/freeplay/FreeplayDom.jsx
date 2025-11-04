import { useEffect, useRef } from "react";
import { initDomFreeplay } from "./domFreeplay";
import "./freeplay.css";
import InventoryPanel from "../../ui/InventoryPanel";

export default function FreeplayDom() {
  const stageRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!stageRef.current || !playerRef.current) return;
    const stop = initDomFreeplay(stageRef.current, playerRef.current);
    return stop;
  }, []);

  return (
    <div className="view">
      <main className="wrap">
        <h1>Freeplay</h1>
        <div className="game-row">
          <div className="stage" ref={stageRef}>
            <div className="player" ref={playerRef} />
            <div className="hud">WASD / Piltaster · Klikk for å flytte</div>
          </div>
        </div>
      </main>
      <InventoryPanel />
    </div>
  );
}
