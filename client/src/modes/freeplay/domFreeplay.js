export function initDomFreeplay(stage, player) {
  const state = { step: 24, x: 0, y: 0, w: 0, h: 0 };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const applyPosition = () => {
    player.style.left = `${state.x}px`;
    player.style.top = `${state.y}px`;
  };

  // init (som i app.js)
  player.style.transform = "none";
  let rect = player.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    player.style.width = "64px";
    player.style.height = "64px";
    rect = player.getBoundingClientRect();
  }
  state.w = rect.width;
  state.h = rect.height;
  state.x = Math.floor((stage.clientWidth - state.w) / 2);
  state.y = Math.floor((stage.clientHeight - state.h) / 2);
  applyPosition();

  function move(dx, dy) {
    const maxX = stage.clientWidth - state.w;
    const maxY = stage.clientHeight - state.h;
    state.x = clamp(state.x + dx, 0, maxX);
    state.y = clamp(state.y + dy, 0, maxY);
    applyPosition();
  }
  function isMoveKey(k) {
    const key = k.toLowerCase();
    return [
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "w",
      "a",
      "s",
      "d",
    ].includes(key);
  }

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

  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (!isMoveKey(k)) return;
    e.preventDefault();
    held.add(k);
  };
  const onKeyUp = (e) => {
    held.delete(e.key.toLowerCase());
  };

  const onClick = (e) => {
    if (e.target === player) return;
    const r = stage.getBoundingClientRect();
    const clickX = e.clientX - r.left - state.w / 2;
    const clickY = e.clientY - r.top - state.h / 2;
    const maxX = stage.clientWidth - state.w;
    const maxY = stage.clientHeight - state.h;
    state.x = clamp(clickX, 0, maxX);
    state.y = clamp(clickY, 0, maxY);
    applyPosition();
  };

  const onResize = () => {
    const maxX = stage.clientWidth - state.w;
    const maxY = stage.clientHeight - state.h;
    state.x = clamp(state.x, 0, maxX);
    state.y = clamp(state.y, 0, maxY);
    applyPosition();
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  stage.addEventListener("click", onClick);
  window.addEventListener("resize", onResize);
  const interval = setInterval(stepFromHeld, 90);

  return () => {
    clearInterval(interval);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    stage.removeEventListener("click", onClick);
    window.removeEventListener("resize", onResize);
  };
}
