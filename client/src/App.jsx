import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
// import { GameProvider } from "./game/store";
import MainMenu from "./modes/menu/MainMenu";
import BlockyPG from "./modes/blockypg/BlockyPG";
import FreeplayDom from "./modes/freeplay/FreeplayDom";
import GateTier from "./modes/gatetier/GateTier";
import "./index.css";

function Nav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  return (
    <nav className="topnav">
      <button
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">Meny</span>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
        </svg>
      </button>

      <div
        id="nav-links"
        className="nav-links"
        data-open={open ? "true" : "false"}
      >
        <NavLink to="/blockypg">BlockyPG</NavLink>
        <NavLink to="/freeplay">Freeplay</NavLink>
        {/* <NavLink to="/gate-tier">Gate Tier</NavLink> */}
      </div>

      <div
        className="nav-overlay"
        hidden={!open}
        onClick={() => setOpen(false)}
      />
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <div className="view">
        <Routes>
          <Route path="/" element={<Navigate to="/blockypg" replace />} />
          <Route path="/blockypg" element={<BlockyPG />} />
          <Route path="/freeplay" element={<FreeplayDom />} />
          {/* <Route path="/gate-tier" element={<GateTier />} /> */}
          <Route path="*" element={<Navigate to="/blockypg" replace />} />
        </Routes>
      </div>
    </>
  );
}
