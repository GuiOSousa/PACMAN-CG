import { M4 } from "../tools/m4.js";
import Pathfinder from "../tools/pathFinder.js";
import Map from "../gameStrutcures/map.js";
import CollisionChecker from "../tools/collisionChecker.js";
import GhostBody from "../bodies/enemy1.js";

export default class Enemy {
	constructor(gl, startPos = [0, 0, 0], scene) {
		this.gl = gl
		this.scene = scene
		this.position = [...startPos]
		this.speed = 3
		this.path = []
		this.pathIndex = 0
		this.repathTimer = 0

		this.body = new GhostBody(gl, this.position, this)
		this.collisionChecker = new CollisionChecker(scene.player)
	}

	setBody(newBody) {
		this.body = newBody
		console.log(this.body)
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
			
			//console.log(target)
			const dir = [
				target[0] - this.position[0],
				0,
				target[2] - this.position[2],
			]
			const dist = Math.hypot(...dir);

			if (dist > 0.05) {
				dir[0] /= dist
				dir[2] /= dist
				this.position[0] += dir[0] * this.speed * dt
				this.position[1] += 0//dir[1] * this.speed * dt
				this.position[2] += dir[2] * this.speed * dt
			} else {
				this.pathIndex++
			}
		}
		this.body.position = [...this.position]
	}

	draw(program, uMVP, view, proj) {
		this.body.draw(program, uMVP, view, proj)
		//console.log(this.position)
	}

	isPlayerReach() {
		const player = this.scene.player
		return Pathfinder.getClosestCell(player.position) == Pathfinder.getClosestCell(this.position)
	}
}
