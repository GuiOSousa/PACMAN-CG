import Camera from "./camera.js";

export default class Player {
  constructor() {
    this.camera = new Camera();
    this.keys = {};
    this._setupInput();
  }

  _setupInput() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;

      // Resetar posição
      if (e.key === "r" || e.key === "R") {
        this.camera.pos = [0, 1.2, 4];
        this.camera.yaw = 0;
      }

      // Rotação da câmera
      if (e.key === "ArrowLeft") this.camera.yaw -= 0.12;
      if (e.key === "ArrowRight") this.camera.yaw += 0.12;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    window.addEventListener("blur", () => {
      for (let k in this.keys) this.keys[k] = false;
    });
  }

  update(dt) {
    this.camera.handleInput(this.keys, dt);
  }
}
