import Pathfinder from "./pathFinder"

export default class CollisionChecker {
    constructor(player) {
        this.player = player
    }

    isColliding(p, dist=1.2) {
        const x = this.player.position[0] - p[0]
        const z = this.player.position[2] - p[2]

        return Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2)) < dist
    }
}