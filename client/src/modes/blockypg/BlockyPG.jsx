import { useEffect, useRef } from "react";
import { startPG } from "./start";
import "./blockypg.css";

export default function BlockyPG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const stop = startPG(canvasRef.current);
    return stop;
  }, []);

  return (
    <div className="view">
      <canvas ref={canvasRef} className="pg-canvas" />
    </div>
  );
}
