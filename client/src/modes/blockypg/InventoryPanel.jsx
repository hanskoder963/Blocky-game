import { useGame } from "../../game/store.jsx";
import "./inv.css";

const COLS = 4;
const ROWS = 5; // 20 slots
const SLOTS = COLS * ROWS;

export default function InventoryPanel() {
  const { coins, inventory } = useGame();

  // Fyll slots fra inventory-lista (enkelt – første N items). Tomme slots blir null.
  const slots = Array.from({ length: SLOTS }, (_, i) => inventory[i] ?? null);

  return (
    <aside className="inv-panel" aria-label="Inventory">
      <header className="inv-head">
        <span>Inventory</span>
        <span className="inv-coins">Coins: {coins}</span>
      </header>

      <ul className="inv-grid" role="list">
        {slots.map((it, i) => (
          <li key={i} className={it ? "inv-slot has-item" : "inv-slot"}>
            {it ? (
              <div className="inv-item" title={`${it.name} x${it.qty}`}>
                <span className="inv-icon">
                  {it.name?.[0]?.toUpperCase() || "?"}
                </span>
                <span className="inv-qty">x{it.qty}</span>
              </div>
            ) : (
              <div className="inv-empty" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
