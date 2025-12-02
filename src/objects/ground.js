import { M4 } from "../tools/m4.js";

export default class Floor {
    constructor(gl, position = [0, 0, 0], size = [10, 10]) {
        this.gl = gl;
        this.position = position;
        this.size = size;
        this.texture = null;

        const [w, d] = size;

        const positions = new Float32Array([
            0, 0, 0,
            w, 0, 0,
            w, 0, d,
            0, 0, d,
        ]);

        const tileX = w;
        const tileY = d;

        const uvs = new Float32Array([
            0,     0,
            tileX, 0,
            tileX, tileY,
            0,     tileY
        ]);

        const indexes = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);

        this.posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        this.uvBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuf);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

        this.idxBuf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);

        this.indexCount = indexes.length;

        this.loadTexture("src/assets/ground.png");
    }

    loadTexture(url) {
        const gl = this.gl;
        const tex = gl.createTexture();
        const img = new Image();
        img.src = url;

        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

            gl.generateMipmap(gl.TEXTURE_2D);

            this.texture = tex;
        };
    }

    draw(program, uMVP, view, proj) {
        const gl = this.gl;

        if (!this.texture) return

        const model = M4.translation(...this.position);
        const viewModel = M4.multiply(view, model);
        const mvp = M4.multiply(proj, viewModel);

        gl.uniformMatrix4fv(uMVP, false, mvp);

        gl.uniform1i(gl.getUniformLocation(program, "uHasTexture"), 1);

        const posLoc = gl.getAttribLocation(program, "aPos");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

        const uvLoc = gl.getAttribLocation(program, "aUV");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuf);
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuf);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
}
