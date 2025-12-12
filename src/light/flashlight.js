export default class Flashlight {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.uLightPosition      = gl.getUniformLocation(program, "uLightPosition");
        this.uLightDirection     = gl.getUniformLocation(program, "uLightDirection");
        this.uAmbientLightColor  = gl.getUniformLocation(program, "uAmbientLightColor");
        this.uCutOff             = gl.getUniformLocation(program, "uCutOff");
        this.uOuterCutOff        = gl.getUniformLocation(program, "uOuterCutOff");

        this.camera

        // Configuração inicial da lanterna
        this.ambient = [1.0, 1.0, 1.0];          // luz ambiente fraca
        this.innerAngle = 12 * Math.PI / 180;    // cone interno (12°)
        this.outerAngle = 20 * Math.PI / 180;    // externo (20°)
    }

    setCamera(camera) {
        this.camera = camera
    }

    // eslint-disable-next-line no-unused-vars
    process(dt) {
        this.position = this.camera.position;
        this.direction = this.camera.getDirection();
        this.apply()
    }

    apply() {
        const gl = this.gl;

        gl.useProgram(this.program);

        // Posição
        gl.uniform3fv(this.uLightPosition, this.position);

        // Direção (já normalizada pela própria câmera)
        gl.uniform3fv(this.uLightDirection, this.direction);

        // Luz ambiente
        gl.uniform3fv(this.uAmbientLightColor, this.ambient);

        // Ângulos do cone (shader usa cos)
        gl.uniform1f(this.uCutOff, Math.cos(this.innerAngle));
        gl.uniform1f(this.uOuterCutOff, Math.cos(this.outerAngle));
    }

    // Se futuramente quiser efeitos
    setIntensity(val) {
        this.intensity = val;
    }

    setAmbientColor(rgb) {
        this.ambient = rgb;
    }

    setAngles(innerDeg, outerDeg) {
        this.innerAngle = innerDeg * Math.PI / 180;
        this.outerAngle = outerDeg * Math.PI / 180;
    }
}
