import Pathfinder from "../tools/pathFinder.js";
import Map from "../gameStrutcures/map.js";
import BasicEnemy from "./basicEnemy.js";
import ChaseGhostBody from "../bodies/chaseGhost.js";

export default class Enemy extends BasicEnemy {
	constructor(gl, startPos = [0, 0, 0], scene) {
		super(gl, startPos, scene)
		this.speed = 5
		this.body = new ChaseGhostBody(gl, this.position, this)
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

		this.followPath(dt)
	}
}
