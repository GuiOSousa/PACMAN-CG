import { M4 } from "../tools/m4.js";

export default class Camera {
	constructor() {
		this.pos = [0, 1.2, 4];
		this.yaw = 0;
		this.speed = 3.0;
	}

	getViewMatrix() {
		const eye = this.pos;
		const center = [eye[0] + Math.sin(this.yaw), eye[1], eye[2] - Math.cos(this.yaw)];
		return M4.setViewingMatrix(eye, center, [0, 1, 0]);
	}
	
	setPosition(p) {
		this.pos = p
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
