import { M4 } from "./tools/m4.js";
import Player from "./player.js";

export default class Scene {
	constructor(gl) {
		this.gl = gl;
		this.program = this.createProgram();
		this.uMVP = gl.getUniformLocation(this.program, "uMVP");
		this.player = new Player();
		this.objects = [];
		this.entities = []
	}

	createProgram() {
		const gl = this.gl;
		const vs = `
		attribute vec3 aPos;
		attribute vec3 aColor;
		uniform mat4 uMVP;
		varying vec3 vColor;
		void main() {
			gl_Position = uMVP * vec4(aPos, 1.0);
			vColor = aColor;
		}
		`;
		const fs = `
		precision mediump float;
		varying vec3 vColor;
		void main() {
			gl_FragColor = vec4(vColor, 1.0);
		}
		`;
		const compile = (src, type) => {
		const s = gl.createShader(type);
		gl.shaderSource(s, src);
		gl.compileShader(s);
		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
			throw new Error(gl.getShaderInfoLog(s));
		}
		return s;
		};
		const prog = gl.createProgram();
		gl.attachShader(prog, compile(vs, gl.VERTEX_SHADER));
		gl.attachShader(prog, compile(fs, gl.FRAGMENT_SHADER));
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(prog));
		}
		gl.useProgram(prog);
		return prog;
	}

	addObject(obj) {
		this.objects.push(obj);
	}

	addEntity(ett) {
		this.entities.push(ett)
	}

	render(dt) {
		const gl = this.gl

		gl.enable(gl.DEPTH_TEST)
		gl.clearColor(0.06, 0.06, 0.07, 1)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
		const proj = M4.perspective((60 * Math.PI) / 180, aspect, 0.1, 100.0)
		const view = this.player.camera.getViewMatrix()

		for (const obj of this.objects) {
			const model = M4.multiply(
				M4.translate(M4.identity, ...(obj.position)),
				M4.yRotate(M4.identity, obj.rotation)

			)
			
			const viewModel = M4.multiply(view, model);
			const mvp = M4.multiply(proj, viewModel);

			gl.uniformMatrix4fv(this.uMVP, false, mvp);

			if (typeof obj.draw === "function") {
				obj.draw(this.program, this.uMVP, view, proj);
			}
		}

		for (const ett of this.entities) {
			const model = M4.multiply(
				M4.translate(M4.identity, ...(ett.position)),
				M4.yRotate(M4.identity, ett.rotation)

			)

			const viewModel = M4.multiply(view, model);
			const mvp = M4.multiply(proj, viewModel);

			gl.uniformMatrix4fv(this.uMVP, false, mvp);

			if (typeof ett.draw === "function") {
				ett.draw(this.program, this.uMVP, view, proj);
			}

			ett.update(dt)
		}
	}
}
