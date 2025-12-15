import Camera from "./camera.js";
import Map from "../gameStrutcures/map.js";
import variables from "../events/signal.js";
import Pathfinder from "../tools/pathFinder.js";
import ColliderAux from "../tools/colliderAux.js";
import Flashlight from "../light/flashlight.js";
import PlayerBody from "../bodies/player.js";

export default class Player {
	constructor(scene) {
		this.scene = scene

		this.camera = new Camera();
		this.position = [0, 0, 0]
		this.speed = 3.0
		this.keys = {}
		this._setupInput()
		this._setupMouse()
		this.colliderAux = new ColliderAux

		const fl = new Flashlight(this.scene.gl, this.scene.program)
		this.flashlight = fl
		fl.setCamera(this.camera)

		this.body = new PlayerBody(scene.gl, this.position, this)
	}

	setBody(newBody) {
		this.body = newBody
		console.log(this.body)
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
				
				move = this.colliderAux.getOrientedVector(move, this.position)

				this.position[0] += move[0] * this.speed * dt;
				this.position[2] += move[2] * this.speed * dt;
			}

			this.camera.setPosition(this.position)
		}

	process(dt) {
		this.handleInput(this.keys, dt);

		variables.value = {
			...variables.value,
			playerPosition: [...Pathfinder.getClosestCell(this.position)]
		}

		this.body.position = [this.position[0], 1.0, this.position[2]]

		const dir = this.camera.getDirection();
        this.body.position[0] += dir[0] * 0.25;
        this.body.position[2] += dir[2] * 0.25;

		this.body.rotation = -this.camera.yaw + 1.72
		
		this.flashlight.process(dt)
	}

	draw(program, uMVP, view, proj) {
		this.body.draw(program, uMVP, view, proj)
	}

	getDirectionPos(move) {
		return [this.position[0] + move[0], 0, this.position[2] + move[2]]
	}

	isPathBlocked(move) {
		return Map.isWall(this.getDirectionPos(move))
	}
}
