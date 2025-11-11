import Camera from "./camera.js";
import Map from "./map.js";

export default class Player {
	constructor() {
		this.camera = new Camera();
		this.pos = [0, 0, 0]
		this.speed = 3.0
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

	handleInput(keys, dt) {
			const sinY = Math.sin(this.yaw), cosY = Math.cos(this.yaw);
			const forward = this.camera.getDirection()
			const right = [cosY, 0, sinY];
			let move = [0, 0, 0];

			if (keys["w"]) { move[0] += forward[0]; move[2] += forward[2]; }
			if (keys["s"]) { move[0] -= forward[0]; move[2] -= forward[2]; }
			if (keys["a"]) { move[0] -= right[0]; move[2] -= right[2]; }
			if (keys["d"]) { move[0] += right[0]; move[2] += right[2]; }

			if (this.isPathBlocked(move)){
				return
			}

			const len = Math.hypot(move[0], move[2]);
			if (len > 0.0001) {
			move[0] /= len;
			move[2] /= len;

			this.pos[0] += move[0] * this.speed * dt;
			this.pos[2] += move[2] * this.speed * dt;
			}

			if (keys[" "]) this.pos[1] += this.speed * dt;
			if (keys["shift"]) this.pos[1] -= this.speed * dt;

			
			this.camera.setPosition(this.pos)
		}

	update(dt) {
		this.handleInput(this.keys, dt);
	}

	getDirectionPos(move) {
		return [this.pos[0] + move[0], this.pos[2] + move[2]]
	}

	isPathBlocked(move) {
		return Map.isWall(Map.getClosestCell(this.getDirectionPos(move)))
	}
}
