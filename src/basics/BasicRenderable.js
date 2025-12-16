import { M4 } from "../tools/m4";

export default class Renderable {
    constructor(gl, position = [0,0,0]) {
        this.gl = gl;
        this.position = position;
        this.rotation = 0;
    }

    createBuffers() {
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), this.gl.STATIC_DRAW);

        this.indexCount = this.indexes.length;
    }

    basicDraw(program, uMVP, view, proj) {
        const gl = this.gl;

        const model = M4.multiply(
            M4.translation(...this.position),
            M4.yRotation(this.rotation)
        );

        gl.uniformMatrix4fv(
                gl.getUniformLocation(program, "uModel"),
                false,
                new Float32Array(model)
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

    textureDraw(program, uMVP, view, proj) {
        const gl = this.gl;
        if (!this.texture) return;

        const model = M4.multiply(
            M4.translation(...this.position),
            M4.yRotation(this.rotation)
        );

        gl.uniformMatrix4fv(
            gl.getUniformLocation(program, "uModel"),
            false,
            new Float32Array(model)
        );

        const viewModel = M4.multiply(view, model);
        const mvp = M4.multiply(proj, viewModel);
        gl.uniformMatrix4fv(uMVP, false, mvp);

        gl.uniform1i(gl.getUniformLocation(program, "uHasTexture"), 1);

        const aPos = gl.getAttribLocation(program, "aPos");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        const aUV = gl.getAttribLocation(program, "aUV");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.enableVertexAttribArray(aUV);
        gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
}
