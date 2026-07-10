import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Transform, Vec3, Camera } from 'ogl';
import './MetaBalls.css';

function parseHexColor(hex) {
  const c = hex.replace('#', '');
  return [
    parseInt(c.substring(0, 2), 16) / 255,
    parseInt(c.substring(2, 4), 16) / 255,
    parseInt(c.substring(4, 6), 16) / 255,
  ];
}

function fract(x) { return x - Math.floor(x); }

function hash31(p) {
  let r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const ry = [r[1], r[2], r[0]];
  const d = r[0]*(ry[0]+33.33) + r[1]*(ry[1]+33.33) + r[2]*(ry[2]+33.33);
  return r.map(v => fract(v + d));
}

function hash33(v) {
  let p = [v[0]*0.1031, v[1]*0.103, v[2]*0.0973].map(fract);
  const py = [p[1], p[0], p[2]];
  const d = p[0]*(py[0]+33.33) + p[1]*(py[1]+33.33) + p[2]*(py[2]+33.33);
  p = p.map(v => fract(v + d));
  return fract((p[0] + p[1]) * p[2]);
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[50];
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;

float getMetaBallValue(vec2 c, float r, vec2 p) {
  vec2 d = p - c;
  return (r * r) / dot(d, d);
}

void main() {
  float scale = iAnimationSize / iResolution.y;
  vec2 coord = (gl_FragCoord.xy - iResolution.xy * 0.5) * scale;
  vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
  float m1 = 0.0;
  for (int i = 0; i < 50; i++) {
    if (i >= iBallCount) break;
    m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);
  }
  float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord);
  float total = m1 + m2;
  float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
  vec3 cFinal = vec3(0.0);
  if (total > 0.0) {
    cFinal = iColor * (m1 / total) + iCursorColor * (m2 / total);
  }
  outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}`;

const MetaBalls = ({
  className = '', color = '#ffffff', speed = 0.3,
  enableMouseInteraction = true, hoverSmoothness = 0.05,
  animationSize = 30, ballCount = 15, clumpFactor = 1,
  cursorBallSize = 3, cursorBallColor = '#ffffff',
  enableTransparency = true
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: 1, alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, enableTransparency ? 0 : 1);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 });
    camera.position.z = 1;

    const geometry = new Triangle(gl);
    const [r1, g1, b1] = parseHexColor(color);
    const [r2, g2, b2] = parseHexColor(cursorBallColor);

    const metaBallsUniform = Array.from({ length: 50 }, () => new Vec3(0, 0, 0));

    const program = new Program(gl, {
      vertex, fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: new Vec3(r1, g1, b1) },
        iCursorColor: { value: new Vec3(r2, g2, b2) },
        iAnimationSize: { value: animationSize },
        iBallCount: { value: Math.min(ballCount, 50) },
        iCursorBallSize: { value: cursorBallSize },
        iMetaBalls: { value: metaBallsUniform },
        iClumpFactor: { value: clumpFactor },
        enableTransparency: { value: enableTransparency }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    const count = Math.min(ballCount, 50);
    const ballParams = Array.from({ length: count }, (_, i) => {
      const h1 = hash31(i + 1);
      const h2 = hash33(h1);
      return {
        st: h1[0] * Math.PI * 2,
        dtFactor: 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI),
        baseScale: 5 + h1[1] * 5,
        toggle: Math.floor(h2 * 2),
        radius: 0.5 + h2 * 1.5,
      };
    });

    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false, pointerX = 0, pointerY = 0;

    const resize = () => {
      if (!container) return;
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      gl.canvas.style.width = w + 'px';
      gl.canvas.style.height = h + 'px';
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
    };
    window.addEventListener('resize', resize);
    resize();

    const onMove = e => {
      if (!enableMouseInteraction) return;
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * gl.canvas.width;
      pointerY = (1 - (e.clientY - rect.top) / rect.height) * gl.canvas.height;
    };
    const onEnter = () => { if (enableMouseInteraction) pointerInside = true; };
    const onLeave = () => { if (enableMouseInteraction) pointerInside = false; };
    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);

    const startTime = performance.now();
    let rafId;
    const update = t => {
      rafId = requestAnimationFrame(update);
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      ballParams.forEach((p, i) => {
        const dt = elapsed * speed * p.dtFactor;
        const th = p.st + dt;
        metaBallsUniform[i].set(
          Math.cos(th) * p.baseScale * clumpFactor,
          Math.sin(th + dt * p.toggle) * p.baseScale * clumpFactor,
          p.radius
        );
      });

      let tx, ty;
      if (pointerInside) { tx = pointerX; ty = pointerY; }
      else {
        tx = gl.canvas.width * 0.5 + Math.cos(elapsed * speed) * gl.canvas.width * 0.15;
        ty = gl.canvas.height * 0.5 + Math.sin(elapsed * speed) * gl.canvas.height * 0.15;
      }
      mouseBallPos.x += (tx - mouseBallPos.x) * hoverSmoothness;
      mouseBallPos.y += (ty - mouseBallPos.y) * hoverSmoothness;
      program.uniforms.iMouse.value.set(mouseBallPos.x, mouseBallPos.y, 0);

      renderer.render({ scene, camera });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointerleave', onLeave);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, cursorBallColor, speed, enableMouseInteraction, hoverSmoothness,
      animationSize, ballCount, clumpFactor, cursorBallSize, enableTransparency]);

  return <div ref={containerRef} className={`metaballs-container ${className}`} />;
};

export default MetaBalls;