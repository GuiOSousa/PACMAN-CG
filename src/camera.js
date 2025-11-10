import { M4 } from "./tools/m4.js";

export default class Camera {
  constructor() {
    this.pos = [0, 1.2, 4];
    this.yaw = 0;
    this.speed = 3.0;
  }

  getViewMatrix() {
    const eye = this.pos;
    const center = [eye[0] + Math.sin(this.yaw), eye[1], eye[2] - Math.cos(this.yaw)];
    return M4.lookAt(eye, center, [0, 1, 0]);
  }

  handleInput(keys, dt) {
    const sinY = Math.sin(this.yaw), cosY = Math.cos(this.yaw);
    const forward = [sinY, 0, -cosY];
    const right = [cosY, 0, sinY];
    let move = [0, 0, 0];

    if (keys["w"]) { move[0] += forward[0]; move[2] += forward[2]; }
    if (keys["s"]) { move[0] -= forward[0]; move[2] -= forward[2]; }
    if (keys["a"]) { move[0] -= right[0]; move[2] -= right[2]; }
    if (keys["d"]) { move[0] += right[0]; move[2] += right[2]; }

    const len = Math.hypot(move[0], move[2]);
    if (len > 0.0001) {
      move[0] /= len;
      move[2] /= len;
      this.pos[0] += move[0] * this.speed * dt;
      this.pos[2] += move[2] * this.speed * dt;
    }

    if (keys[" "]) this.pos[1] += this.speed * dt;
    if (keys["shift"]) this.pos[1] -= this.speed * dt;
  }

  getDirection() {
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    let dir = [sinY, 0, -cosY];
    const len = Math.hypot(dir[0], dir[2]);
    dir[0] /= len;
    dir[2] /= len;
    return dir;
  }
}
