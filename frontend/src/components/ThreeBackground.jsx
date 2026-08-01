import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// ---- Helpers ----
function lerp(a, b, t) { return a + (b - a) * t; }

function lerpColor(c1, c2, t) {
  const col = new THREE.Color();
  col.r = lerp(c1.r, c2.r, t);
  col.g = lerp(c1.g, c2.g, t);
  col.b = lerp(c1.b, c2.b, t);
  return col;
}

function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

// ---- Scene object creators ----
function createCloud(x, y, z, scale = 1, opacity = 0.8) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: opacity,
    roughness: 0.9,
    metalness: 0,
  });
  const positions = [
    [0, 0, 0, 0.5],
    [-0.5, 0.1, 0.1, 0.35],
    [0.5, 0.05, -0.1, 0.4],
    [-0.2, 0.2, -0.15, 0.3],
    [0.3, 0.15, 0.15, 0.3],
    [-0.3, -0.05, 0.2, 0.25],
    [0.4, -0.05, -0.2, 0.25],
  ];
  for (const [px, py, pz, r] of positions) {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), mat);
    sphere.position.set(px, py, pz);
    sphere.scale.set(1, 0.6, 0.8);
    group.add(sphere);
  }
  group.position.set(x, y, z);
  group.scale.set(scale, scale, scale);
  return group;
}

function createGazebo(x, y, z, scale = 1) {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7, metalness: 0.1 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.8, metalness: 0.05 });
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.3 * scale, 1.3 * scale, 0.08 * scale, 16), woodMat);
  floor.position.y = 0.04 * scale;
  floor.receiveShadow = true;
  floor.castShadow = true;
  group.add(floor);
  const pillarPos = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const r = 1.15 * scale;
    pillarPos.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  }
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 });
  for (const [px, py] of pillarPos) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * scale, 0.08 * scale, 1.0 * scale, 8), pillarMat);
    pillar.position.set(px, 0.5 * scale, py);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    group.add(pillar);
  }
  const railMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.7 });
  for (let i = 0; i < 6; i++) {
    const a1 = (i / 6) * Math.PI * 2;
    const a2 = ((i + 1) / 6) * Math.PI * 2;
    const r = 1.15 * scale;
    const p1 = [Math.cos(a1) * r, Math.sin(a1) * r];
    const p2 = [Math.cos(a2) * r, Math.sin(a2) * r];
    const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const dist = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
    const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    for (let h = 0; h < 2; h++) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(dist, 0.04 * scale, 0.04 * scale), railMat);
      rail.position.set(mid[0], 0.25 * scale + h * 0.4 * scale, mid[1]);
      rail.rotation.y = -angle;
      rail.castShadow = true;
      group.add(rail);
    }
  }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.6 * scale, 0.6 * scale, 16), roofMat);
  roof.position.y = 1.0 * scale + 0.3 * scale;
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);
  const tipMat = new THREE.MeshStandardMaterial({ color: 0xf5a623, metalness: 0.3, roughness: 0.4 });
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06 * scale, 8, 8), tipMat);
  tip.position.y = 1.0 * scale + 0.6 * scale;
  group.add(tip);
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xbc8f8f, roughness: 0.9, side: THREE.BackSide });
  const ceil = new THREE.Mesh(new THREE.CircleGeometry(1.2 * scale, 16), ceilMat);
  ceil.position.y = 1.0 * scale + 0.05 * scale;
  ceil.rotation.x = -Math.PI / 2;
  group.add(ceil);
  for (let i = 0; i < 6; i++) {
    const a1 = (i / 6) * Math.PI * 2;
    const a2 = ((i + 1) / 6) * Math.PI * 2;
    const r = 1.15 * scale;
    const archPoints = [];
    for (let s = 0; s <= 10; s++) {
      const t = s / 10;
      const angleA = lerp(a1, a2, t);
      const rad = 1.15 * scale + 0.05 * scale * Math.sin(t * Math.PI);
      const px = Math.cos(angleA) * rad;
      const pz = Math.sin(angleA) * rad;
      const py = 0.2 * scale + 0.6 * scale * Math.sin(t * Math.PI);
      archPoints.push(new THREE.Vector3(px, py, pz));
    }
    const curve = new THREE.CatmullRomCurve3(archPoints);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 12, 0.025 * scale, 6, false),
      new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.6 })
    );
    tube.castShadow = true;
    group.add(tube);
  }
  group.position.set(x, y, z);
  return group;
}

function createChair(x, z, rotY = 0) {
  const g = new THREE.Group();
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), seatMat);
  seat.position.y = 0.2;
  seat.castShadow = true;
  seat.receiveShadow = true;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.04), seatMat);
  back.position.set(0, 0.38, -0.25);
  back.castShadow = true;
  g.add(back);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
  for (let dx of [-0.2, 0.2]) {
    for (let dz of [-0.2, 0.2]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 6), legMat);
      leg.position.set(dx, 0.09, dz);
      leg.castShadow = true;
      g.add(leg);
    }
  }
  g.position.set(x, -0.1, z);
  g.rotation.y = rotY;
  return g;
}

function createUmbrella(x, z) {
  const g = new THREE.Group();
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.9, 8), poleMat);
  pole.position.y = 0.45;
  pole.castShadow = true;
  g.add(pole);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.8 });
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.5, 8), canopyMat);
  canopy.position.y = 0.9;
  canopy.castShadow = true;
  g.add(canopy);
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.8 });
  const stripe = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.3, 8), stripeMat);
  stripe.position.y = 1.0;
  stripe.castShadow = true;
  g.add(stripe);
  g.position.set(x, -0.1, z);
  return g;
}

function createSilhouette(x, z, scale = 1) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.2 * scale, 0.55 * scale, 8), bodyMat);
  body.position.y = 0.28 * scale;
  body.castShadow = true;
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 8, 8), bodyMat);
  head.position.y = 0.65 * scale;
  head.castShadow = true;
  g.add(head);
  const armMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  for (let side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * scale, 0.035 * scale, 0.35 * scale, 6), armMat);
    arm.position.set(side * 0.22 * scale, 0.35 * scale, 0);
    arm.rotation.z = side * 0.3;
    arm.castShadow = true;
    g.add(arm);
  }
  g.position.set(x, -0.1, z);
  return g;
}

function createPalm(x, z, scale = 1) {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.9 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.07 * scale, 0.8 * scale, 8), trunkMat);
  trunk.position.y = 0.4 * scale;
  trunk.castShadow = true;
  g.add(trunk);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.3;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.25 * scale, 0.5 * scale, 6), leafMat);
    leaf.position.set(Math.cos(angle) * 0.2 * scale, 0.8 * scale + 0.1 * scale, Math.sin(angle) * 0.2 * scale);
    leaf.rotation.z = Math.cos(angle) * 0.5;
    leaf.rotation.x = Math.sin(angle) * 0.5;
    leaf.castShadow = true;
    g.add(leaf);
  }
  g.position.set(x, -0.1, z);
  return g;
}

function createYacht(x, y, z, scale = 1) {
  const group = new THREE.Group();
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 });
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7, metalness: 0.1 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 });
  const hullShape = new THREE.Shape();
  const hl = 2.8 * scale;
  hullShape.moveTo(-hl / 2, 0);
  hullShape.quadraticCurveTo(-hl / 2 + 0.2 * scale, 0.3 * scale, 0, 0.4 * scale);
  hullShape.quadraticCurveTo(hl / 2 - 0.2 * scale, 0.3 * scale, hl / 2, 0);
  hullShape.quadraticCurveTo(hl / 2 - 0.2 * scale, -0.15 * scale, 0, -0.15 * scale);
  hullShape.quadraticCurveTo(-hl / 2 + 0.2 * scale, -0.15 * scale, -hl / 2, 0);
  const extrudeSettings = {
    depth: 0.5 * scale,
    bevelEnabled: true,
    bevelThickness: 0.05 * scale,
    bevelSize: 0.03 * scale,
    bevelSegments: 4,
  };
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.position.set(0, -0.1 * scale, -0.25 * scale);
  hull.rotation.x = 0.05;
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const deckMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.9 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.2 * scale, 0.04 * scale, 0.9 * scale), deckMat);
  deck.position.set(0, 0.25 * scale, -0.25 * scale);
  deck.castShadow = true;
  deck.receiveShadow = true;
  group.add(deck);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.8 * scale, 0.35 * scale, 0.6 * scale), whiteMat);
  cabin.position.set(0.3 * scale, 0.45 * scale, -0.25 * scale);
  cabin.castShadow = true;
  group.add(cabin);

  const roofCabin = new THREE.Mesh(new THREE.BoxGeometry(0.9 * scale, 0.05 * scale, 0.7 * scale), darkMat);
  roofCabin.position.set(0.3 * scale, 0.63 * scale, -0.25 * scale);
  roofCabin.castShadow = true;
  group.add(roofCabin);

  const winMat = new THREE.MeshBasicMaterial({ color: 0xffdd77, transparent: true, opacity: 0.6 });
  for (let wx of [-0.1, 0.2, 0.5]) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.12 * scale, 0.1 * scale), winMat);
    win.position.set(wx + 0.3 * scale, 0.45 * scale, -0.55 * scale);
    win.rotation.y = 0.05;
    group.add(win);
  }

  const fly = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 0.2 * scale, 0.4 * scale), whiteMat);
  fly.position.set(-0.4 * scale, 0.5 * scale, -0.25 * scale);
  fly.castShadow = true;
  group.add(fly);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.015 * scale, 0.025 * scale, 0.9 * scale, 6), darkMat);
  mast.position.set(-0.8 * scale, 0.6 * scale, -0.25 * scale);
  mast.castShadow = true;
  group.add(mast);

  const flagMat = new THREE.MeshStandardMaterial({ color: 0xf5a623, side: THREE.DoubleSide });
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.2 * scale, 0.12 * scale), flagMat);
  flag.position.set(-0.8 * scale + 0.02 * scale, 1.0 * scale, -0.25 * scale);
  flag.rotation.y = -0.2;
  group.add(flag);

  const railMat2 = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5, roughness: 0.3 });
  for (let side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.0 * scale, 0.03 * scale, 0.02 * scale), railMat2);
    rail.position.set(0, 0.35 * scale, side * 0.5 * scale - 0.25 * scale);
    group.add(rail);
    for (let vx = -0.9 * scale; vx <= 0.9 * scale; vx += 0.3 * scale) {
      const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.01 * scale, 0.01 * scale, 0.2 * scale, 4), railMat2);
      vert.position.set(vx, 0.25 * scale, side * 0.5 * scale - 0.25 * scale);
      group.add(vert);
    }
  }

  const lightMat = new THREE.MeshBasicMaterial({ color: 0x00ff44 });
  const bowLight = new THREE.Mesh(new THREE.SphereGeometry(0.04 * scale, 6, 6), lightMat);
  bowLight.position.set(1.4 * scale, 0.3 * scale, -0.25 * scale);
  group.add(bowLight);

  const sternLight = new THREE.Mesh(new THREE.SphereGeometry(0.04 * scale, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xff4444 }));
  sternLight.position.set(-1.4 * scale, 0.3 * scale, -0.25 * scale);
  group.add(sternLight);

  group.position.set(x, y, z);
  return group;
}

// ---- Main Component ----
export default function ThreeBackground({ sceneIndex, transitionProgress }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const spaceGroupRef = useRef(null);
  const skyGroupRef = useRef(null);
  const beachGroupRef = useRef(null);
  const yachtGroupRef = useRef(null);
  const moonRef = useRef(null);
  const moonMatRef = useRef(null);
  // Store scene groups in a ref so they are stable and accessible
  const sceneGroupsRef = useRef([]);

  // Scene configuration – stable across renders
  const sceneBgColors = [
    new THREE.Color(0x0b0a08),
    new THREE.Color(0x4a90d9),
    new THREE.Color(0x1a6a8a),
    new THREE.Color(0x1a3a5a),
  ];
  const camPositions = [
    { pos: new THREE.Vector3(0, 1.8, 8), target: new THREE.Vector3(0, 0, 0), fov: 45 },
    { pos: new THREE.Vector3(0, 1.5, 6), target: new THREE.Vector3(0, 0.5, -2), fov: 50 },
    { pos: new THREE.Vector3(0, 1.2, 11), target: new THREE.Vector3(0, 0.2, -4.5), fov: 42 },
    { pos: new THREE.Vector3(0, 0.8, 7), target: new THREE.Vector3(0, 1.5, -3), fov: 48 },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- Scene setup ----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0a08);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.8, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ---- Lights ----
    const ambient = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambient);
    const sunLight = new THREE.PointLight(0xffd580, 2.0, 25);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);
    const warmLight = new THREE.DirectionalLight(0xffaa55, 0.0);
    warmLight.position.set(1, 2, -3);
    scene.add(warmLight);

    // ---- Scene 1: Space (Home) ----
    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);
    spaceGroupRef.current = spaceGroup;

    // Sun
    const sunColor = new THREE.Color(0xf5a623);
    const sunGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const sunMat = new THREE.MeshStandardMaterial({
      color: sunColor,
      emissive: sunColor,
      emissiveIntensity: 1.2,
      roughness: 0.3,
      metalness: 0.1,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 0, 0);
    sunMesh.castShadow = true;
    spaceGroup.add(sunMesh);

    const glowGeo = new THREE.SphereGeometry(1.3, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(0, 0, 0);
    spaceGroup.add(glowMesh);

    // Moon
    const moonRadius = 0.6;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 48, 48);
    const moonMat = new THREE.ShaderMaterial({
      uniforms: {
        uPhase: { value: 0.0 },
        uMoonColor: { value: new THREE.Color(0.95, 0.92, 0.88) },
        uShadowColor: { value: new THREE.Color(0.05, 0.05, 0.08) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uPhase;
        uniform vec3 uMoonColor;
        uniform vec3 uShadowColor;
        varying vec3 vNormal;
        void main() {
          float angle = uPhase * 2.0 * 3.1415926;
          vec3 lightDir = normalize(vec3(cos(angle), sin(angle), 0.0));
          float illumination = 0.5 + 0.5 * dot(vNormal, lightDir);
          vec3 color = mix(uShadowColor, uMoonColor, illumination);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    const orbitRadius = 3.8;
    moon.position.set(orbitRadius, 0, 0);
    spaceGroup.add(moon);
    moonRef.current = moon;
    moonMatRef.current = moonMat;

    // Stars
    const starCount = 2500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 6 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starTex = (() => {
      const c = document.createElement('canvas');
      c.width = 16;
      c.height = 16;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.2, 'rgba(255,215,150,0.8)');
      g.addColorStop(1, 'rgba(255,215,150,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(c);
    })();
    const starMat = new THREE.PointsMaterial({
      size: 0.12,
      map: starTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
      color: 0xccbbaa,
    });
    const stars = new THREE.Points(starGeo, starMat);
    spaceGroup.add(stars);

    // ---- Scene 2: Sky (About) ----
    const skyGroup = new THREE.Group();
    scene.add(skyGroup);
    skyGroupRef.current = skyGroup;

    const skyDomeGeo = new THREE.SphereGeometry(25, 32, 32);
    const skyDomeMat = new THREE.MeshBasicMaterial({
      color: 0x4a90d9,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.0,
    });
    const skyDome = new THREE.Mesh(skyDomeGeo, skyDomeMat);
    skyDome.position.set(0, 0, 0);
    skyGroup.add(skyDome);

    const skySunGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const skySunMat = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      transparent: true,
      opacity: 0.0,
    });
    const skySun = new THREE.Mesh(skySunGeo, skySunMat);
    skySun.position.set(0, 1.5, -3);
    skyGroup.add(skySun);

    const skyGlowGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const skyGlowMat = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide,
    });
    const skyGlow = new THREE.Mesh(skyGlowGeo, skyGlowMat);
    skyGlow.position.copy(skySun.position);
    skyGroup.add(skyGlow);

    // Clouds for sky scene
    const cloudPositions = [
      [-6, 1.8, -2, 1.2],
      [-3.5, 2.0, -2.5, 1.0],
      [-1.5, 1.6, -3, 1.4],
      [1.0, 1.9, -2.2, 1.1],
      [3.5, 1.7, -2.8, 1.3],
      [5.5, 2.1, -1.8, 1.0],
      [7.5, 1.5, -2.5, 1.2],
      [-5.0, 0.8, -4, 0.9],
      [-2.0, 0.6, -4.5, 1.1],
      [2.0, 0.7, -4.2, 1.0],
      [5.0, 0.9, -4.0, 0.9],
      [0.0, 1.2, -5, 1.5],
      [-7.0, 1.0, -3, 1.0],
      [7.0, 1.0, -3.5, 1.0],
    ];
    for (const [cx, cy, cz, cs] of cloudPositions) {
      const c = createCloud(cx, cy, cz, cs, 0.0);
      skyGroup.add(c);
    }

    // ---- Scene 3: Beach (Services) ----
    const beachGroup = new THREE.Group();
    scene.add(beachGroup);
    beachGroupRef.current = beachGroup;

    const oceanGeo = new THREE.PlaneGeometry(45, 45, 80, 80);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a6a8a,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 1,
      envMapIntensity: 0.5,
      side: THREE.DoubleSide,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.set(0, -0.5, -5);
    ocean.receiveShadow = true;
    beachGroup.add(ocean);

    const islandGeo = new THREE.CylinderGeometry(3.5, 1.8, 0.5, 32);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0xd4b48c, roughness: 0.9, metalness: 0 });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.set(0, -0.3, -5);
    island.receiveShadow = true;
    island.castShadow = true;
    beachGroup.add(island);

    const grassGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.12, 32);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x7cb342, roughness: 0.8 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.set(0, -0.05, -5);
    grass.receiveShadow = true;
    beachGroup.add(grass);

    const gazebo = createGazebo(0, -0.1, -5, 1.0);
    beachGroup.add(gazebo);

    beachGroup.add(createChair(-1.2, -4.2, 0.3));
    beachGroup.add(createChair(1.2, -4.2, -0.3));
    beachGroup.add(createUmbrella(0, -3.2));
    beachGroup.add(createSilhouette(-0.5, -3.8, 1));
    beachGroup.add(createSilhouette(0.5, -3.9, 1));
    beachGroup.add(createPalm(-2.2, -4.5, 0.8));
    beachGroup.add(createPalm(2.2, -4.5, 0.8));

    // ---- Scene 4: Yacht (Contact) ----
    const yachtGroup = new THREE.Group();
    scene.add(yachtGroup);
    yachtGroupRef.current = yachtGroup;

    const yachtOceanGeo = new THREE.PlaneGeometry(60, 40, 60, 60);
    yachtOceanGeo.rotateX(-Math.PI / 2);
    const yachtOceanMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a3a5a,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const yachtOcean = new THREE.Mesh(yachtOceanGeo, yachtOceanMat);
    yachtOcean.position.set(0, -0.5, 0);
    yachtOcean.receiveShadow = true;
    yachtGroup.add(yachtOcean);

    // Elevated sunset sun
    const sunsetSunGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sunsetSunMat = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      transparent: true,
      opacity: 0.0,
    });
    const sunsetSun = new THREE.Mesh(sunsetSunGeo, sunsetSunMat);
    sunsetSun.position.set(0, 2.5, -12);
    yachtGroup.add(sunsetSun);

    const sunsetGlowGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const sunsetGlowMat = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide,
    });
    const sunsetGlow = new THREE.Mesh(sunsetGlowGeo, sunsetGlowMat);
    sunsetGlow.position.copy(sunsetSun.position);
    yachtGroup.add(sunsetGlow);

    const yacht = createYacht(0, -0.2, -3.5, 1.0);
    yachtGroup.add(yacht);

    // Distant clouds for yacht scene
    for (let i = 0; i < 5; i++) {
      const cx = (Math.random() - 0.5) * 15;
      const cy = 1.0 + Math.random() * 1.5;
      const cz = -6 - Math.random() * 4;
      const c = createCloud(cx, cy, cz, 0.5 + Math.random() * 0.8, 0.0);
      yachtGroup.add(c);
    }

    // ---- Store all groups in ref ----
    const allGroups = [spaceGroup, skyGroup, beachGroup, yachtGroup];
    sceneGroupsRef.current = allGroups;

    // ---- Initial visibility ----
    spaceGroup.visible = true;
    skyGroup.visible = false;
    beachGroup.visible = false;
    yachtGroup.visible = false;

    // ---- Resize handler ----
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ---- Animation loop ----
    let moonAngle = 0;
    let prevTime = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - prevTime) / 1000;
      prevTime = now;

      // Animate moon
      moonAngle += 0.005;
      if (moonRef.current) {
        moonRef.current.position.set(
          Math.cos(moonAngle) * orbitRadius,
          Math.sin(moonAngle * 0.3) * 0.8,
          Math.sin(moonAngle) * orbitRadius * 0.7
        );
        moonRef.current.lookAt(0, 0, 0);
        if (moonMatRef.current) {
          moonMatRef.current.uniforms.uPhase.value = (Math.sin(moonAngle * 0.5) + 1) * 0.5;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // ---- Cleanup ----
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ---- Effect for scene transitions ----
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const sceneGroups = sceneGroupsRef.current;
    if (!scene || !camera || sceneGroups.length === 0) return;

    // ----- SAFETY CHECKS -----
    // Ensure sceneIndex is a valid number between 0 and 3
    const safeIndex = (typeof sceneIndex === 'number' && !isNaN(sceneIndex) && sceneIndex >= 0)
      ? Math.min(Math.floor(sceneIndex), sceneGroups.length - 1)
      : 0;
    // Ensure transitionProgress is a number between 0 and 1
    const safeProgress = (typeof transitionProgress === 'number' && !isNaN(transitionProgress))
      ? Math.min(Math.max(transitionProgress, 0), 1)
      : 0;

    const fromIdx = safeIndex;
    const toIdx = Math.min(fromIdx + 1, sceneGroups.length - 1);
    const interp = safeProgress;

    // ----- Camera interpolation -----
    const camA = camPositions[fromIdx];
    const camB = camPositions[toIdx];
    // Should never be undefined now, but just in case
    if (!camA || !camB) return;

    const pos = new THREE.Vector3().lerpVectors(camA.pos, camB.pos, interp);
    const target = new THREE.Vector3().lerpVectors(camA.target, camB.target, interp);
    const fov = lerp(camA.fov, camB.fov, interp);

    camera.position.copy(pos);
    camera.lookAt(target);
    camera.fov = fov;
    camera.updateProjectionMatrix();

    // ----- Background color -----
    const bgA = sceneBgColors[fromIdx];
    const bgB = sceneBgColors[toIdx];
    const bg = lerpColor(bgA, bgB, interp);
    scene.background = bg;

    // ----- Scene visibility crossfade -----
    for (let i = 0; i < sceneGroups.length; i++) {
      const group = sceneGroups[i];
      let opacity = 0;
      if (i === fromIdx) {
        opacity = 1 - interp * 0.9;
      } else if (i === toIdx) {
        opacity = interp * 0.9;
      }
      opacity = clamp(opacity, 0, 1);

      group.visible = opacity > 0.001;
      if (group.visible) {
        group.children.forEach(child => {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => { m.opacity = opacity * (m.userData?.baseOpacity || 1); });
            } else {
              child.material.opacity = opacity * (child.material.userData?.baseOpacity || 1);
            }
          }
        });
      }
    }

    // ----- Update sun light position -----
    const sunLight = scene.children.find(c => c.isPointLight);
    if (sunLight) {
      if (fromIdx === 0) {
        sunLight.position.set(0, 0, 0);
        sunLight.intensity = 2.0;
      } else if (fromIdx === 1) {
        sunLight.position.set(0, 1.5, -3);
        sunLight.intensity = 1.5;
      } else if (fromIdx === 2) {
        sunLight.position.set(0, 2, -5);
        sunLight.intensity = 1.8;
      } else {
        sunLight.position.set(0, 2.5, -12);
        sunLight.intensity = 1.2;
      }
    }
  }, [sceneIndex, transitionProgress]);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}