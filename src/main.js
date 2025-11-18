import Cube from "./objects/cube.js";
import Wall from "./objects/wall.js";
import Scene from "./scene.js";
import Map from "./map.js";
import Enemy from "./entities/enemy1.js";

const canvas = document.getElementById("c");
const gl = canvas.getContext("webgl", { antialias: true });
if (!gl) throw new Error("WebGL não suportado");

function resize() {
  const w = canvas.clientWidth | 0;
  const h = canvas.clientHeight | 0;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
}
new ResizeObserver(resize).observe(canvas);
resize();

const scene = new Scene(gl);
scene.addObject(new Cube(gl, [0, 0, 0]));
scene.addObject(new Cube(gl, [2, 0, -2]));
scene.addObject(new Cube(gl, [-2, 0, -2]));
scene.addObject(new Cube(gl, [-3, 1, -3]));
scene.addObject(new Wall(gl, [-4, 0, -4]));

scene.addEntity(new Enemy(gl, [42, 0, -36], scene))

const map = Map;
map.setScene(scene)
map.loadFromImage("src/assets/map.png", 1);

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.04);
  last = now;

  scene.player.update(dt);
  scene.render(dt);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
