export function startPG({ board, player, overlay, nextBtn }) {
  const CELLS = 11;
  const PADDING = 4;

  const GAIN_FACTOR = 1;
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const gainFrom = (val) => Math.max(1, Math.floor(val * GAIN_FACTOR));

  const start = { row: CELLS - 1, col: Math.floor(CELLS / 2) };
  const goal = { row: 0, col: Math.floor(CELLS / 2) };

  // Player Power and wave
  let wave = 1;
  let power = 5; //start value
  const state = { cell: 0, row: start.row, col: start.col, modalOpen: false };

  let startEl = null,
    goalEl = null;
  const enemies = []; //{row,col,val,el}
  let enemyTimer = 0;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const sizePx = () => Math.max(8, state.cell - PADDING * 2);

  function layout() {
    let rect = board.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      const size = Math.floor(
        Math.min(window.innerWidth, window.innerHeight) * 0.92
      );
      board.style.width = size + "px";
      board.style.height = size + "px";
      rect = board.getBoundingClientRect();
    }

    state.cell = Math.floor(Math.min(rect.width, rect.height) / CELLS);
    board.style.setProperty("--cell", `${state.cell}px`);

    const s = sizePx();
    player.style.width = s + "px";
    player.style.height = s + "px";

    renderStart();
    renderGoal();
    applyPlayer();
    enemies.forEach(placeEnemy);
  }

  //-------------------//

  function renderStart() {
    if (!startEl) {
      startEl = document.createElement("div");
      startEl.className = "start";
      board.appendChild(startEl);
    }
    Object.assign(startEl.style, {
      left: start.col * state.cell + "px",
      top: start.row * state.cell + "px",
      width: state.cell + "px",
      height: state.cell + "px",
    });
  }

  function renderGoal() {
    if (!goalEl) {
      goalEl = document.createElement("div");
      goalEl.className = "goal";
      board.appendChild(goalEl);
    }
    Object.assign(goalEl.style, {
      left: goal.col * state.cell + "px",
      top: goal.row * state.cell + "px",
      width: state.cell + "px",
      height: state.cell + "px",
    });
  }

  function setPlayerLabel() {
    player.textContent = String(power);
  }

  function applyPlayer() {
    const left = state.col * state.cell + PADDING;
    const top = state.row * state.cell + PADDING;
    player.style.left = `${left}px`;
    player.style.top = `${top}px`;
    setPlayerLabel();
    checkWin();
    checkEnemyCollision();
  }

  function checkWin() {
    if (
      state.row === goal.row &&
      state.col === goal.col &&
      enemies.length === 0
    ) {
      openModal();
    }
  }

  function moveBy(dr, dc) {
    if (state.modalOpen) return;
    state.row = clamp(state.row + dr, 0, CELLS - 1);
    state.col = clamp(state.col + dc, 0, CELLS - 1);
    applyPlayer();
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

  function handleKey(e) {
    if (!isMoveKey(e.key)) return;
    if (state.modalOpen) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const k = e.key.toLowerCase();
    if (k === "arrowup" || k === "w") moveBy(-1, 0);
    else if (k === "arrowdown" || k === "s") moveBy(1, 0);
    else if (k === "arrowleft" || k === "a") moveBy(0, -1);
    else if (k === "arrowright" || k === "d") moveBy(0, 1);
  }

  function handleClick(e) {
    if (state.modalOpen) return;
    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    state.col = clamp(Math.floor(x / state.cell), 0, CELLS - 1);
    state.row = clamp(Math.floor(y / state.cell), 0, CELLS - 1);
    applyPlayer();
  }

  //---- Enemies with numbers ----
  function clearEnemies() {
    while (enemies.length) enemies.pop().el.remove();
  }

  function occupied(r, c) {
    if (r === state.row && c === state.col) return true;
    if (r === start.row && c === start.col) return true;
    if (r === goal.row && c === goal.col) return true;
    return enemies.some((en) => en.row === r && en.col === c);
  }

  function placeEnemy(en) {
    const s = sizePx();
    Object.assign(en.el.style, {
      width: s + "px",
      height: s + "px",
      left: en.col * state.cell + PADDING + "px",
      top: en.row * state.cell + PADDING + "px",
    });
    en.el.textContent = String(en.val);
  }

  function ensureAtLeastOneLower(vals) {
    if (wave <= 10 && !vals.some((v) => v < power)) {
      //Replace random enemy with power - 1 (min 1)
      const i = Math.floor(Math.random() * vals.length);
      vals[i] = Math.max(1, power - 1);
    }
  }

  function rollValues(count) {
    // Values close to player
    const vals = Array.from({ length: count }, () => {
      const delta = Math.floor(Math.random() * 5) - 2; // -2..+2
      return Math.max(1, power + delta + Math.floor(wave / 3));
    });
    ensureAtLeastOneLower(vals);
    return vals;
  }

  function buildChainValues(count) {
    const vals = [];
    let hypot = power;
    for (let i = 0; i < count; i++) {
      let cap = Math.max(1, Math.floor(hypot - 1));
      let min = Math.max(1, Math.floor(cap * 0.5));
      if (min > cap) min = cap;
      const val = rnd(min, cap);
      vals.push(val);
      hypot += gainFrom(val);
    }
    if (!(vals[0] < power)) vals[0] = Math.max(1, power - 1);
    return vals;
  }

  function spawnWave() {
    clearEnemies();
    const count = wave <= 3 ? 3 : 3 + Math.floor(Math.random() * 4); // 3-6)
    const vals = wave <= 3 ? buildChainValues(count) : rollValues(count);
    for (let i = 0; i < count; i++) {
      let r,
        c,
        tries = 0;
      do {
        r = Math.floor(Math.random() * CELLS);
        c = Math.floor(Math.random() * CELLS);
        tries++;
      } while (occupied(r, c) && tries < 200);
      const el = document.createElement("div");
      el.className = "enemy";
      board.appendChild(el);
      const en = { row: r, col: c, val: vals[i], el };
      enemies.push(en);
      placeEnemy(en);
    }
  }

  function consume(en) {
    power += gainFrom(en.val); //growth when consuming
    setPlayerLabel();
    en.el.remove();
    const idx = enemies.indexOf(en);
    if (idx >= 0) enemies.splice(idx, 1);
    player.style.filter = "brigtness(1.15)";
    setTimeout(() => (player.style.filter = ""), 120);
    checkWin();
  }

  function checkEnemyCollision() {
    const en = enemies.find((e) => e.row === state.row && e.col === state.col);
    if (!en) return;
    if (en.val < power) {
      consume(en); // only eat lower number
    } else {
      player.style.filter = "contrast(1.2) saturate(1.4)";
      setTimeout(() => (player.style.filter = ""), 150);
      state.row = start.row;
      state.col = start.col;
      applyPlayer();
    }
  }

  //--- Modal / Waves ----
  function openModal() {
    state.modalOpen = true;
    overlay?.classList.remove("hidden");
    overlay?.setAttribute("aria-hidden", "false");
    nextBtn?.focus?.();
  }
  function closeModal() {
    state.modalOpen = false;
    overlay?.classList.add("hidden");
    overlay?.setAttribute("aria-hidden", "true");
  }
  function nextWave() {
    wave++;
    state.row = start.row;
    state.col = start.col;
    closeModal();
    applyPlayer();
    spawnWave();
  }

  //init + listeners

  layout();
  setPlayerLabel();
  spawnWave();

  const onResize = () => {
    layout();
    enemies.forEach(placeEnemy);
  };
  const onKeyDown = (e) => handleKey(e);
  const onOverlayKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextWave();
    }
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKeyDown);
  board.addEventListener("click", handleClick);
  nextBtn?.addEventListener("click", nextWave);
  overlay?.addEventListener("keydown", onOverlayKey);

  // valgfritt: lett “omrøring” av enemies
  // enemyTimer = setInterval(() => enemies.forEach(placeEnemy), 900);

  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("keydown", onKeyDown);
    board.removeEventListener("click", handleClick);
    nextBtn?.removeEventListener("click", nextWave);
    overlay?.removeEventListener("keydown", onOverlayKey);
    clearInterval(enemyTimer);
    clearEnemies();
  };
}
