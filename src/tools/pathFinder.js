export default class Pathfinder {
    static isSameCell(a, b) {
        const cellA = this.getClosestCell(a)
        const cellB = this.getClosestCell(b)
        return cellA[0] == cellB[0] && cellA[1] == cellB[1]
    }
    
    static getClosestCell(pos) {
        const cell = [Math.round(pos[0]), Math.round(pos[2])]
		return cell
	}

    static findPathBFS(start, goal, navigationMap, simplify = true) {
        const toKey = (p) => `${p[0]},${p[1]}`;
        const nodes = Object.create(null);
        
        for (const n of navigationMap) {
            const [x, z] = this.getClosestCell(n);
            nodes[`${x},${z}`] = n;
        }

        const start2D = this.getClosestCell(start);
        const goal2D = this.getClosestCell(goal);
        const queue = [start2D];
        const cameFrom = Object.create(null);
        const visited = Object.create(null);

        visited[toKey(start2D)] = true;

        const dirs = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];

        while (queue.length > 0) {
            const current = queue.shift();
            if (current[0] === goal2D[0] && current[1] === goal2D[1]) {
                const path = [nodes[toKey(current)]];
                let ck = toKey(current);
                while (cameFrom[ck]) {
                    ck = cameFrom[ck];
                    const p = nodes[ck];
                    if (p) path.unshift(p);
                }
                if (simplify) {
                    return this.simplifyPath(path)
                }
                return path;
            }

            for (const [dx, dz] of dirs) {
                const nx = current[0] + dx;
                const nz = current[1] + dz;
                const nk = `${nx},${nz}`;
                if (!visited[nk] && nodes[nk]) {
                    visited[nk] = true;
                    cameFrom[nk] = toKey(current);
                    queue.push([nx, nz]);
                }
            }
        }

        return [];
    }
    
    static simplifyPath(path = []) {
        path = path.slice(1, path.length)
        const reduce = []

        for (let i = 0; i < path.length - 3; i++) {
            if (path[i][0] === path[i+1][0] && path[i+1][0] == path[i+2][0]) {
                reduce.push(path[i+1])
            }
            else if (path[i][2] === path[i+1][2] && path[i+1][2] == path[i+2][2]) {
                reduce.push(path[i+1])
            }
        }

        path = path.filter(s => !reduce.find(a => a == s))
        return path
    }
}
