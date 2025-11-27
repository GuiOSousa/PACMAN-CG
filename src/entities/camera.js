import { M4 } from "../tools/m4.js";

export default class Camera {
	constructor() {
		this.pos = [0, 1.2, 4]
		this.yaw = 0
		this.pitch = 0
		this.speed = 3.0
	}

	getViewMatrix() {
		const cosP = Math.cos(this.pitch);
		const sinP = Math.sin(this.pitch);
		const cosY = Math.cos(this.yaw);
		const sinY = Math.sin(this.yaw);

		const dir = [
			sinY * cosP,
			sinP,
			-cosY * cosP
		];

		const center = [
			this.pos[0] + dir[0],
			this.pos[1] + dir[1],
			this.pos[2] + dir[2]
		];

		if (Number.isNaN(dir[0]) || Number.isNaN(dir[1]) || Number.isNaN(dir[2])) {
			console.error("DIR INVALIDO", { yaw: this.yaw, pitch: this.pitch });
		}


		return M4.setViewingMatrix(this.pos, center, [0, 1, 0]);
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
