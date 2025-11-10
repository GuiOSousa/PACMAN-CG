export class M4 {
  static create() {
    const m = new Float32Array(16);
    m[0] = m[5] = m[10] = m[15] = 1;
    return m;
  }

  static multiply(a, b) {
    const o = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let s = 0;
        for (let k = 0; k < 4; k++) s += a[i + k * 4] * b[k + j * 4];
        o[i + j * 4] = s;
      }
    }
    return o;
  }

  static perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const m = new Float32Array(16);
    m[0] = f / aspect;
    m[5] = f;
    m[10] = (far + near) / (near - far);
    m[11] = -1;
    m[14] = (2 * far * near) / (near - far);
    return m;
  }

  static translate(x, y, z) {
    const m = M4.create();
    m[12] = x;
    m[13] = y;
    m[14] = z;
    return m;
  }

  static rotateY(rad) {
    const c = Math.cos(rad),
      s = Math.sin(rad);
    const m = M4.create();
    m[0] = c;
    m[2] = s;
    m[8] = -s;
    m[10] = c;
    return m;
  }

  static lookAt(eye, center, up) {
    const z = M4.normalize([
      eye[0] - center[0],
      eye[1] - center[1],
      eye[2] - center[2],
    ]);
    const x = M4.normalize(M4.cross(up, z));
    const y = M4.cross(z, x);
    const m = M4.create();
    m[0] = x[0]; m[1] = y[0]; m[2] = z[0];
    m[4] = x[1]; m[5] = y[1]; m[6] = z[1];
    m[8] = x[2]; m[9] = y[2]; m[10] = z[2];
    m[12] = -M4.dot(x, eye);
    m[13] = -M4.dot(y, eye);
    m[14] = -M4.dot(z, eye);
    return m;
  }

  // ==== VETORES ====
  static normalize(v) {
    const l = Math.hypot(...v);
    return v.map((x) => x / (l || 1));
  }

  static cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
}
