<script>
const plug = document.getElementById("plug");
const socket = document.getElementById("socket");
const path = document.getElementById("wirePath");
const bulb = document.getElementById("bulb");
const gameArea = document.querySelector(".game-area");

let dragging = false;
let connected = false;

// starting point (fixed)
const startX = 60;
const startY = 210;

// current mouse position
let mouseX = startX;
let mouseY = startY;

// wire points
let points = [
  { x: startX, y: startY },
  { x: 120, y: 230 },
  { x: 200, y: 240 },
  { x: 280, y: 200 },
  { x: startX, y: startY }
];

// UPDATE WIRE
function updateWire() {
  // last point follows mouse
  points[points.length - 1].x = mouseX;
  points[points.length - 1].y = mouseY;

  // lag effect (loose wire)
  for (let i = points.length - 2; i > 0; i--) {
    points[i].x += (points[i + 1].x - points[i].x) * 0.2;
    points[i].y += (points[i + 1].y - points[i].y) * 0.2 + 0.5;
  }

  // draw smooth curve
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    let midX = (points[i].x + points[i + 1].x) / 2;
    let midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
  }

  path.setAttribute("d", d);
}

// ANIMATION LOOP (this is critical)
function animate() {
  updateWire();
  requestAnimationFrame(animate);
}
animate();

// DRAG START
plug.addEventListener("mousedown", () => {
  dragging = true;
  plug.style.cursor = "grabbing";
});

// DRAG MOVE
window.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  const rect = gameArea.getBoundingClientRect();

  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  plug.style.left = mouseX + "px";
  plug.style.top = mouseY + "px";

  // SNAP CHECK
  const socketRect = socket.getBoundingClientRect();

  if (
    e.clientX > socketRect.left &&
    e.clientX < socketRect.right &&
    e.clientY > socketRect.top &&
    e.clientY < socketRect.bottom
  ) {
    connected = true;

    const snapX = socket.offsetLeft + 12;
    const snapY = socket.offsetTop + 12;

    mouseX = snapX;
    mouseY = snapY;

    plug.style.left = snapX + "px";
    plug.style.top = snapY + "px";
  }
});

// DRAG END
window.addEventListener("mouseup", () => {
  dragging = false;
  plug.style.cursor = "grab";
});

// SWITCH
document.getElementById("switch").addEventListener("click", () => {
  if (connected) {
    bulb.classList.add("on");
  } else {
    alert("Connect the wire first!");
  }
});
</script>