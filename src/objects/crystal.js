import CrystalShape from "../bodies/crystal";

export default class Crystal {
    constructor(gl, pos) {
        this.shape = new CrystalShape(gl, pos)
        this.position = pos
    }

    // eslint-disable-next-line no-unused-vars
    update(dt) {
        this.shape.position = [...this.position]
	}

	draw(program, uMVP, view, proj) {
		this.shape.draw(program, uMVP, view, proj)
	}
}