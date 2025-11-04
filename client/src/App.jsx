import { Link, Routes, Route, Navigate } from "react-router-dom";
import FreeplayDom from "./modes/freeplay/FreeplayDom";
import BlockyPG from "./modes/blockypg/BlockyPG";
import GateTier from "./modes/gatetier/GateTier";
import "./index.css";

function Nav() {
  return (
    <nav className="topnav">
      <Link to="/freeplay">Freeplay</Link>
      <Link to="/blockypg">BlockyPG</Link>
      <Link to="/gate-tier">Gate Tier</Link>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/freeplay" replace />} />
        <Route path="/freeplay" element={<FreeplayDom />} />
        <Route path="/blockypg" element={<BlockyPG />} />
        <Route path="/gate-tier" element={<GateTier />} />
        <Route path="*" element={<Navigate to="/freeplay" replace />} />
      </Routes>
    </>
  );
}
