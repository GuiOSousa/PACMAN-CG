import CrystalShape from "../bodies/crystal";

export default class Crystal {
    constructor(gl, pos) {
        this.shape = new CrystalShape(gl, pos)
    }

    update(dt) {
        this.body.position = [...this.position]
	}

	draw(program, uMVP, view, proj) {
		this.body.draw(program, uMVP, view, proj)
	}
}