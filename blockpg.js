const CELLS = 11; // 9/11/13... (oddetall gir midtcelle)
const PADDING = 4;

const board = document.getElementById("board");
const player = document.getElementById("playerGrid");
const overlay = document.getElementById("levelModal");
const nextBtn = document.getElementById("nextBtn");

const start = { row: CELLS - 1, col: Math.floor(CELLS / 2) }; // nederst midt
const goal = { row: 0, col: Math.floor(CELLS / 2) }; // øverst midt

const state = {
  cell: 0,
  row: start.row,
  col: start.col,
  modalOpen: false,
};

let startEl = null;
let goalEl = null;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function layout() {
  let rect = board.getBoundingClientRect();

  // hvis CSS ikke rakk å sette størrelse, fiks en egen
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

  // spillerstørrelse
  const s = Math.max(8, state.cell - PADDING * 2);
  player.style.width = s + "px";
  player.style.height = s + "px";

  renderStart();
  renderGoal();
  applyPlayer();
}

function renderStart() {
  if (!startEl) {
    startEl = document.createElement("div");
    startEl.className = "start";
    board.appendChild(startEl);
  }
  // fyll hele cellen
  startEl.style.left = start.col * state.cell + "px";
  startEl.style.top = start.row * state.cell + "px";
  startEl.style.width = state.cell + "px";
  startEl.style.height = state.cell + "px";
}

function renderGoal() {
  if (!goalEl) {
    goalEl = document.createElement("div");
    goalEl.className = "goal";
    board.appendChild(goalEl);
  }
  goalEl.style.left = goal.col * state.cell + "px";
  goalEl.style.top = goal.row * state.cell + "px";
  goalEl.style.width = state.cell + "px";
  goalEl.style.height = state.cell + "px";
}

function applyPlayer() {
  const left = state.col * state.cell + PADDING;
  const top = state.row * state.cell + PADDING;
  player.style.left = `${left}px`;
  player.style.top = `${top}px`;
  checkWin();
}

function moveBy(dr, dc) {
  if (state.modalOpen) return; // lås input når modal er åpen
  state.row = clamp(state.row + dr, 0, CELLS - 1);
  state.col = clamp(state.col + dc, 0, CELLS - 1);
  applyPlayer();
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
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = clamp(Math.floor(x / state.cell), 0, CELLS - 1);
  const row = clamp(Math.floor(y / state.cell), 0, CELLS - 1);
  state.col = col;
  state.row = row;
  applyPlayer();
}

function checkWin() {
  if (state.row === goal.row && state.col === goal.col) {
    openModal();
  }
}

/* -------- Modal -------- */
function openModal() {
  state.modalOpen = true;
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  nextBtn?.focus?.();
}

function closeModal() {
  state.modalOpen = false;
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function resetLevel() {
  // restart tomt brett – settes enkelt opp for å utvide senere
  state.row = start.row;
  state.col = start.col;
  applyPlayer();
  closeModal();
}

/* Init */
window.addEventListener("DOMContentLoaded", () => {
  layout();
  window.addEventListener("resize", layout);
  window.addEventListener("keydown", handleKey);
  board.addEventListener("click", handleClick);
  nextBtn.addEventListener("click", resetLevel);
  // valgfritt: Enter aktiverer "Next level" når modal er åpen
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      resetLevel();
    }
  });
});
