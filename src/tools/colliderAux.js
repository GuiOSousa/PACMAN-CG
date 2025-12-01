import Pathfinder from "./pathFinder";
import Map from "../gameStrutcures/map";

export default class ColliderAux {
    constructor(){}

    isBlocked(vec, pos) {
        const blockedDirections = [
            Map.isWall([pos[0] + 0.1, 0, pos[2]]),
            Map.isWall([pos[0] - 0.1, 0, pos[2]]),
            Map.isWall([pos[0], 0, pos[2] + 0.1]),
            Map.isWall([pos[0], 0, pos[2] - 0.1]),
        ]

        if (vec[0] > 0 && blockedDirections[0]) { return true }
        if (vec[0] < 0 && blockedDirections[1]) { return true }
        if (vec[2] > 0 && blockedDirections[2]) { return true }
        if (vec[2] < 0 && blockedDirections[3]) { return true }
        
        return false
    }

    getOrientedVector(vec, pos) {
        const [x, y, z] = vec;

        const right = [z, -x];
        const left  = [-z, x];

        const sideOffset = 0.25;
        const forwardOffset = 0.6;

        const px = pos[0];
        const pz = pos[2];

        const rightPos = [
            px + x * forwardOffset + right[0] * sideOffset,
            0,
            pz + z * forwardOffset + right[1] * sideOffset
        ];

        const leftPos = [
            px + x * forwardOffset + left[0] * sideOffset,
            0,
            pz + z * forwardOffset + left[1] * sideOffset
        ];

        const rightBlocked = Map.isWall(rightPos);
        const leftBlocked  = Map.isWall(leftPos);

        let xFinal = x
        let zFinal = z

        if (Map.isWall([pos[0] + x, pos[1], pos[2]])) {
            xFinal = 0
        }

        if (Map.isWall([pos[0], pos[1], pos[2] + z])) {
            zFinal = 0
        }

        if (this.isBlocked(vec, pos)) {
            return [0, 0, 0]
        }

        if (rightBlocked || leftBlocked) {
            return [xFinal, 0, zFinal]
        }
        return vec
    }


}