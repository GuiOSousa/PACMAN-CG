import { M4 } from "../tools/m4.js";
import Player from "../entities/player.js";

export default class Scene {
	constructor(gl) {
		this.gl = gl;
		this.program = this.createProgram();
		this.uMVP = gl.getUniformLocation(this.program, "uMVP");
		this.player = new Player(this);
		this.objects = [];
		this.entities = [this.player]
	}

	createProgram() {
		const gl = this.gl;
		const vs = `
		attribute vec3 aPos;
		attribute vec2 aUV;
		attribute vec3 aColor;

		uniform mat4 uMVP;
		uniform mat4 uModel;   // vamos adicionar só isso — simples!

		varying vec2 vUV;
		varying vec3 vColor;
		varying vec3 v_normal;
		varying vec3 v_position;

		void main() {

			// posição no MUNDO (world space)
			vec4 worldPos = uModel * vec4(aPos, 1.0);
			v_position = worldPos.xyz;

			// normal aproximada derivada da geometria
			// funciona bem em paredes verticais sem enviar a_normal
			v_normal = normalize(aPos);

			vUV = aUV;
			vColor = aColor;

			gl_Position = uMVP * vec4(aPos, 1.0);
		}

		`;

		const fs = `
		precision mediump float;

		varying vec2 vUV;
		varying vec3 vColor;
		varying vec3 v_normal;
		varying vec3 v_position;

		uniform sampler2D uTexture;
		uniform bool uHasTexture;

		// Luz ambiente (cor constante fraca)
		uniform vec3 uAmbientLightColor;

		// Spotlight
		uniform vec3 uLightPosition;   
		uniform vec3 uLightDirection;  
		uniform float uCutOff;         
		uniform float uOuterCutOff;    

		void main() {

			// Cor base (textura ou cor)
			vec4 baseColor =
				uHasTexture ? texture2D(uTexture, vUV)
							: vec4(vColor, 1.0);

			// Direção da luz → para o fragmento
			vec3 lightDir = normalize(uLightPosition - v_position);

			// Direção da lanterna
			vec3 lightDirection = normalize(uLightDirection);

			// Ângulo entre o fragmento e o centro do cone da lanterna
			float theta = dot(lightDir, -lightDirection);

			// Intensidade do cone (spotlight)
			float intensity = smoothstep(uOuterCutOff, uCutOff, theta);

			// Difusa
			vec3 normal = normalize(v_normal);
			float diff = max(dot(normal, lightDir), 0.0);

			vec3 diffuse = diff * intensity * uAmbientLightColor;

			// Ambiente simples
			vec3 ambient = uAmbientLightColor * 0.25;

			// Resultado final
			vec3 result = ambient + diffuse;

			gl_FragColor = vec4(result, 1.0) * baseColor;
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

	removeObject(obj) {
		this.objects = this.objects.filter(o => o.position !== obj.position)
	}

	addEntity(ett) {
		this.entities.push(ett)
	}

	process(dt) {
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

			if (typeof obj.process === "function") {
				obj.process(dt)
			}
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
			ett.process(dt)
		}
	}
}
