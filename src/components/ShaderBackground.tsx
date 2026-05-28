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

        // two slow-moving soft blobs
        vec2 b1 = vec2(sin(t*1.3)*0.45, cos(t*1.1)*0.25);
        vec2 b2 = vec2(cos(t*0.9)*-0.5, sin(t*0.7)*0.3);
        float d1 = exp(-dot(uv-b1, uv-b1) * 4.0);
        float d2 = exp(-dot(uv-b2, uv-b2) * 5.0);

        // deep indigo + warm ember accents, kept very subtle on near-black
        vec3 col = vec3(0.0);
        col += vec3(0.22, 0.28, 0.55) * d1 * 0.55;
        col += vec3(0.55, 0.30, 0.18) * d2 * 0.40;
        col += vec3(0.10, 0.12, 0.20) * n * 0.35;

        // vignette
        float v = smoothstep(1.3, 0.25, length(uv));
        col *= v;

        // grain
        float g = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.02;
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
