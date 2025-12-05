import Pathfinder from "./pathFinder";
import Map from "../gameStrutcures/map";

export default class ColliderAux {
    constructor(){}

    removeBlocked(vec, pos, x, z) {
        const dist = 0.2
        const blockedDirections = [
            Map.isWall([pos[0] + dist, 0, pos[2] + dist]),
            Map.isWall([pos[0] - dist, 0, pos[2] + dist]),
            Map.isWall([pos[0] + dist, 0, pos[2] - dist]),
            Map.isWall([pos[0] - dist, 0, pos[2] - dist]),
        ]

        if (vec[0] > 0 && (blockedDirections[0] || blockedDirections[2])) { x = 0 }
        if (vec[0] < 0 && (blockedDirections[1] || blockedDirections[3])) { x = 0 }
        if (vec[2] > 0 && (blockedDirections[0] || blockedDirections[1])) { z = 0 }
        if (vec[2] < 0 && (blockedDirections[2] || blockedDirections[3])) { z = 0 }
        
        return [x, z]
    }

    getOrientedVector(vec, pos) {
        // eslint-disable-next-line no-unused-vars
        const [x, y, z] = vec;
        let xFinal = x
        let zFinal = z

        if (Map.isWall([pos[0] + x, pos[1], pos[2]])) {
            xFinal = 0
        }

        if (Map.isWall([pos[0], pos[1], pos[2] + z])) {
            zFinal = 0
        }

        [xFinal, zFinal] = this.removeBlocked(vec, pos, xFinal, zFinal)

        return [xFinal, 0, zFinal]
    }


}