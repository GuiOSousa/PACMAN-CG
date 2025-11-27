import Camera from "./camera.js";
import Map from "../gameStrutcures/map.js";
import variables from "../reactSignals/signal.js";
import Pathfinder from "../tools/pathFinder.js";

export default class Player {
	constructor() {
		this.camera = new Camera();
		this.pos = [0, 0, 0]
		this.speed = 3.0
		this.keys = {}
		this._setupInput()
		this._setupMouse()
	}

	_setupInput() {
		window.addEventListener("keydown", (e) => {
			this.keys[e.key.toLowerCase()] = true
			window.addEventListener("keyup", (e) => {
				this.keys[e.key.toLowerCase()] = false
			})
		})

		

		window.addEventListener("blur", () => {
		for (let k in this.keys) this.keys[k] = false;
		});
	}

	_setupMouse() {
		const canvas = document.querySelector("canvas");

		canvas.addEventListener("click", () => {
			canvas.requestPointerLock();
		});

		document.addEventListener("mousemove", (e) => {
			if (document.pointerLockElement === canvas) {
				this.camera.yaw += e.movementX * 0.002;
				const camPitch = this.camera.pitch - (e.movementY * 0.002)
				this.camera.pitch = Math.max(-1.3, Math.min(1.3, camPitch));
			}
		});
	}


	handleInput(keys, dt) {
			const forward = this.camera.getDirection()
			const right = [-forward[2], 0, forward[0]];

			let move = [0, 0, 0];

			if (keys["w"]) { move[0] += forward[0]; move[2] += forward[2]; }
			if (keys["s"]) { move[0] -= forward[0]; move[2] -= forward[2]; }
			if (keys["a"]) { move[0] -= right[0]; move[2] -= right[2]; }
			if (keys["d"]) { move[0] += right[0]; move[2] += right[2]; }

			if (this.isPathBlocked(move)){
				return
			}

			if (keys["shift"]) {
				this.speed = 7
			} 
			else {
				this.speed = 3
			}

			const len = Math.hypot(move[0], move[2]);
			if (len > 0.0001) {
			move[0] /= len;
			move[2] /= len;

			this.pos[0] += move[0] * this.speed * dt;
			this.pos[2] += move[2] * this.speed * dt;
			}


			
			this.camera.setPosition(this.pos)
		}

	update(dt) {
		this.handleInput(this.keys, dt);

		variables.value = {
			...variables.value,
			playerPosition: [...Pathfinder.getClosestCell(this.pos)]
		}
	}

	getDirectionPos(move) {
		return [this.pos[0] + move[0], 0, this.pos[2] + move[2]]
	}

	isPathBlocked(move) {
		return Map.isWall(this.getDirectionPos(move))
	}
}
