import Renderable from "../basics/BasicRenderable";

export default class CrystalShape extends Renderable {
    constructor(gl, position = [0,0,0]) {
        super(gl, position)
        const r = 0.25
        const y = 0.5

        const vertices = [
            0, y, 0,

            r, 0, 0,
            0, 0, r,
            -r, 0, 0,
            0, 0, -r,

            0, -y, 0
        ];

        const indexes = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 1,

            5, 1, 2,
            5, 2, 3,
            5, 3, 4,
            5, 4, 1,
        ];

        const colors = [
            0.0, 0.5, 1.0,
        ];

        this.vertices = vertices
        this.indexes = indexes
        this.colors = colors

        this.createBuffers()
    }

    draw(program, uMVP, view, proj) {
        super.basicDraw(program, uMVP, view, proj)
    }

}
