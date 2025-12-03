import { M4 } from "../tools/m4";

export default class CrystalShape {
    constructor(gl, position = [0,0,0]) {
        this.gl = gl;
        this.position = position;
        this.rotation = 0;
        
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

    draw(program, uMVP, view, proj) {
    const gl = this.gl;

    const model = M4.multiply(
        M4.translation(...this.position),
        M4.yRotation(this.rotation)
    );

    const viewModel = M4.multiply(view, model);
    const mvp = M4.multiply(proj, viewModel);

    gl.uniformMatrix4fv(uMVP, false, mvp);

    const aPos = gl.getAttribLocation(program, "aPos");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const aColor = gl.getAttribLocation(program, "aColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

    gl.uniform1i(gl.getUniformLocation(program, "uHasTexture"), 0);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
}

}
