import { GameEvents } from "../events/events"
import variables from "../events/signal"
import CollisionChecker from "../tools/collisionChecker"
import Pathfinder from "../tools/pathFinder"

export default class BasicEnemy {
    constructor(gl, startPos = [0, 0, 0], scene) {
		this.gl = gl
		this.scene = scene
		this.position = [...startPos]
		this.baseSpeed = 3
		this.speed = this.baseSpeed
		this.path = []
		this.pathIndex = 0
		this.repathTimer = 0

		this.collisionChecker = new CollisionChecker(scene.player)
	}

	setBody(newBody) {
		this.body = newBody
		console.log(this.body)
	}

    followPath(dt) {
		this.speed = this.baseSpeed + ((variables.value.difficulty - 1) * 0.5)


        if (this.path.length > 0 && this.pathIndex < this.path.length) {
			const target = this.path[this.pathIndex];
			if (!target) {return}
            
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
				this.position[1] += 0
				this.position[2] += dir[2] * this.speed * dt
			} else {
				this.pathIndex++
			}
		}
		this.body.position = [...this.position]
		if (this.isPlayerReach()) {
			window.dispatchEvent( new CustomEvent(GameEvents.GAME_OVER) );
		}
    }

	// eslint-disable-next-line no-unused-vars
	process(dt) {}

	draw(program, uMVP, view, proj) {
		this.body.draw(program, uMVP, view, proj)
	}

	isPlayerReach() {
		return this.collisionChecker.isColliding(this.position)
	}
}
