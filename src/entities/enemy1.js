import { M4 } from "../tools/m4.js";
import Body from "../bodies/enemy1.js";
import Pathfinder from "../tools/pathFinder.js";
import Map from "../gameStrutcures/map.js";

export default class Enemy {
	constructor(gl, startPos = [0, 0, 0], scene) {
		this.gl = gl
		this.scene = scene
		this.position = [...startPos]
		this.speed = 1.5
		this.path = []
		this.pathIndex = 0
		this.repathTimer = 0

		this.body = new Body(gl, this.position)
	}

	process(dt) {
		const player = this.scene.player
		if (!player) return
		this.repathTimer += dt

		if (this.repathTimer > 2.0 || this.path.length === 0) {
			this.repathTimer = 0;
			this.path = Pathfinder.findPathBFS(this.position, player.position, Map.navigation)
			this.pathIndex = 0
		}

		if (this.path.length > 0 && this.pathIndex < this.path.length) {
			const target = this.path[this.pathIndex];
			const dir = [
				target[0] - this.position[0],
				target[1] - this.position[1],
				target[2] - this.position[2],
			]
			const dist = Math.hypot(...dir);

			if (dist > 0.05) {
				dir[0] /= dist
				dir[1] /= dist
				dir[2] /= dist
				this.position[0] += dir[0] * this.speed * dt
				this.position[1] += dir[1] * this.speed * dt
				this.position[2] += dir[2] * this.speed * dt
			} else {
				this.pathIndex++
			}
		}
		this.body.position = [...this.position]
	}

	draw(program, uMVP, view, proj) {
		this.body.draw(program, uMVP, view, proj)
	}

	isPlayerReach() {
		const player = this.scene.player
		return Pathfinder.getClosestCell(player.position) == Pathfinder.getClosestCell(this.position)
	}
}
