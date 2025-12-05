import CrystalShape from "../bodies/crystal";
import CollisionChecker from "../tools/collisionChecker";

export default class Crystal {
    constructor(gl, pos, scene, controller) {
        this.shape = new CrystalShape(gl, pos)
        this.position = pos
        this.scene = scene
        this.controller = controller

        this.xOffset = 0.5
        this.zOffset = -0.5

        this.shape.position[0] = this.position[0] + this.xOffset
        this.shape.position[1] = 1
        this.shape.position[2] = this.position[2] + this.zOffset

        this.collisionChecker = new CollisionChecker(scene.player)
    }

    collected() {
        this.controller.crystalCollected(this)
    }

    // eslint-disable-next-line no-unused-vars
    process(dt) {
        const pos = [this.position[0] + this.xOffset, 0, this.position[2] + this.zOffset]
        if (this.collisionChecker.isColliding(pos)) {
            this.collected()
        }
	}

	draw(program, uMVP, view, proj) {
		this.shape.draw(program, uMVP, view, proj)
	}
}