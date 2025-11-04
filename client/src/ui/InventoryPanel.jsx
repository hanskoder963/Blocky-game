import { useState } from "react";
import "./inventory.css";

const TABS = [
  { id: "weapons", label: "Weapons", icon: "⚔️" },
  { id: "armor", label: "Armor", icon: "🛡️" },
  { id: "gems", label: "Gems", icon: "💎" },
  { id: "potions", label: "Potions", icon: "🧪" },
  { id: "keys", label: "Keys", icon: "🔑" },
];

export default function InventoryPanel({ open = false, id }) {
  const [tab, setTab] = useState(TABS[0].id);
  const slots = Array.from({ length: 36 }, () => null);

  return (
    <aside id={id} className="inv-panel" data-open={open ? "true" : "false"}>
      <div className="inv-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`inv-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
            title={t.label}
            aria-pressed={tab === t.id}
          >
            <span className="icon">{t.icon}</span>
          </button>
        ))}
      </div>

      <div className="inv-grid">
        {slots.map((_, i) => (
          <div key={i} className="inv-cell" />
        ))}
      </div>
    </aside>
  );
}
