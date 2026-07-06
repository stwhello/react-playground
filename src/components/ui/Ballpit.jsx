import { useEffect, useRef } from "react";
import {
  Vector3 as a,
  MeshPhysicalMaterial as c,
  InstancedMesh as d,
  Timer as e,
  AmbientLight as f,
  SphereGeometry as g,
  ShaderChunk as h,
  Scene as i,
  Color as l,
  Object3D as m,
  SRGBColorSpace as n,
  MathUtils as o,
  PMREMGenerator as p,
  Vector2 as r,
  WebGLRenderer as s,
  PerspectiveCamera as t,
  PointLight as u,
  ACESFilmicToneMapping as v,
  Plane as w,
  Raycaster as y,
} from "three";
import { RoomEnvironment as z } from "three/examples/jsm/environments/RoomEnvironment.js";

class ThreeApp {
  canvas;
  camera;
  cameraFov;
  scene;
  renderer;
  size = { width:0, height:0, wWidth:0, wHeight:0, ratio:0, pixelRatio:0 };
  onBeforeRender = () => {};
  onAfterRender = () => {};
  onAfterResize = () => {};
  #cfg;
  #visible = false;
  #running = false;
  #resizeTimeout;
  #resizeObserver;
  #intersectionObserver;
  #rafId;
  #clock = new e();
  #time = { elapsed: 0, delta: 0 };

  constructor(cfg) {
    this.#cfg = { ...cfg };
    this.camera = new t();
    this.cameraFov = this.camera.fov;
    this.scene = new i();
    this.canvas = this.#cfg.canvas;
    this.canvas.style.display = "block";
    this.renderer = new s({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    this.renderer.outputColorSpace = n;
    this.#initEvents();
  }

  #initEvents() {
    window.addEventListener("resize", this.#onResize.bind(this));
    if (this.#cfg.size === "parent" && this.canvas.parentNode) {
      this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
      this.#resizeObserver.observe(this.canvas.parentNode);
    }
    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.#visible = entries[0].isIntersecting;
        this.#visible ? this.#startLoop() : this.#stopLoop();
      },
      { threshold: 0 }
    );
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", () => {
      if (this.#visible) {
        document.hidden ? this.#stopLoop() : this.#startLoop();
      }
    });
  }

  #onResize() {
    if (this.#resizeTimeout) clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let w, h;
    if (this.#cfg.size === "parent" && this.canvas.parentNode) {
      w = this.canvas.parentNode.offsetWidth;
      h = this.canvas.parentNode.offsetHeight;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    if (!w || !h) return;
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.camera.isPerspectiveCamera) {
      const fovR = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fovR / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(dpr);
    this.size.pixelRatio = dpr;
    this.onAfterResize(this.size);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  #startLoop() {
    if (this.#running) return;
    this.#running = true;
    this.#clock.reset();
    const loop = () => {
      this.#rafId = requestAnimationFrame(loop);
      this.#clock.update();
      this.#time.delta = this.#clock.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
      this.onAfterRender(this.#time);
    };
    loop();
  }

  #stopLoop() {
    if (this.#running) {
      cancelAnimationFrame(this.#rafId);
      this.#running = false;
    }
  }

  clear() {
    this.scene.traverse((el) => {
      if (el.isMesh) {
        Object.keys(el.material).forEach((k) => {
          const val = el.material[k];
          if (val && typeof val.dispose === "function") val.dispose();
        });
        el.material.dispose();
        el.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    window.removeEventListener("resize", this.#onResize.bind(this));
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    this.#stopLoop();
    this.#clock.dispose();
    this.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

const pointerMap = new Map();
let globalListening = false;
const globalPos = new r();

function createPointer(cfg) {
  const state = {
    position: new r(),
    nPosition: new r(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...cfg,
  };
  pointerMap.set(cfg.domElement, state);
  if (!globalListening) {
    document.body.addEventListener("pointermove", onPointerMove);
    document.body.addEventListener("pointerleave", onPointerLeave);
    document.body.addEventListener("click", onPointerClick);
    document.body.addEventListener("touchstart", onTouchStart, { passive: false });
    document.body.addEventListener("touchmove", onTouchMove, { passive: false });
    document.body.addEventListener("touchend", onTouchEnd);
    globalListening = true;
  }
  state.dispose = () => {
    pointerMap.delete(cfg.domElement);
    if (pointerMap.size === 0) {
      document.body.removeEventListener("pointermove", onPointerMove);
      document.body.removeEventListener("pointerleave", onPointerLeave);
      document.body.removeEventListener("click", onPointerClick);
      document.body.removeEventListener("touchstart", onTouchStart);
      document.body.removeEventListener("touchmove", onTouchMove);
      document.body.removeEventListener("touchend", onTouchEnd);
      globalListening = false;
    }
  };
  return state;
}

function updatePos(x, y, st, rect) {
  st.position.set(x - rect.left, y - rect.top);
  st.nPosition.set(
    (st.position.x / rect.width) * 2 - 1,
    (-st.position.y / rect.height) * 2 + 1
  );
}
function inRect(rect) {
  return (
    globalPos.x >= rect.left &&
    globalPos.x <= rect.left + rect.width &&
    globalPos.y >= rect.top &&
    globalPos.y <= rect.top + rect.height
  );
}
function onPointerMove(e) {
  globalPos.set(e.clientX, e.clientY);
  for (const [el, st] of pointerMap) {
    const rect = el.getBoundingClientRect();
    if (inRect(rect)) {
      updatePos(e.clientX, e.clientY, st, rect);
      if (!st.hover) { st.hover = true; st.onEnter(st); }
      st.onMove(st);
    } else if (st.hover && !st.touching) {
      st.hover = false;
      st.onLeave(st);
    }
  }
}
function onPointerLeave() {
  for (const st of pointerMap.values()) {
    if (st.hover) { st.hover = false; st.onLeave(st); }
  }
}
function onPointerClick(e) {
  globalPos.set(e.clientX, e.clientY);
  for (const [el, st] of pointerMap) {
    const rect = el.getBoundingClientRect();
    updatePos(e.clientX, e.clientY, st, rect);
    if (inRect(rect)) st.onClick(st);
  }
}
function onTouchStart(e) {
  if (!e.touches.length) return;
  e.preventDefault();
  globalPos.set(e.touches[0].clientX, e.touches[0].clientY);
  for (const [el, st] of pointerMap) {
    const rect = el.getBoundingClientRect();
    if (inRect(rect)) {
      st.touching = true;
      updatePos(e.touches[0].clientX, e.touches[0].clientY, st, rect);
      if (!st.hover) { st.hover = true; st.onEnter(st); }
      st.onMove(st);
    }
  }
}
function onTouchMove(e) {
  if (!e.touches.length) return;
  e.preventDefault();
  globalPos.set(e.touches[0].clientX, e.touches[0].clientY);
  for (const [el, st] of pointerMap) {
    const rect = el.getBoundingClientRect();
    updatePos(e.touches[0].clientX, e.touches[0].clientY, st, rect);
    if (inRect(rect)) {
      if (!st.hover) { st.hover = true; st.touching = true; st.onEnter(st); }
      st.onMove(st);
    } else if (st.hover && st.touching) st.onMove(st);
  }
}
function onTouchEnd() {
  for (const st of pointerMap.values()) {
    if (st.touching) {
      st.touching = false;
      if (st.hover) { st.hover = false; st.onLeave(st); }
    }
  }
}

const { randFloat: k, randFloatSpread: E } = o;
const v1=new a(), v2=new a(), v3=new a(), v4=new a(), v5=new a(),
      v6=new a(), v7=new a(), v8=new a(), v9=new a(), v10=new a();

class Physics {
  constructor(cfg) {
    this.config = cfg;
    this.positionData = new Float32Array(3 * cfg.count).fill(0);
    this.velocityData = new Float32Array(3 * cfg.count).fill(0);
    this.sizeData = new Float32Array(cfg.count).fill(1);
    this.center = new a();
    this.#init();
    this.setSizes();
  }
  #init() {
    const { config: c, positionData: p } = this;
    this.center.toArray(p, 0);
    for (let i = 1; i < c.count; i++) {
      const b = 3 * i;
      p[b] = E(2 * c.maxX);
      p[b + 1] = E(2 * c.maxY);
      p[b + 2] = E(2 * c.maxZ);
    }
  }
  setSizes() {
    const { config: c, sizeData: s } = this;
    s[0] = c.size0;
    for (let i = 1; i < c.count; i++) s[i] = k(c.minSize, c.maxSize);
  }
  update(e) {
    const { config: cfg, center: ctr, positionData: pos, sizeData: sz, velocityData: vel } = this;
    let start = 0;
    if (cfg.controlSphere0) {
      start = 1;
      v1.fromArray(pos, 0); v1.lerp(ctr, 0.1).toArray(pos, 0);
      v4.set(0, 0, 0).toArray(vel, 0);
    }
    for (let i = start; i < cfg.count; i++) {
      const b = 3 * i;
      v2.fromArray(pos, b); v5.fromArray(vel, b);
      v5.y -= e.delta * cfg.gravity * sz[i];
      v5.multiplyScalar(cfg.friction);
      v5.clampLength(0, cfg.maxVelocity);
      v2.add(v5);
      v2.toArray(pos, b); v5.toArray(vel, b);
    }
    for (let i = start; i < cfg.count; i++) {
      const b = 3 * i;
      v2.fromArray(pos, b); v5.fromArray(vel, b);
      const ri = sz[i];
      for (let j = i + 1; j < cfg.count; j++) {
        const ob = 3 * j;
        v3.fromArray(pos, ob); v6.fromArray(vel, ob);
        const rj = sz[j];
        v7.copy(v3).sub(v2);
        const dist = v7.length(), sr = ri + rj;
        if (dist < sr) {
          const ov = sr - dist;
          v8.copy(v7).normalize().multiplyScalar(0.5 * ov);
          v9.copy(v8).multiplyScalar(Math.max(v5.length(), 1));
          v10.copy(v8).multiplyScalar(Math.max(v6.length(), 1));
          v2.sub(v8); v5.sub(v9); v2.toArray(pos, b); v5.toArray(vel, b);
          v3.add(v8); v6.add(v10); v3.toArray(pos, ob); v6.toArray(vel, ob);
        }
      }
      if (cfg.controlSphere0) {
        v7.copy(v1).sub(v2);
        const dist = v7.length(), sr0 = ri + sz[0];
        if (dist < sr0) {
          const diff = sr0 - dist;
          v8.copy(v7.normalize()).multiplyScalar(diff);
          v9.copy(v8).multiplyScalar(Math.max(v5.length(), 2));
          v2.sub(v8); v5.sub(v9);
        }
      }
      if (Math.abs(v2.x) + ri > cfg.maxX) { v2.x = Math.sign(v2.x) * (cfg.maxX - ri); v5.x = -v5.x * cfg.wallBounce; }
      if (cfg.gravity === 0) {
        if (Math.abs(v2.y) + ri > cfg.maxY) { v2.y = Math.sign(v2.y) * (cfg.maxY - ri); v5.y = -v5.y * cfg.wallBounce; }
      } else if (v2.y - ri < -cfg.maxY) { v2.y = -cfg.maxY + ri; v5.y = -v5.y * cfg.wallBounce; }
      const mb = Math.max(cfg.maxZ, cfg.maxSize);
      if (Math.abs(v2.z) + ri > mb) { v2.z = Math.sign(v2.z) * (cfg.maxZ - ri); v5.z = -v5.z * cfg.wallBounce; }
      v2.toArray(pos, b); v5.toArray(vel, b);
    }
  }
}

class SubsurfaceMaterial extends c {
  constructor(params) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    this.defines.USE_UV = "";
    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        "uniform float thicknessPower;uniform float thicknessScale;uniform float thicknessDistortion;uniform float thicknessAmbient;uniform float thicknessAttenuation;\n" +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        "void RE_Direct_Scattering(const in IncidentLight dl,const in vec2 uv,const in vec3 gPos,const in vec3 gNorm,const in vec3 gView,const in vec3 gCC,inout ReflectedLight rl){vec3 sh=normalize(dl.direction+(gNorm*thicknessDistortion));float sd=pow(saturate(dot(gView,-sh)),thicknessPower)*thicknessScale;#ifdef USE_COLOR\nvec3 si=(sd+thicknessAmbient)*vColor;\n#else\nvec3 si=(sd+thicknessAmbient)*diffuse;\n#endif\nrl.directDiffuse+=si*thicknessAttenuation*dl.color;}\nvoid main() {"
      );
      const rep = h.lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);"
      );
      shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", rep);
    };
  }
}

const DEFAULT_CFG = {
  count: 200, colors: [0, 0, 0], ambientColor: 16777215, ambientIntensity: 1,
  lightIntensity: 200, materialParams: { metalness: 0.5, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.15 },
  minSize: 0.5, maxSize: 1, size0: 1, gravity: 0.5, friction: 0.9975,
  wallBounce: 0.95, maxVelocity: 0.15, maxX: 5, maxY: 5, maxZ: 2,
  controlSphere0: false, followCursor: true,
};
const dummy = new m();

class BallpitMesh extends d {
  constructor(renderer, cfg = {}) {
    const config = { ...DEFAULT_CFG, ...cfg };
    const env = new p(renderer, 0.04).fromScene(new z()).texture;
    const mat = new SubsurfaceMaterial({ envMap: env, ...config.materialParams });
    mat.envMapRotation.x = -Math.PI / 2;
    super(new g(), mat, config.count);
    this.config = config;
    this.physics = new Physics(config);
    this.ambientLight = new f(config.ambientColor, config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new u(config.colors[0], config.lightIntensity);
    this.add(this.light);
    this.setColors(config.colors);
  }

  setColors(colors) {
    if (!Array.isArray(colors) || colors.length <= 1) return;
    const colorObjs = colors.map((c) => new l(c));
    const getAt = (ratio, out = new l()) => {
      const sc = Math.max(0, Math.min(1, ratio)) * (colors.length - 1);
      const idx = Math.floor(sc);
      if (idx >= colors.length - 1) return colorObjs[idx].clone();
      const alpha = sc - idx;
      const s = colorObjs[idx], e = colorObjs[idx + 1];
      out.r = s.r + alpha * (e.r - s.r);
      out.g = s.g + alpha * (e.g - s.g);
      out.b = s.b + alpha * (e.b - s.b);
      return out;
    };
    for (let i = 0; i < this.count; i++) {
      this.setColorAt(i, getAt(i / this.count));
      if (i === 0) this.light.color.copy(getAt(0));
    }
    this.instanceColor.needsUpdate = true;
  }

  update(e) {
    this.physics.update(e);
    for (let i = 0; i < this.count; i++) {
      dummy.position.fromArray(this.physics.positionData, 3 * i);
      dummy.scale.setScalar(i === 0 && !this.config.followCursor ? 0 : this.physics.sizeData[i]);
      dummy.updateMatrix();
      this.setMatrixAt(i, dummy.matrix);
      if (i === 0) this.light.position.copy(dummy.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas, cfg = {}) {
  const app = new ThreeApp({ canvas, size: "parent" });
  app.renderer.toneMapping = v;
  app.camera.position.set(0, 0, 20);
  app.camera.lookAt(0, 0, 0);
  app.resize();

  let mesh;

  function init(c) {
    if (mesh) { app.clear(); app.scene.remove(mesh); }
    mesh = new BallpitMesh(app.renderer, c);
    app.scene.add(mesh);
  }

  init(cfg);

  const raycaster = new y();
  const plane = new w(new a(0, 0, 1), 0);
  const point = new a();

  canvas.style.touchAction = "none";
  canvas.style.userSelect = "none";

  const pointer = createPointer({
    domElement: canvas,
    onMove() {
      raycaster.setFromCamera(pointer.nPosition, app.camera);
      app.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, point);
      mesh.physics.center.copy(point);
      mesh.config.controlSphere0 = true;
    },
    onLeave() { mesh.config.controlSphere0 = false; },
  });

  app.onBeforeRender = (e) => mesh.update(e);
  app.onAfterResize = (e) => {
    mesh.config.maxX = e.wWidth / 2;
    mesh.config.maxY = e.wHeight / 2;
  };

  return {
    app,
    get mesh() { return mesh; },
    dispose() { pointer.dispose(); app.dispose(); },
  };
}

const Ballpit = ({ className = "", followCursor = true, ...props }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    // Defer by one rAF so the browser lays out the canvas
    // before Three.js reads offsetWidth/Height for renderer size.
    let rafId = requestAnimationFrame(() => {
      if (!container.isConnected) return;
      instanceRef.current = createBallpit(canvas, { followCursor, ...props });
    });

    return () => {
      cancelAnimationFrame(rafId);
      instanceRef.current?.dispose();
      instanceRef.current = null;
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} />;
};

export default Ballpit;