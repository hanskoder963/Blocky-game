export function startPG(canvas) {
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight - 48;
  }
  addEventListener("resize", resize);
  resize();

  let t0 = performance.now(),
    raf = 0,
    x = 40,
    vx = 120;
  function loop(t) {
    const dt = Math.min(0.033, (t - t0) / 1000);
    t0 = t;
    x += vx * dt;
    if (x < 20 || x > canvas.width - 20) vx *= -1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(x - 20, canvas.height / 2 - 20, 40, 40);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
  };
}
