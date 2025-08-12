// app.js
const stage = document.getElementById("stage");
const player = document.getElementById("player");

const state = {
  step: 24, // px per steg
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const applyPosition = () => {
  player.style.left = `${state.x}px`;
  player.style.top = `${state.y}px`;
};

window.addEventListener("load", () => {
  // Dropp eventuell CSS-centering (transform) så left/top styrer alt
  player.style.transform = "none";

  // Sikre at spilleren har størrelse (i tilfelle CSS ikke lastet)
  let rect = player.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    player.style.width = "64px";
    player.style.height = "64px";
    rect = player.getBoundingClientRect();
  }

  state.w = rect.width;
  state.h = rect.height;

  // Start midt i STAGE (ikke vinduet)
  state.x = Math.floor((stage.clientWidth - state.w) / 2);
  state.y = Math.floor((stage.clientHeight - state.h) / 2);
  applyPosition();
});

/* ---------------------------
   Bevegelse og input
---------------------------- */
function move(dx, dy) {
  const maxX = stage.clientWidth - state.w;
  const maxY = stage.clientHeight - state.h;
  state.x = clamp(state.x + dx, 0, maxX);
  state.y = clamp(state.y + dy, 0, maxY);
  applyPosition();
}

function isMoveKey(k) {
  const key = k.toLowerCase();
  return (
    key === "arrowup" ||
    key === "arrowdown" ||
    key === "arrowleft" ||
    key === "arrowright" ||
    key === "w" ||
    key === "a" ||
    key === "s" ||
    key === "d"
  );
}

// Hold-inn-støtte (WASD + piltaster)
const held = new Set();

function stepFromHeld() {
  let dx = 0,
    dy = 0;
  if (held.has("arrowup") || held.has("w")) dy -= state.step;
  if (held.has("arrowdown") || held.has("s")) dy += state.step;
  if (held.has("arrowleft") || held.has("a")) dx -= state.step;
  if (held.has("arrowright") || held.has("d")) dx += state.step;
  if (dx || dy) move(dx, dy);
}

document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (!isMoveKey(k)) return;
  e.preventDefault(); // unngå scroll
  held.add(k);
});

document.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  held.delete(k);
});

// Flytt med jevne mellomrom mens taster holdes inne
// (juster 90 for raskere/saktere repetering)
setInterval(stepFromHeld, 90);

/* ---------------------------
   Klikk for å posisjonere
---------------------------- */
stage.addEventListener("click", (e) => {
  if (e.target === player) return;

  const r = stage.getBoundingClientRect();
  const clickX = e.clientX - r.left - state.w / 2;
  const clickY = e.clientY - r.top - state.h / 2;

  const maxX = stage.clientWidth - state.w;
  const maxY = stage.clientHeight - state.h;

  state.x = clamp(clickX, 0, maxX);
  state.y = clamp(clickY, 0, maxY);
  applyPosition();
});

/* ---------------------------
   Hold synlig ved resize
---------------------------- */
window.addEventListener("resize", () => {
  const maxX = stage.clientWidth - state.w;
  const maxY = stage.clientHeight - state.h;
  state.x = clamp(state.x, 0, maxX);
  state.y = clamp(state.y, 0, maxY);
  applyPosition();
});
