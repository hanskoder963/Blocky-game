export function startPG({ board, player, start, goal, overlay }) {
  // Konfig
  const cell =
    parseInt(getComputedStyle(board).getPropertyValue("--cell")) || 64;

  // Størrelse (kvadratisk brett)
  function sizeBoard() {
    const s = Math.min(
      board.clientWidth,
      board.clientHeight || board.clientWidth
    );
    const cols = Math.max(3, Math.floor(s / cell));
    const rows = cols;
    return { cols, rows };
  }

  // Plasser en rute (px)
  function place(el, cx, cy) {
    if (!el) return;
    el.style.width = `${cell}px`;
    el.style.height = `${cell}px`;
    el.style.left = `${cx * cell}px`;
    el.style.top = `${cy * cell}px`;
  }

  // State
  let cols = 0,
    rows = 0;
  let px = 0,
    py = 0; // player grid pos
  let sx = 0,
    sy = 0; // start pos
  let gx = 0,
    gy = 0; // goal pos

  function layout() {
    const b = board.getBoundingClientRect();
    const dims = sizeBoard();
    cols = dims.cols;
    rows = dims.rows;

    // Sett absolutt posisjon/size slik at brettet er kvadratisk
    const sizePx = cols * cell;
    board.style.position = "relative";
    board.style.width = `${sizePx}px`;
    board.style.height = `${sizePx}px`;

    // Start/goal i hjørner
    sx = 0;
    sy = rows - 1;
    gx = cols - 1;
    gy = 0;

    // Hvis player er utenfor, sett til start
    if (px < 0 || py < 0 || px >= cols || py >= rows) {
      px = sx;
      py = sy;
    }

    place(start, sx, sy);
    place(goal, gx, gy);
    place(player, px, py);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  const keys = new Set();
  function stepFromHeld() {
    let dx = 0,
      dy = 0;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;
    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (!dx && !dy) return;

    const npx = clamp(px + dx, 0, cols - 1);
    const npy = clamp(py + dy, 0, rows - 1);
    if (npx !== px || npy !== py) {
      px = npx;
      py = npy;
      place(player, px, py);
      // Sjekk mål
      if (px === gx && py === gy && overlay) {
        overlay.classList.remove("hidden");
        // Reset til start for demo
        setTimeout(() => {
          overlay.classList.add("hidden");
          px = sx;
          py = sy;
          place(player, px, py);
        }, 800);
      }
    }
  }

  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (
      ![
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
      ].includes(k)
    )
      return;
    e.preventDefault();
    // Bare ett steg per keydown for grid-følelse
    if (!keys.has(k)) {
      keys.add(k);
      stepFromHeld();
    }
  };
  const onKeyUp = (e) => {
    keys.delete(e.key.toLowerCase());
  };

  const onResize = () => layout();

  // Init
  layout();
  window.addEventListener("resize", onResize);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("resize", onResize);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  };
}
