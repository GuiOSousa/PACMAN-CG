import { M4 } from "../tools/m4.js";

export default class Body {
    constructor(gl, position = [0, 0, 0]) {
        this.gl = gl;
        this.position = position;
        this.rotation = 0;

        const positions = new Float32Array([
            -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
            -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,   0.5, -0.5, -0.5
        ]);

        const colors = new Float32Array([
            1,0,0,1,0,0,1,0,0,1,0,0,
            0,1,0,0,1,0,0,1,0,0,1,0
        ]);

        const indices = new Uint16Array([
            0,1,2,0,2,3, 4,5,6,4,6,7,
            3,2,6,3,6,5, 0,4,7,0,7,1,
            1,7,6,1,6,2, 0,3,5,0,5,4
        ]);

        this.posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        this.colBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuf);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

        this.idxBuf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        this.indexCount = indices.length;
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

        const posLoc = gl.getAttribLocation(program, "aPos");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

        const colLoc = gl.getAttribLocation(program, "aColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuf);
        gl.enableVertexAttribArray(colLoc);
        gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuf);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
}