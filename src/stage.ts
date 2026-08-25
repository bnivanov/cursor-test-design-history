import * as THREE from "three";
import { assertNever } from "./brand.ts";
import { resolveRole, type TokenSet } from "./language.ts";
import type {
  CameraVocab,
  GeometryKind,
  SceneMotion,
  SceneProgram,
  StageOutput,
} from "./scene.ts";

export type StageHandle = {
  readonly replace: (program: SceneProgram, tokens: TokenSet) => void;
  readonly dispose: () => void;
};

function color(tokens: TokenSet, role: SceneProgram["material"]): THREE.Color {
  return new THREE.Color(resolveRole(tokens, role));
}

function cameraFor(
  vocab: CameraVocab,
  aspect: number,
): THREE.Camera {
  switch (vocab.kind) {
    case "ortho": {
      const z = vocab.zoom;
      const cam = new THREE.OrthographicCamera(-z, z, z / aspect, -z / aspect, 0.1, 80);
      cam.position.set(0, 0, 12);
      return cam;
    }
    case "perspective": {
      const cam = new THREE.PerspectiveCamera(vocab.fov, aspect, 0.1, 80);
      cam.position.set(0, 0, 8);
      return cam;
    }
    case "hero-tilt": {
      const cam = new THREE.PerspectiveCamera(vocab.fov, aspect, 0.1, 80);
      cam.position.set(3.2, 2.4, 7);
      cam.lookAt(0, 0, 0);
      return cam;
    }
    default: {
      const _exhaustive: never = vocab;
      return assertNever(_exhaustive);
    }
  }
}

function meshMat(tokens: TokenSet, program: SceneProgram): THREE.Material {
  const c = color(tokens, program.material);
  const kind = program.geometry.kind;
  if (kind === "glass-planes") {
    return new THREE.MeshPhysicalMaterial({
      color: c,
      transparent: true,
      opacity: 0.38,
      roughness: 0.12,
      metalness: 0.2,
      transmission: 0.55,
      thickness: 0.4,
    });
  }
  if (kind === "chrome-orb") {
    return new THREE.MeshStandardMaterial({
      color: c,
      metalness: 1,
      roughness: 0.12,
    });
  }
  if (kind === "wire-lattice" || kind === "raw-box") {
    return new THREE.MeshBasicMaterial({ color: c, wireframe: kind === "wire-lattice" });
  }
  return new THREE.MeshStandardMaterial({
    color: c,
    metalness: 0.18,
    roughness: 0.42,
  });
}

function buildGeometry(kind: GeometryKind, mat: THREE.Material): THREE.Object3D {
  const group = new THREE.Group();
  switch (kind.kind) {
    case "raw-box": {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.8, 0.2), mat);
      group.add(mesh);
      return group;
    }
    case "sprite-grid": {
      const w = kind.columns;
      const h = kind.rows;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.28), mat);
          badge.position.set((x - (w - 1) / 2) * 0.85, ((h - 1) / 2 - y) * 0.45, 0);
          group.add(badge);
        }
      }
      return group;
    }
    case "bevel-blocks": {
      for (let i = 0; i < kind.count; i += 1) {
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 0.55, 0.2 * kind.depth),
          mat,
        );
        mesh.position.set((i % 3) * 1.3 - 1.3, Math.floor(i / 3) * 0.8 - 0.8, i * 0.05);
        group.add(mesh);
      }
      return group;
    }
    case "ribbon": {
      const curve = new THREE.CatmullRomCurve3(
        Array.from({ length: 12 }, (_, i) => {
          const t = (i / 11) * Math.PI * 2 * kind.turns;
          return new THREE.Vector3(Math.cos(t) * 2.2, (i / 11) * 3 - 1.5, Math.sin(t) * 2.2);
        }),
      );
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.12, 12, false), mat);
      group.add(mesh);
      return group;
    }
    case "paper-layers": {
      for (let i = 0; i < kind.layers; i += 1) {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4), mat);
        mesh.position.set(i * 0.12, i * 0.08, -i * 0.2);
        mesh.rotation.z = (i - 2) * 0.04;
        group.add(mesh);
      }
      return group;
    }
    case "glass-planes": {
      for (let i = 0; i < kind.layers; i += 1) {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.1), mat);
        mesh.position.set((i - 1.5) * 0.35, (i - 1.5) * 0.2, -i * 0.4);
        mesh.rotation.y = (i - 1.5) * 0.18;
        group.add(mesh);
      }
      return group;
    }
    case "wire-lattice": {
      const d = kind.divisions;
      const cell = 4 / d;
      for (let i = 0; i <= d; i += 1) {
        const x = -2 + i * cell;
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.02, 4, 0.02), mat);
        v.position.set(x, 0, 0);
        const hline = new THREE.Mesh(new THREE.BoxGeometry(4, 0.02, 0.02), mat);
        hline.position.set(0, -2 + i * cell, 0);
        group.add(v, hline);
      }
      return group;
    }
    case "glyph-field": {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 140px Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(kind.text, 256, 128);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 2),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
      );
      group.add(mesh);
      return group;
    }
    case "colliding-slabs": {
      for (let i = 0; i < kind.count; i += 1) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.1), mat);
        mesh.position.set((i - 3) * 0.35, (i - 3) * 0.22, 0);
        mesh.rotation.z = i * 0.22;
        mesh.rotation.y = i * 0.08;
        group.add(mesh);
      }
      return group;
    }
    case "elevation-cards": {
      for (let i = 0; i < kind.count; i += 1) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 0.08), mat);
        mesh.position.set(i * 0.35 - 0.4, i * 0.25, i * 0.4);
        group.add(mesh);
      }
      return group;
    }
    case "chrome-orb": {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 32), mat);
      group.add(mesh);
      return group;
    }
    case "chat-panels": {
      for (let i = 0; i < kind.count; i += 1) {
        const w = i % 2 === 0 ? 2.6 : 2.1;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.45, 0.06), mat);
        mesh.position.set(i % 2 === 0 ? -0.4 : 0.6, 1.4 - i * 0.55, 0);
        group.add(mesh);
      }
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 24, 16),
        mat,
      );
      orb.position.set(2.4, -0.2, 0.6);
      group.add(orb);
      return group;
    }
    default: {
      const _exhaustive: never = kind;
      return assertNever(_exhaustive);
    }
  }
}

function tickMotion(object: THREE.Object3D, motion: SceneMotion, t: number): void {
  switch (motion.kind) {
    case "none":
      return;
    case "drift":
      object.rotation.y = t * motion.speed * 0.15;
      return;
    case "spin":
      object.rotation.x = t * motion.speed * 0.12;
      object.rotation.y = t * motion.speed * 0.2;
      return;
    case "parallax":
      object.rotation.y = Math.sin(t * 0.6) * (motion.strength * 0.02);
      object.rotation.x = Math.cos(t * 0.4) * (motion.strength * 0.01);
      return;
    case "pulse": {
      const s = 1 + Math.sin(t * motion.speed) * 0.06;
      object.scale.set(s, s, s);
      return;
    }
    default: {
      const _exhaustive: never = motion;
      assertNever(_exhaustive);
    }
  }
}

export function createStage(canvas: HTMLCanvasElement): StageHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const light = new THREE.DirectionalLight(0xffffff, 1.4);
  light.position.set(4, 6, 8);
  scene.add(light, new THREE.AmbientLight(0xffffff, 0.45));
  let camera: THREE.Camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  let content = new THREE.Group();
  scene.add(content);
  let motion: SceneMotion = { kind: "none" };
  let raf = 0;
  let start = performance.now();

  const resize = (): void => {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    const aspect = w / h;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
    if (camera instanceof THREE.OrthographicCamera) {
      const z = 4;
      camera.left = -z * aspect;
      camera.right = z * aspect;
      camera.top = z;
      camera.bottom = -z;
      camera.updateProjectionMatrix();
    }
  };

  const loop = (now: number): void => {
    const t = (now - start) / 1000;
    tickMotion(content, motion, t);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  raf = requestAnimationFrame(loop);

  return {
    replace(program, tokens) {
      scene.remove(content);
      content.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          for (const item of mats) {
            item.dispose();
          }
        }
      });
      const mat = meshMat(tokens, program);
      content = buildGeometry(program.geometry, mat) as THREE.Group;
      scene.add(content);
      const rect = canvas.getBoundingClientRect();
      camera = cameraFor(program.camera, Math.max(rect.width / Math.max(rect.height, 1), 0.2));
      scene.background = new THREE.Color(tokens.bg);
      motion = program.motion;
      start = performance.now();
    },
    dispose() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      renderer.dispose();
    },
  };
}

export function paintStill(
  host: HTMLElement,
  output: Extract<StageOutput, { kind: "still" }>,
): void {
  host.replaceChildren();
  host.className = "still";
  host.setAttribute("role", "img");
  host.setAttribute("aria-label", output.still.alt);
  for (const mark of output.still.marks) {
    const el = document.createElement("span");
    el.className = `mark mark-${mark.kind}`;
    el.style.color = resolveRole(output.tokens, mark.color);
    switch (mark.kind) {
      case "word":
        el.textContent = mark.text;
        el.style.left = `${mark.x}%`;
        el.style.top = `${mark.y}%`;
        break;
      case "shape":
        el.dataset.shape = mark.shape;
        el.style.left = `${mark.x}%`;
        el.style.top = `${mark.y}%`;
        el.style.background = resolveRole(output.tokens, mark.color);
        break;
      case "pattern":
        el.dataset.pattern = mark.pattern;
        el.style.backgroundColor = resolveRole(output.tokens, mark.color);
        break;
      default: {
        const _exhaustive: never = mark;
        assertNever(_exhaustive);
      }
    }
    host.append(el);
  }
}
