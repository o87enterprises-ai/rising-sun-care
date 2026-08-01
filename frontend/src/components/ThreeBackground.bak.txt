import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function createCloud(x, y, z, scale, colorHex = 0xfff5e6, emissiveHex = 0xffaa55) {
  const group = new THREE.Group();
  const matCloud = new THREE.MeshStandardMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.5,
    roughness: 0.9,
    emissive: emissiveHex,
    emissiveIntensity: 0.08,
    side: THREE.DoubleSide,
  });
  const positions = [[0,0,0],[0.6,0.1,0.2],[-0.5,0.15,-0.1],[0.3,0.2,0.4],[-0.3,0.25,-0.3]];
  positions.forEach(pos => {
    const size = 0.3 + Math.random() * 0.5;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), matCloud);
    sphere.position.set(pos[0], pos[1], pos[2]);
    sphere.scale.y = 0.6;
    group.add(sphere);
  });
  group.position.set(x, y, z);
  group.scale.set(scale, scale, scale);
  return group;
}

function createChair(x, z) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), mat);
  seat.position.y = 0.2;
  seat.castShadow = true;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.05), mat);
  back.position.set(0, 0.45, -0.4);
  back.castShadow = true;
  g.add(back);
  g.position.set(x, -0.3, z);
  return g;
}

function createUmbrella(x, z) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x8d6e63 }));
  pole.position.y = 0.6;
  pole.castShadow = true;
  g.add(pole);
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.8 }));
  canopy.position.y = 1.2;
  canopy.castShadow = true;
  g.add(canopy);
  const stripe = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.8 }));
  stripe.position.y = 1.3;
  stripe.castShadow = true;
  g.add(stripe);
  g.position.set(0, -0.3, z);
  return g;
}

function createSilhouette(x, z) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 8), mat);
  body.position.y = 0.3;
  body.castShadow = true;
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mat);
  head.position.y = 0.7;
  head.castShadow = true;
  g.add(head);
  g.position.set(x, -0.3, z);
  return g;
}

function createYacht() {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.3, metalness: 0.2 });
  const hull = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.8), hullMat);
  hull.position.y = 0.2;
  hull.castShadow = true;
  g.add(hull);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0xe0d5c0, roughness: 0.6 });
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.6), cabinMat);
  cabin.position.set(-0.3, 0.6, 0);
  cabin.castShadow = true;
  g.add(cabin);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6), mastMat);
  mast.position.set(0.5, 1.2, 0);
  mast.castShadow = true;
  g.add(mast);
  const sailMat = new THREE.MeshStandardMaterial({ color: 0xfaf0e6, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
  const sail = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.4), sailMat);
  sail.position.set(0.5, 1.4, 0);
  sail.rotation.y = 0.1;
  sail.rotation.x = 0.1;
  sail.castShadow = true;
  g.add(sail);
  const sail2 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.0), sailMat);
  sail2.position.set(0.2, 1.1, 0.3);
  sail2.rotation.y = -0.2;
  sail2.rotation.x = 0.2;
  sail2.castShadow = true;
  g.add(sail2);
  const emblem = new THREE.Mesh(new THREE.CircleGeometry(0.15, 16), new THREE.MeshStandardMaterial({ color: 0xc9a96e, emissive: 0xc9a96e, emissiveIntensity: 0.2 }));
  emblem.position.set(0.5, 1.5, 0.01);
  g.add(emblem);
  g.position.set(0, -0.2, -4);
  g.rotation.y = 0.2;
  return g;
}

export default function ThreeBackground({ sceneIndex, transitionProgress }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const spaceGroupRef = useRef(null);
  const aboutGroupRef = useRef(null);
  const beachGroupRef = useRef(null);
  const contactGroupRef = useRef(null);
  const starsRef = useRef(null);
  const yachtRef = useRef(null);
  const oceanRef = useRef(null);
  const yachtOceanRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  const targetPositions = [
    { x: 0, y: 2, z: 10, target: [0,0,0] },
    { x: 0, y: 3.5, z: 8, target: [0,2,-3] },
    { x: 0, y: 3.5, z: 14, target: [0,-0.5,-8] },
    { x: 2, y: 2.5, z: 6, target: [0,0.5,-10] }
  ];
  const bgColors = [0x0b0a08, 0x4a90d9, 0x4a90d9, 0xff7f50];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0a08);
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, 2, 10);
    camera.lookAt(0,0,0);
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

    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);
    spaceGroupRef.current = spaceGroup;
    const starCount = 3000;
    const starPos = new Float32Array(starCount*3);
    for (let i=0; i<starCount; i++) {
      const r = 6 + Math.random()*15;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      starPos[i*3] = r*Math.sin(phi)*Math.cos(theta);
      starPos[i*3+1] = r*Math.sin(phi)*Math.sin(theta)*0.5;
      starPos[i*3+2] = r*Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starTex = (() => {
      const c = document.createElement('canvas');
      c.width=16; c.height=16;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(8,8,0,8,8,8);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.2, 'rgba(255,215,150,0.8)');
      g.addColorStop(1, 'rgba(255,215,150,0)');
      ctx.fillStyle = g; ctx.fillRect(0,0,16,16);
      return new THREE.CanvasTexture(c);
    })();
    const starMat = new THREE.PointsMaterial({ size: 0.12, map: starTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9, color: 0xccbbaa });
    const stars = new THREE.Points(starGeo, starMat);
    spaceGroup.add(stars);
    starsRef.current = stars;

    const aboutGroup = new THREE.Group();
    scene.add(aboutGroup);
    aboutGroupRef.current = aboutGroup;
    for (let i=0; i<40; i++) {
      const cloud = createCloud((Math.random()-0.5)*30, 1+Math.random()*5, (Math.random()-0.5)*20-4, 0.6+Math.random()*2.0, 0xffeedd, 0xffaa55);
      aboutGroup.add(cloud);
    }

    const beachGroup = new THREE.Group();
    scene.add(beachGroup);
    beachGroupRef.current = beachGroup;
    const oceanGeo = new THREE.PlaneGeometry(50, 50, 100, 100);
    oceanGeo.rotateX(-Math.PI/2);
    const oceanMat = new THREE.MeshPhysicalMaterial({ color: 0x1a6a8a, roughness: 0.2, metalness: 0.1, side: THREE.DoubleSide });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.set(0, -0.8, -8);
    ocean.receiveShadow = true;
    beachGroup.add(ocean);
    oceanRef.current = ocean;
    const islandGeo = new THREE.CylinderGeometry(3.5, 2.0, 0.4, 24);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0xd4b48c, roughness: 0.9 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, -0.5, -6);
    islandMesh.receiveShadow = true;
    islandMesh.castShadow = true;
    beachGroup.add(islandMesh);
    const grassGeo = new THREE.CylinderGeometry(3.3, 3.4, 0.1, 24);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x7cb342, roughness: 0.8 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.set(0, -0.3, -6);
    grass.receiveShadow = true;
    beachGroup.add(grass);
    beachGroup.add(createChair(-1.2, -5.2));
    beachGroup.add(createChair(1.2, -5.2));
    beachGroup.add(createUmbrella(0, -4.5));
    beachGroup.add(createSilhouette(-0.7, -5.8));
    beachGroup.add(createSilhouette(0.7, -5.8));

    const contactGroup = new THREE.Group();
    scene.add(contactGroup);
    contactGroupRef.current = contactGroup;
    const yachtOceanGeo = new THREE.PlaneGeometry(60, 60, 80, 80);
    yachtOceanGeo.rotateX(-Math.PI/2);
    const yachtOceanMat = new THREE.MeshPhysicalMaterial({ color: 0x1a4a6a, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
    const yachtOcean = new THREE.Mesh(yachtOceanGeo, yachtOceanMat);
    yachtOcean.position.set(0, -0.8, -10);
    contactGroup.add(yachtOcean);
    yachtOceanRef.current = yachtOcean;
    const yacht = createYacht();
    contactGroup.add(yacht);
    yachtRef.current = yacht;
    for (let i=0; i<30; i++) {
      const cloud = createCloud((Math.random()-0.5)*35, 1+Math.random()*5, (Math.random()-0.5)*25-6, 0.8+Math.random()*2.5, 0xffaa77, 0xff8844);
      contactGroup.add(cloud);
    }

    spaceGroup.visible = true;
    aboutGroup.visible = false;
    beachGroup.visible = false;
    contactGroup.visible = false;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      const delta = clockRef.current.getDelta();
      const elapsed = clockRef.current.getElapsedTime();
      if (starsRef.current) starsRef.current.rotation.y += delta * 0.002;
      [aboutGroup, contactGroup].forEach(group => {
        if (group.visible) {
          group.children.forEach(child => {
            if (child.isGroup && child.children.length > 0) {
              child.position.x += Math.sin(elapsed * 0.1 + child.id) * 0.002;
              child.position.z += Math.cos(elapsed * 0.08 + child.id) * 0.002;
            }
          });
        }
      });
      if (oceanRef.current && oceanRef.current.geometry.attributes.position) {
        const pos = oceanRef.current.geometry.attributes.position;
        for (let i=0; i<pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const y = 0.08 * Math.sin(x*1.2 + elapsed*0.6) * Math.cos(z*1.0 + elapsed*0.5);
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }
      if (yachtOceanRef.current && yachtOceanRef.current.geometry.attributes.position) {
        const pos = yachtOceanRef.current.geometry.attributes.position;
        for (let i=0; i<pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const y = 0.08 * Math.sin(x*1.2 + elapsed*0.6) * Math.cos(z*1.0 + elapsed*0.5);
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }
      if (yachtRef.current && contactGroup.visible) {
        yachtRef.current.rotation.z = 0.03 * Math.sin(elapsed * 0.3);
        yachtRef.current.position.y = 0.05 * Math.sin(elapsed * 0.5);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!scene || !camera) return;
    const fromIndex = Math.floor(sceneIndex);
    const toIndex = Math.min(fromIndex + 1, 3);
    const t = transitionProgress;
    const fromPos = targetPositions[fromIndex];
    const toPos = targetPositions[toIndex];
    const ease = t < 0.5 ? 2*t*t : -1 + (4-2*t)*t;
    const pos = {
      x: fromPos.x + (toPos.x - fromPos.x) * ease,
      y: fromPos.y + (toPos.y - fromPos.y) * ease,
      z: fromPos.z + (toPos.z - fromPos.z) * ease,
    };
    const target = [
      fromPos.target[0] + (toPos.target[0] - fromPos.target[0]) * ease,
      fromPos.target[1] + (toPos.target[1] - fromPos.target[1]) * ease,
      fromPos.target[2] + (toPos.target[2] - fromPos.target[2]) * ease,
    ];
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(target[0], target[1], target[2]);
    const bg1 = new THREE.Color(bgColors[fromIndex]);
    const bg2 = new THREE.Color(bgColors[toIndex]);
    scene.background = bg1.clone().lerp(bg2, ease);
    const groups = [spaceGroupRef.current, aboutGroupRef.current, beachGroupRef.current, contactGroupRef.current];
    if (t < 0.5) {
      groups.forEach((g, i) => { if (g) g.visible = i === fromIndex; });
    } else {
      groups.forEach((g, i) => { if (g) g.visible = i === toIndex; });
    }
  }, [sceneIndex, transitionProgress]);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}
