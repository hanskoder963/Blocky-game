import { useEffect, useRef, useState } from "react";
import "./blockypg.css";
import { startPG } from "./start";
import InventoryPanel from "../../ui/InventoryPanel";

export default function BlockyPG() {
  const boardRef = useRef(null);
  const playerRef = useRef(null);
  const overlayRef = useRef(null);
  const nextBtnRef = useRef(null);
  const [invOpen, setInvOpen] = useState(false); // <- ny

  useEffect(() => {
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

        {/* Mobil: backpack-knapp nederst */}
        <button
          type="button"
          className="backpack-btn"
          aria-expanded={invOpen}
          aria-controls="inventory-panel"
          onClick={() => setInvOpen((o) => !o)}
        >
          <span aria-hidden="true">🎒</span>
          <span className="label">Inventory</span>
        </button>
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

      {/* Inventory – alltid synlig på desktop, “bottom sheet” på mobil */}
      <InventoryPanel id="inventory-panel" open={invOpen} />
      <div
        className="inv-mobile-overlay"
        hidden={!invOpen}
        onClick={() => setInvOpen(false)}
      />
    </div>
  );
}
