import Wall from "../objects/wall.js";
import Pathfinder from "../tools/pathFinder.js";
import PixelInterpreter from "../tools/pixelInterpreter.js";

class MapNode {
	walls
	navigation
	orbs

	constructor(scene) {
		this.scene = scene;
		this.walls = []
		this.navigation = []
	}

	setScene(s) {
		this.scene = s
	}

	isWall(pos) {
		const cell = Pathfinder.getClosestCell(pos)
		return this.walls.find(p => p[0] == cell[0] && p[2] == cell[1])
	}

	 async loadFromImage(url, scale = 1) {
        const pixels = await PixelInterpreter.loadMap(url);

        const height = pixels.length;
        const width = pixels[0].length;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const { r, g, b, a } = pixels[y][x];

				if (a === 0) continue;

                const posX = x * scale;
                const posZ = -y * scale;

                if (r === 255 && g === 0 && b === 0) {
                    this.scene.addObject(
                        new Wall(this.scene.gl, [posX, 0, posZ])
                    );
                    this.walls.push([posX, 0, posZ]);
                    continue
                }

                this.navigation.push([posX, 0, posZ]);
                
                if (r === 0 && g === 255 && b === 0) {
                    const p = this.scene.player;
                    if (p?.camera) {
                        const newPos = [posX, 1.2, posZ];
                        p.pos = newPos;
                    }
                }

                if (r === 0 && g === 0 && b === 255) {
                    this.orbs.push([posX, 0, posZ]);
                }
            }
        }
    }
}

const Map = new MapNode()
export default Map