import { useEffect, useRef } from "react";
import { startPG } from "./start";
import "./blockypg.css";

export default function BlockyPG() {
  const boardRef = useRef(null);
  const playerRef = useRef(null);
  const overlayRef = useRef(null);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current || !playerRef.current) return;
    const stop = startPG({
      board: boardRef.current,
      player: playerRef.current,
      overlay: overlayRef.current,
      nextBtn: nextBtnRef.current,
    });
    return stop;
  }, []);

  return (
    <div className="view">
      <main className="wrap">
        <h1>BlockPG</h1>
        <div className="board" ref={boardRef} aria-label="Spillbrett">
          <div className="player-grid" ref={playerRef} aria-label="Spiller" />
        </div>
        <p className="hint">
          WASD / Piltaster · Klikk på en rute for å hoppe dit
        </p>
      </main>

      <div className="overlay hidden" ref={overlayRef} aria-hidden="true">
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lc-title"
        >
          <h2 id="lc-title">Level cleared! 🎉</h2>
          <button className="btn" ref={nextBtnRef}>
            Next level
          </button>
        </div>
      </div>
    </div>
  );
}
