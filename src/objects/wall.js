import { M4 } from "../tools/m4.js";

export default class Wall {
    constructor(gl, position = [0, 0, 0]) {
        this.gl = gl;
        this.position = position;
        this.rotation = 0;
        this.texture = null;

        const px = 0.5, py = 5.0, pz = 0.5;
        const nx = -0.5, ny = 0.0, nz = -0.5;

        const positions = new Float32Array([
            nx, ny,  pz,
            px, ny,  pz,
            px, py,  pz,
            nx, py,  pz,

            px, ny, nz,
            nx, ny, nz,
            nx, py, nz,
            px, py, nz,

            px, ny,  pz,
            px, ny, nz,
            px, py, nz,
            px, py,  pz,

            nx, ny, nz,
            nx, ny,  pz,
            nx, py,  pz,
            nx, py, nz,

            nx, py,  pz,
            px, py,  pz,
            px, py, nz,
            nx, py, nz,

            nx, ny, nz,
            px, ny, nz,
            px, ny,  pz,
            nx, ny,  pz,
        ]);

        const repeatX = 1
		const repeatY = py - ny

		const uvFace = [
			0,     0,
			repeatX, 0,
			repeatX, repeatY,
			0,     repeatY
		];


        const uvs = new Float32Array([
            ...uvFace,
            ...uvFace,
            ...uvFace,
            ...uvFace,
            ...uvFace,
            ...uvFace,
        ]);

        const indexes = new Uint16Array([
            0,1,2, 0,2,3,         
            4,5,6, 4,6,7,
            8,9,10, 8,10,11,
            12,13,14, 12,14,15,
            16,17,18, 16,18,19,
            20,21,22, 20,22,23
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

        this.loadTexture("/assets/wall.png")
    }

    loadTexture(url) {
        const gl = this.gl;
        const tex = gl.createTexture();
        const img = new Image();

        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                img
            );

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.generateMipmap(gl.TEXTURE_2D);
            this.texture = tex;
        };

        img.onerror = () => {
            console.error("Erro ao carregar textura:", url);
        };

        img.src = url;
    }

    draw(program, uMVP, view, proj) {
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
        
        const mvp = M4.multiply(proj, M4.multiply(view, model));
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
