import CrystalShape from "../bodies/crystal";

export default class Crystal {
    constructor(gl, pos) {
        this.shape = new CrystalShape(gl, pos)
        this.position = pos

        const xOffset = 0.5
        const zOffset = -0.5

        this.shape.position[0] = this.position[0] + xOffset
        this.shape.position[1] = 1
        this.shape.position[2] = this.position[2] + zOffset
    }

    // eslint-disable-next-line no-unused-vars
    update(dt) {
        return
	}

	draw(program, uMVP, view, proj) {
		this.shape.draw(program, uMVP, view, proj)
	}
}