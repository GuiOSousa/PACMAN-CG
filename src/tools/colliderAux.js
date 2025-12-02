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

        const right = [z, -x];
        const left  = [-z, x];

        const sideOffset = 0.35;
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

        [xFinal, zFinal] = this.removeBlocked(vec, pos, xFinal, zFinal)

        if (rightBlocked || leftBlocked) {
            return [xFinal, 0, zFinal]
        }
        return vec
    }


}