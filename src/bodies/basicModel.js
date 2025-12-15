import { M4 } from "../tools/m4";

export default class ModelOBJ {
    constructor(gl, objText, scale = 1, color = [0, 0, 0]) {
        this.gl = gl;

        this.loaded = false;
        this.position = [0, 0, 0];
        this.rotation = 0;

        this.scale = scale
        this.color = color

        this.objText = objText;

        this._load();
    }

    async _load() {
        const { positions, uvs, colors, indices } = this.parseOBJ(this.objText);

        const gl = this.gl;

        this.vertexCount = positions.length / 3;
        this.numIndices = indices.length;

        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.loaded = true;
    }

    draw(program, uMVP, view, proj) {
        if (!this.loaded) return;

        const gl = this.gl;

        gl.useProgram(program);

        let model = M4.identity()
        model = M4.multiply(M4.translation(...this.position), M4.scale(model, this.scale, this.scale, this.scale))  
        const viewModel = M4.multiply(view, model);
        const mvp = M4.multiply(proj, viewModel);
        gl.uniformMatrix4fv(uMVP, false, mvp);

        const aPos = gl.getAttribLocation(program, "aPos");
        const aUV = gl.getAttribLocation(program, "aUV");
        const aColor = gl.getAttribLocation(program, "aColor");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.enableVertexAttribArray(aUV);
        gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


        gl.uniformMatrix4fv(
            gl.getUniformLocation(program, "uModel"),
            false,
            new Float32Array(model)
        );

        const uHasTexture = gl.getUniformLocation(program, "uHasTexture");
        gl.uniform1i(uHasTexture, 0);

        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
    }

    parseOBJ(text) {
        const positions = [];
        const uvs = [];
        const normals = [];

        const finalPositions = [];
        const finalUVs = [];
        const finalNormals = [];
        const finalColors = [];
        const indices = [];

        const lines = text.split("\n");

        for (let line of lines) {
            line = line.trim();
            if (line === "" || line.startsWith("#")) continue;

            const parts = line.split(/\s+/);
            const type = parts[0];

            if (type === "v") {
                positions.push(parts.slice(1).map(Number));

            } else if (type === "vt") {
                uvs.push(parts.slice(1).map(Number));

            } else if (type === "vn") {
                normals.push(parts.slice(1).map(Number));

            } else if (type === "f") {

                const faceVerts = parts.slice(1).map(f => {
                    const [v, vt, vn] = f.split("/").map(i => i ? parseInt(i) : undefined);
                    return {
                        v: (v ?? 1) - 1,
                        vt: vt ? vt - 1 : undefined,
                        vn: vn ? vn - 1 : undefined,
                    };
                });

                for (let i = 1; i < faceVerts.length - 1; i++) {
                    const tri = [faceVerts[0], faceVerts[i], faceVerts[i + 1]];

                    tri.forEach(vtx => {
                        const pos = positions[vtx.v];
                        finalPositions.push(...pos);

                        if (vtx.vt !== undefined && uvs[vtx.vt]) {
                            finalUVs.push(...uvs[vtx.vt]);
                        } else {
                            finalUVs.push(0, 0);
                        }

                        finalColors.push(...this.color);
                        finalNormals.push(0, 1, 0);

                        indices.push(indices.length);
                    });
                }
            }
        }

        return {
            positions: finalPositions,
            uvs: finalUVs,
            colors: finalColors,
            normals: finalNormals,
            indices
        };
    }
}
