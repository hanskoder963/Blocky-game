import { Link } from "react-router-dom";
import "./menu.css";
import { useGame } from "../../game/store";

export default function MainMenu() {
  const { coins, inventory } = useGame();
  return (
    <main className="menu-wrap">
      <h1>Blocky</h1>
      <div className="menu-cards">
        <Link className="card" to="/blockypg">
          Play (BlockyPG)
        </Link>
        <Link className="card" to="/freeplay">
          Freeplay
        </Link>
        <button className="card" disabled>
          Shop (soon)
        </button>
        <button className="card" disabled>
          Inventory ({inventory.length})
        </button>
      </div>
      <p className="meta">Coins: {coins}</p>
    </main>
  );
}
