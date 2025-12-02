export default class CrystalShape {
    constructor(gl, position = [0,0,0]) {
        this.gl = gl;
        this.position = position;
        this.rotation = 0;
        const r = 0.5;

        const topY = 1.0;
        const upperY = 0.4;
        const lowerY = -0.4;
        const bottomY = -1.0;

        const vertices = [
            0, topY, 0,

            r, upperY, 0,
            0, upperY, r,
            -r, upperY, 0,
            0, upperY, -r,

            r, lowerY, 0,
            0, lowerY, r,
            -r, lowerY, 0,
            0, lowerY, -r,

            0, bottomY, 0
        ];

        const indexes = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 1,

            1, 5, 2,
            2, 6, 3,
            3, 7, 4,
            4, 8, 1,

            5, 9, 6,
            6, 9, 7,
            7, 9, 8,
            8, 9, 5
        ];

        const colors = [
            ...Array(10).fill([0.8, 0.8, 0.8]).flat()
        ];

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);

        this.indexCount = indexes.length;
    }

    draw(program) {
        const gl = this.gl;

        const aPos = gl.getAttribLocation(program, "aPos");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPos);

        const aColor = gl.getAttribLocation(program, "aColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aColor);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
}
