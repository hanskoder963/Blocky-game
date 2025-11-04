import { useEffect, useRef, useState } from "react";
import "./freeplay.css";
import InventoryPanel from "../../ui/InventoryPanel";

export default function FreeplayDom() {
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const playerRef = useRef(null);
  const [invOpen, setInvOpen] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    const player = playerRef.current;

    const WORLD = { w: 3000, h: 3000 }; //map size
    world.style.setProperty("--world-w", `${WORLD.w}px`);
    world.style.setProperty("--world-h", `${WORLD.h}px`);

    const SPEED = 260; // px/s
    const size = player.offsetWidth || 40;

    let x = WORLD.w / 2;
    let y = WORLD.h / 2;
    let camX = 0,
      camY = 0;
    let raf = 0;
    const keys = new Set();
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function setPlayerPos() {
      player.style.left = `${x}px`;
      player.style.top = `${y}px`;
    }

    function updateCamera() {
      const vw = stage.clientWidth,
        vh = stage.clientHeight;
      camX = clamp(x - vw / 2, 0, WORLD.w - vw);
      camY = clamp(y - vh / 2, 0, WORLD.h - vh);
      world.style.transform = `translate(${-camX}px, ${-camY}px)`;
    }

    //spawn enemies
    const ENEMIES = 40;
    const enemies = [];
    for (let i = 0; i < ENEMIES; i++) {
      const ex = Math.random() * (WORLD.w - 40);
      const ey = Math.random() * (WORLD.h - 40);
      const el = document.createElement("div");
      el.className = "enemy";
      el.style.left = `${ex}px`;
      el.style.top = `${ey}px`;
      world.appendChild(el);
      enemies.push({ x: ex, y: ey, el });
    }

    function cullEnemies() {
      const vw = stage.clientWidth,
        vh = stage.clientHeight,
        pad = 64;
      enemies.forEach((e) => {
        const vis =
          e.x > camX - pad &&
          e.x < camX + vw + pad &&
          e.y > camY - pad &&
          e.y < camY + vh + pad;
        e.el.hidden = !vis;
      });
    }

    function handleKey(e, down) {
      const k = e.key.toLowerCase();
      if (
        [
          "arrowleft",
          "arrowright",
          "arrowup",
          "arrowdown",
          "a",
          "d",
          "w",
          "s",
        ].includes(k)
      ) {
        e.preventDefault();
        down ? keys.add(k) : keys.delete(k);
      }
    }
    const onKeyDown = (e) => handleKey(e, true);
    const onKeyUp = (e) => handleKey(e, false);

    let last = performance.now();
    function loop(now) {
      const dt = (now - last) / 1000;
      last = now;

      let dx = 0,
        dy = 0;
      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;

      if (dx || dy) {
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        x = clamp(x + dx * SPEED * dt, 0, WORLD.w - size);
        y = clamp(y + dy * SPEED * dt, 0, WORLD.h - size);
        setPlayerPos();
        updateCamera();
        cullEnemies();
      }
      raf = requestAnimationFrame(loop);
    }

    function onClick(e) {
      const r = stage.getBoundingClientRect();
      const worldX = camX + (e.clientX - r.left);
      const worldY = camY + (e.clientY - r.top);
      x = clamp(worldX - size / 2, 0, WORLD.w - size);
      y = clamp(worldY - size / 2, 0, WORLD.h - size);
      setPlayerPos();
      updateCamera();
      cullEnemies();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", () => {
      updateCamera();
      cullEnemies();
    });
    stage.addEventListener("click", onClick);

    setPlayerPos();
    updateCamera();
    cullEnemies();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      stage.removeEventListener("click", onClick);
      enemies.forEach((e) => e.el.remove());
    };
  }, []);

  return (
    <div className="view">
      <main className="wrap">
        <h1>Freeplay</h1>
        <div className="stage" ref={stageRef}>
          <div className="world" ref={worldRef}>
            <div className="player" ref={playerRef} />
          </div>
        </div>

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

      {/* Inventory – desktop: høyre fast | mobil: bottom sheet */}
      <InventoryPanel id="inventory-panel" open={invOpen} />
      <div
        className="inv-mobile-overlay"
        hidden={!invOpen}
        onClick={() => setInvOpen(false)}
      />
    </div>
  );
}
