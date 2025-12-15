import { M4 } from "../tools/m4.js";
import Pathfinder from "../tools/pathFinder.js";
import Map from "../gameStrutcures/map.js";
import CollisionChecker from "../tools/collisionChecker.js";
import GhostBody from "../bodies/routeGhost.js";
import BasicEnemy from "./basicEnemy.js";

export default class RouteGhost extends BasicEnemy {
	constructor(gl, startPos = [0, 0, 0], scene, basePath) {
		super(gl, startPos, scene)

		this.body = new GhostBody(gl, this.position, this)
        this.basePath = basePath
        this.path = [...basePath]
	}

	process(dt) {
		const player = this.scene.player
		if (!player) return
		this.followPath(dt)
        if (this.pathIndex == this.path.length) {
            this.pathIndex = 0
        }
	}
}
