export function initDomFreeplay(stageEl, playerEl) {
  const state = { step: 24, x: 0, y: 0, w: 0, h: 0 };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const applyPosition = () => {
    playerEl.style.left = `${state.x}px`;
    playerEl.style.top = `${state.y}px`;
  };

  playerEl.style.transform = "none";
  let rect = playerEl.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    playerEl.style.width = "64px";
    playerEl.style.height = "64px";
    rect = playerEl.getBoundingClientRect();
  }
  state.w = rect.width;
  state.h = rect.height;

  state.x = Math.floor((stageEl.clientWidth - state.w) / 2);
  state.y = Math.floor((stageEl.clientHeight - state.h) / 2);
  applyPosition();

  const held = new Set();
  const isMoveKey = (k) =>
    [
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "w",
      "a",
      "s",
      "d",
    ].includes(k.toLowerCase());

  function move(dx, dy) {
    const maxX = stageEl.clientWidth - state.w;
    const maxY = stageEl.clientHeight - state.h;
    state.x = clamp(state.x + dx, 0, maxX);
    state.y = clamp(state.y + dy, 0, maxY);
    applyPosition();
  }

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

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  const clickHandler = (e) => {
    if (e.target === playerEl) return;
    const r = stageEl.getBoundingClientRect();
    const clickX = e.clientX - r.left - state.w / 2;
    const clickY = e.clientY - r.top - state.h / 2;
    const maxX = stageEl.clientWidth - state.w;
    const maxY = stageEl.clientHeight - state.h;
    state.x = clamp(clickX, 0, maxX);
    state.y = clamp(clickY, 0, maxY);
    applyPosition();
  };
  stageEl.addEventListener("click", clickHandler);

  const onResize = () => {
    const maxX = stageEl.clientWidth - state.w;
    const maxY = stageEl.clientHeight - state.h;
    state.x = clamp(state.x, 0, maxX);
    state.y = clamp(state.y, 0, maxY);
    applyPosition();
  };
  window.addEventListener("resize", onResize);

  const interval = setInterval(stepFromHeld, 90);

  return () => {
    clearInterval(interval);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    stageEl.removeEventListener("click", clickHandler);
    window.removeEventListener("resize", onResize);
  };
}
