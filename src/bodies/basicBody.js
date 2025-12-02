import { M4 } from "../tools/m4";

export default class CrystalShape {
    constructor(gl, position = [0,0,0]) {
        this.gl = gl;
        this.position = position;
        this.rotation = 0;

        this.vertices = []
        this.indexes
        this.colors

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.STATIC_DRAW);

        this.indexCount = this.indexes.length;
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

    if (this.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);
    } else {
        gl.uniform1i(gl.getUniformLocation(program, "uHasTexture"), 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
}

}