import { useEffect, useRef } from "react";

/**
 * Subtle animated WebGL shader background — slow drifting noise + soft color blobs,
 * inspired by the shader on the source site. Falls back to pure black if WebGL is unavailable.
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    const frag = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;

      // 2D hash + value noise
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v = 0.0; float a = 0.5;
        for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
        float t = u_time * 0.03;

        // drifting flow field
        vec2 q = uv*1.4 + vec2(t, -t*0.7);
        float n = fbm(q + fbm(q + t));

        // three slow-moving soft blobs
        vec2 b1 = vec2(sin(t*1.3)*0.55, cos(t*1.1)*0.30);
        vec2 b2 = vec2(cos(t*0.9)*-0.60, sin(t*0.7)*0.35);
        vec2 b3 = vec2(sin(t*0.6 + 1.7)*0.20, cos(t*0.8 + 0.5)*-0.45);
        float d1 = exp(-dot(uv-b1, uv-b1) * 2.2);
        float d2 = exp(-dot(uv-b2, uv-b2) * 2.6);
        float d3 = exp(-dot(uv-b3, uv-b3) * 3.0);

        // brand palette: slateblue (#6a5acd), deep indigo (#111c4e), royal purple (#3d135f)
        vec3 cSlate  = vec3(0.416, 0.353, 0.804);
        vec3 cIndigo = vec3(0.067, 0.110, 0.306);
        vec3 cPurple = vec3(0.239, 0.075, 0.373);

        vec3 col = vec3(0.0);
        col += cSlate  * d1 * 1.15;
        col += cPurple * d2 * 1.00;
        col += cIndigo * d3 * 1.30;
        // noise wash tinted toward the palette
        col += mix(cIndigo, cSlate, n) * n * 0.45;

        // vignette
        float v = smoothstep(1.4, 0.20, length(uv));
        col *= v;

        // grain
        float g = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.025;
        col += g;


        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full bg-background"
    />
  );
}
