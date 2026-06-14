// ============================================================
// 3D SCENES MANAGER & WEBGL SYSTEMS (THREE.JS)
// ============================================================

// Procedural wave noise for liquid deformation
function getLiquidNoise(x, y, z, time) {
  let v = Math.sin(x * 1.8 + time * 1.2) * 0.15;
  v += Math.cos(y * 2.2 - time * 0.9) * 0.12;
  v += Math.sin(z * 2.0 + time * 1.5) * 0.10;
  v += Math.sin((x + y + z) * 1.1 + time * 0.7) * 0.08;
  return v;
}

// Build a highly detailed, embossed 3D Gold Bitcoin Coin
function create3DBtcCoin() {
  const coinGroup = new THREE.Group();

  // Premium reflective Gold material for outer rims and glyph
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xffd700,       // Bright pure gold
    metalness: 1.0,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    emissive: 0xd97706,    // Warm amber self-lighting
    emissiveIntensity: 0.12
  });

  // Matte gold backdrop insert for contrast
  const innerFaceMat = new THREE.MeshPhysicalMaterial({
    color: 0xe5a93b,       // Rich satin gold
    metalness: 0.90,
    roughness: 0.35,
    clearcoat: 0.2
  });

  // 1. Coin base body (Cylinder)
  const baseGeom = new THREE.CylinderGeometry(1.1, 1.1, 0.16, 64);
  baseGeom.rotateX(Math.PI / 2); // Orient flat faces along XY plane
  const baseMesh = new THREE.Mesh(baseGeom, goldMat);
  coinGroup.add(baseMesh);

  // 2. Inner disc face insert (slightly thinner but wider than glyph, provides contrast)
  const innerDiscGeom = new THREE.CylinderGeometry(0.96, 0.96, 0.18, 64);
  innerDiscGeom.rotateX(Math.PI / 2);
  const innerDisc = new THREE.Mesh(innerDiscGeom, innerFaceMat);
  coinGroup.add(innerDisc);

  // 3. Raised outer rims (Toruses on front/back)
  const rimFrontGeom = new THREE.TorusGeometry(1.02, 0.04, 16, 100);
  const rimFront = new THREE.Mesh(rimFrontGeom, goldMat);
  rimFront.position.z = 0.085;
  coinGroup.add(rimFront);

  const rimBackGeom = new THREE.TorusGeometry(1.02, 0.04, 16, 100);
  const rimBack = new THREE.Mesh(rimBackGeom, goldMat);
  rimBack.position.z = -0.085;
  coinGroup.add(rimBack);

  // 4. Decorative inner gold rings
  const innerRimFrontGeom = new THREE.TorusGeometry(0.85, 0.015, 8, 64);
  const innerRimFront = new THREE.Mesh(innerRimFrontGeom, goldMat);
  innerRimFront.position.z = 0.085;
  coinGroup.add(innerRimFront);

  const innerRimBackGeom = new THREE.TorusGeometry(0.85, 0.015, 8, 64);
  const innerRimBack = new THREE.Mesh(innerRimBackGeom, goldMat);
  innerRimBack.position.z = -0.085;
  coinGroup.add(innerRimBack);

  // 5. Add 32 tiny gold rivets around the face rim for cryptographic texture
  const rivetGeom = new THREE.SphereGeometry(0.02, 8, 8);
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const rx = Math.cos(angle) * 0.92;
    const ry = Math.sin(angle) * 0.92;
    
    // Front rivets
    const rivetF = new THREE.Mesh(rivetGeom, goldMat);
    rivetF.position.set(rx, ry, 0.085);
    coinGroup.add(rivetF);
    
    // Back rivets
    const rivetB = new THREE.Mesh(rivetGeom, goldMat);
    rivetB.position.set(rx, ry, -0.085);
    coinGroup.add(rivetB);
  }

  // 6. Add radial circuit board lines radiating on the coin face
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 8;
    const traceGeom = new THREE.BoxGeometry(0.4, 0.015, 0.01);
    
    // Front traces
    const traceF = new THREE.Mesh(traceGeom, goldMat);
    traceF.position.set(Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, 0.085);
    traceF.rotation.z = angle;
    coinGroup.add(traceF);
    
    // Back traces
    const traceB = new THREE.Mesh(traceGeom, goldMat);
    traceB.position.set(Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, -0.085);
    traceB.rotation.z = -angle; // Mirror trace angle
    coinGroup.add(traceB);
  }

  // Helper function to build a 3D Bitcoin glyph "₿"
  function createGlyph() {
    const glyphGroup = new THREE.Group();

    // Rotate clockwise by 14 degrees (approx 0.244 radians) for official branding tilt
    glyphGroup.rotation.z = -14 * Math.PI / 180;

    // Main vertical spine (left)
    const spineGeom = new THREE.BoxGeometry(0.15, 0.82, 0.08);
    const spine = new THREE.Mesh(spineGeom, goldMat);
    spine.position.set(-0.16, 0, 0.04);
    glyphGroup.add(spine);

    // Upper loop (Torus: R=0.18, tube=0.07, swept 180deg)
    const upperLoopGeom = new THREE.TorusGeometry(0.18, 0.07, 16, 64, Math.PI);
    const upperLoop = new THREE.Mesh(upperLoopGeom, goldMat);
    upperLoop.position.set(-0.06, 0.18, 0.04);
    upperLoop.rotation.z = -Math.PI / 2; // Orient loops on the right
    glyphGroup.add(upperLoop);

    // Lower loop (Torus: R=0.20, tube=0.07, swept 180deg)
    const lowerLoopGeom = new THREE.TorusGeometry(0.20, 0.07, 16, 64, Math.PI);
    const lowerLoop = new THREE.Mesh(lowerLoopGeom, goldMat);
    lowerLoop.position.set(-0.06, -0.19, 0.04);
    lowerLoop.rotation.z = -Math.PI / 2;
    glyphGroup.add(lowerLoop);

    // Top horizontal crossbar backing
    const topBarGeom = new THREE.BoxGeometry(0.18, 0.07, 0.08);
    const topBar = new THREE.Mesh(topBarGeom, goldMat);
    topBar.position.set(-0.06, 0.36, 0.04);
    glyphGroup.add(topBar);

    // Middle horizontal crossbar backing
    const midBarGeom = new THREE.BoxGeometry(0.18, 0.07, 0.08);
    const midBar = new THREE.Mesh(midBarGeom, goldMat);
    midBar.position.set(-0.06, -0.01, 0.04);
    glyphGroup.add(midBar);

    // Bottom horizontal crossbar backing
    const botBarGeom = new THREE.BoxGeometry(0.18, 0.07, 0.08);
    const botBar = new THREE.Mesh(botBarGeom, goldMat);
    botBar.position.set(-0.06, -0.38, 0.04);
    glyphGroup.add(botBar);

    // Vertical serif prongs (the lines sticking out top and bottom)
    // Left top prong
    const prongT1Geom = new THREE.BoxGeometry(0.065, 0.22, 0.08);
    const prongT1 = new THREE.Mesh(prongT1Geom, goldMat);
    prongT1.position.set(-0.05, 0.44, 0.04);
    glyphGroup.add(prongT1);

    // Right top prong
    const prongT2Geom = new THREE.BoxGeometry(0.065, 0.22, 0.08);
    const prongT2 = new THREE.Mesh(prongT2Geom, goldMat);
    prongT2.position.set(0.07, 0.44, 0.04);
    glyphGroup.add(prongT2);

    // Left bottom prong
    const prongB1Geom = new THREE.BoxGeometry(0.065, 0.22, 0.08);
    const prongB1 = new THREE.Mesh(prongB1Geom, goldMat);
    prongB1.position.set(-0.05, -0.45, 0.04);
    glyphGroup.add(prongB1);

    // Right bottom prong
    const prongB2Geom = new THREE.BoxGeometry(0.065, 0.22, 0.08);
    const prongB2 = new THREE.Mesh(prongB2Geom, goldMat);
    prongB2.position.set(0.07, -0.45, 0.04);
    glyphGroup.add(prongB2);

    return glyphGroup;
  }

  // Add front glyph
  const frontGlyph = createGlyph();
  frontGlyph.position.z = 0.05;
  coinGroup.add(frontGlyph);

  // Add back glyph in a Y-rotation wrapper to cleanly separate face flip from 14-degree tilt
  const backGlyphWrapper = new THREE.Group();
  const backGlyph = createGlyph();
  backGlyph.position.z = 0.05; // position forward relative to its wrapper
  backGlyphWrapper.add(backGlyph);
  
  backGlyphWrapper.rotation.y = Math.PI; // Flip 180 degrees
  coinGroup.add(backGlyphWrapper);

  return coinGroup;
}

// Initialize Hero Section Liquid Blob
function initHeroBlob() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.55); // Brighter ambient
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xd97706, 1.8); // Amber gold light
  mainLight.position.set(5, 5, 4);
  scene.add(mainLight);

  const fillLight = new THREE.PointLight(0x7c3aed, 2.5, 12); // Violet fill
  fillLight.position.set(-4, -3, 2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x0284c7, 3, 10); // Sky blue rim
  rimLight.position.set(0, 4, -2);
  scene.add(rimLight);

  const geometry = new THREE.SphereGeometry(1.25, 96, 96);
  const initialPositions = geometry.attributes.position.clone();

  // Glass Physical Material (Transparent Refractive Liquid Crystal)
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.08,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.52, // Refractive Index
    thickness: 1.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    attenuationColor: 0x0284c7,
    attenuationDistance: 0.6,
    transparent: true,
    opacity: 0.98
  });

  const blob = new THREE.Mesh(geometry, material);
  scene.add(blob);

  // Instantiate and add the 3D Gold Bitcoin coin inside the glass blob
  const coin = create3DBtcCoin();
  coin.scale.set(0.55, 0.55, 0.55);
  scene.add(coin);

  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    blob.rotation.x = time * 0.08 + mouse.y * 0.15;
    blob.rotation.y = time * 0.12 + mouse.x * 0.15;

    // Animate the inner gold coin: spin and wobble independently
    coin.rotation.y = time * 0.8;
    coin.rotation.x = Math.sin(time * 1.5) * 0.1;
    coin.rotation.z = Math.cos(time * 1.5) * 0.08;

    const positionAttribute = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    const noiseSpeed = 1.3 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.5;

    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(initialPositions, i);
      const noise = getLiquidNoise(vertex.x, vertex.y, vertex.z, time * noiseSpeed);
      const normal = vertex.clone().normalize();
      vertex.addScaledVector(normal, noise);
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
}

// Initialize 3D Computer System GPU Mining Core & Candlestick Scene
function initUniverseGalaxy() {
  const canvas = document.getElementById('universe-3d-canvas');
  if (!canvas) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 4.5, 11);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Controls (Drag to rotate, scroll to zoom)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // Restrict camera crossing ground
  controls.minDistance = 3.5;
  controls.maxDistance = 16;

  // Lighting (Adjusted for dark cyber theme)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambientLight);

  // Glowing GPU Fan Light
  const gpuLight = new THREE.PointLight(0x10b981, 3.5, 12);
  gpuLight.position.set(0, -0.2, 0.8);
  scene.add(gpuLight);

  // Holographic Bitcoin Source Light (placed in front of the 3D coin to light the face)
  const btcLight = new THREE.PointLight(0xf59e0b, 5, 10);
  btcLight.position.set(0, 1.8, 1.8);
  scene.add(btcLight);

  // Cyber backlighting to capture edge highlights
  const btcBackLight = new THREE.PointLight(0x06b6d4, 4, 8);
  btcBackLight.position.set(0, 1.8, -1.8);
  scene.add(btcBackLight);

  // Cyber space accent lights
  const rimLight1 = new THREE.DirectionalLight(0x06b6d4, 1.8);
  rimLight1.position.set(3, 4, 3);
  scene.add(rimLight1);

  const rimLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.2);
  rimLight2.position.set(-3, 2, -3);
  scene.add(rimLight2);

  // Main Group
  const miningGroup = new THREE.Group();
  scene.add(miningGroup);

  // 1. Motherboard PCB Base
  const pcbGeom = new THREE.BoxGeometry(8, 0.15, 8);
  const pcbMat = new THREE.MeshPhysicalMaterial({
    color: 0x080c14,
    metalness: 0.6,
    roughness: 0.7,
    clearcoat: 0.5
  });
  const pcbBoard = new THREE.Mesh(pcbGeom, pcbMat);
  pcbBoard.position.y = -1.1;
  miningGroup.add(pcbBoard);

  // --- 2. GPU GRAPHICS CARD MINING RIG ---
  const gpuRig = new THREE.Group();
  gpuRig.position.set(0, -0.6, 0);
  gpuRig.rotation.x = -Math.PI / 7; // Tilt GPU forward slightly for fan visibility
  miningGroup.add(gpuRig);

  // GPU Shroud
  const shroudGeom = new THREE.BoxGeometry(4.2, 1.4, 0.5);
  const shroudMat = new THREE.MeshPhysicalMaterial({
    color: 0x111827,
    metalness: 0.85,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  const gpuShroud = new THREE.Mesh(shroudGeom, shroudMat);
  gpuShroud.userData = { name: "ASIC GPU Mining Card", type: "GPU" };
  gpuRig.add(gpuShroud);

  // GPU Glowing Accent Plates (RGB backplate)
  const rgbPlateGeom = new THREE.BoxGeometry(4.22, 0.1, 0.52);
  const rgbPlateMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.9
  });
  const rgbPlate = new THREE.Mesh(rgbPlateGeom, rgbPlateMat);
  rgbPlate.position.y = 0.65;
  gpuRig.add(rgbPlate);

  // Cooling Fan Bases and Blades
  const fanBladeGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.05, 32);
  fanBladeGeom.rotateX(Math.PI / 2); // Rotate face front

  const fanMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    metalness: 0.9,
    roughness: 0.35,
    clearcoat: 0.8
  });

  // Cooling Fan 1 (Left)
  const fan1 = new THREE.Mesh(fanBladeGeom, fanMat);
  fan1.position.set(-1.0, 0, 0.28);
  gpuRig.add(fan1);

  // Cooling Fan 2 (Right)
  const fan2 = new THREE.Mesh(fanBladeGeom, fanMat);
  fan2.position.set(1.0, 0, 0.28);
  gpuRig.add(fan2);

  // Add hub centers to fans
  const hubGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
  hubGeom.rotateX(Math.PI / 2);
  const hubMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  
  const hub1 = new THREE.Mesh(hubGeom, hubMat);
  hub1.position.set(-1.0, 0, 0.31);
  gpuRig.add(hub1);

  const hub2 = new THREE.Mesh(hubGeom, hubMat);
  hub2.position.set(1.0, 0, 0.31);
  gpuRig.add(hub2);

  // --- 3. ANIMATED 3D TRADING CANDLESTICKS ---
  const candlesGroup = new THREE.Group();
  miningGroup.add(candlesGroup);

  const candleData = [
    { x: -3.2, z: 0.5, green: true,  baseVal: 1.2 },
    { x: -2.7, z: -0.8, green: false, baseVal: 0.9 },
    { x: -2.2, z: 1.0, green: true,  baseVal: 1.5 },
    { x: -1.7, z: -0.2, green: true,  baseVal: 0.8 },
    { x: 1.7,  z: -0.5, green: false, baseVal: 1.1 },
    { x: 2.2,  z: 0.8, green: true,  baseVal: 1.6 },
    { x: 2.7,  z: -1.0, green: false, baseVal: 1.4 },
    { x: 3.2,  z: 0.3, green: false, baseVal: 0.7 }
  ];

  const candles = [];

  candleData.forEach((cData, index) => {
    const candle = new THREE.Group();
    candle.position.set(cData.x, -1.0, cData.z);
    
    // Main Body Box
    const bodyGeom = new THREE.BoxGeometry(0.25, 1.0, 0.25);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: cData.green ? 0x10b981 : 0xef4444, // Green / Red
      emissive: cData.green ? 0x10b981 : 0xef4444,
      emissiveIntensity: 0.15,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.y = 0.5; // Offset pivot to bottom
    bodyMesh.userData = { name: cData.green ? "Bullish Candle" : "Bearish Candle", type: "Candle", green: cData.green };
    candle.add(bodyMesh);

    // Wick (Line Cylinder through center)
    const wickGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: cData.green ? 0x10b981 : 0xef4444 });
    const wickMesh = new THREE.Mesh(wickGeom, wickMat);
    wickMesh.position.y = 0.5;
    candle.add(wickMesh);

    candlesGroup.add(candle);
    candles.push({
      group: candle,
      body: bodyMesh,
      wick: wickMesh,
      baseVal: cData.baseVal,
      speed: 1.2 + Math.random() * 1.5,
      offset: Math.random() * Math.PI
    });
  });

  // --- 4. FLOATING HOLOGRAPHIC GOLD BITCOIN ---
  const btcHologram = create3DBtcCoin();
  btcHologram.position.set(0, 1.8, 0);
  btcHologram.userData = { name: "Holographic Bitcoin Target", type: "BTC" };

  // Tag all meshes in the group so we can resolve intersections back to btcHologram
  btcHologram.traverse((child) => {
    if (child.isMesh) {
      child.userData.parentGroup = btcHologram;
    }
  });

  miningGroup.add(btcHologram);

  // Holographic Data Orbit Rings (Around Bitcoin)
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  const ringGeom1 = new THREE.RingGeometry(1.4, 1.5, 64);
  ringGeom1.rotateX(-Math.PI / 2);
  const orbitRing1 = new THREE.Mesh(ringGeom1, ringMat1);
  orbitRing1.position.set(0, 1.8, 0);
  miningGroup.add(orbitRing1);

  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.18
  });
  const ringGeom2 = new THREE.RingGeometry(1.8, 1.85, 64);
  ringGeom2.rotateX(-Math.PI / 2);
  const orbitRing2 = new THREE.Mesh(ringGeom2, ringMat2);
  orbitRing2.position.set(0, 1.8, 0);
  miningGroup.add(orbitRing2);

  // --- 5. RISING HASH PARTICLE STREAMS ---
  const particleCount = 180;
  const particlesGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);

  const palette = [
    new THREE.Color('#10b981'), // Green
    new THREE.Color('#06b6d4')  // Cyan
  ];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 1.5; // Wider cylindrical exhaust
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = -0.5 + Math.random() * 2.3; // Y spread
    positions[i * 3 + 2] = Math.sin(angle) * r;

    speeds[i] = 0.012 + Math.random() * 0.02; // Speed multiplier

    const c = palette[Math.floor(Math.random() * palette.length)];
    particleColors[i * 3] = c.r;
    particleColors[i * 3 + 1] = c.g;
    particleColors[i * 3 + 2] = c.b;
  }

  particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const dataStreams = new THREE.Points(particlesGeom, particlesMat);
  miningGroup.add(dataStreams);

  // Raycasting for mouse interactions
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredObject = null;

  const tooltip = document.getElementById('universe-tooltip');
  const tName = document.getElementById('tooltip-name');
  const tPair = document.getElementById('tooltip-pair');
  const tPrice = document.getElementById('tooltip-price');

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    // Place tooltip relative to mouse cursor
    if (tooltip && tooltip.style.display === 'block') {
      tooltip.style.left = (e.clientX + 15) + 'px';
      tooltip.style.top = (e.clientY - 15) + 'px';
    }
  });

  // Click handler to zoom onto hovered component
  window.addEventListener('click', () => {
    if (hoveredObject) {
      if (window.AudioSynth) window.AudioSynth.playClick();

      const targetPos = new THREE.Vector3();
      hoveredObject.getWorldPosition(targetPos);
      
      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.2,
        onUpdate: () => controls.update()
      });

      gsap.to(camera.position, {
        x: targetPos.x + 0.8,
        y: targetPos.y + 0.8,
        z: targetPos.z + 2.2,
        duration: 1.2,
        onUpdate: () => controls.update()
      });
    } else {
      // Zoom back out to default focus
      gsap.to(controls.target, {
        x: 0,
        y: 0.3,
        z: 0,
        duration: 1.2,
        onUpdate: () => controls.update()
      });
      gsap.to(camera.position, {
        x: 0,
        y: 4.5,
        z: 11,
        duration: 1.2,
        onUpdate: () => controls.update()
      });
    }
  });

  // Animation render loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Pulse GPU shroud lights
    rgbPlate.material.emissiveIntensity = 0.5 + Math.sin(time * 3.5) * 0.35;

    // Rotate GPU Fans
    fan1.rotation.z = -time * 12.0; // Rapid rotation
    fan2.rotation.z = -time * 12.0;

    // Spin, float, and wobble Bitcoin coin (wobble/precession)
    btcHologram.rotation.y = time * 0.8;
    btcHologram.rotation.x = Math.sin(time * 1.6) * 0.15;
    btcHologram.rotation.z = Math.cos(time * 1.6) * 0.12;
    btcHologram.position.y = 1.8 + Math.sin(time * 2.0) * 0.08;

    // Rotate orbit rings
    orbitRing1.rotation.z = time * 0.22;
    orbitRing1.position.y = btcHologram.position.y;
    orbitRing2.rotation.z = -time * 0.15;
    orbitRing2.position.y = btcHologram.position.y;

    // Animate 3D Trading Candlesticks (dynamic scale rise and fall)
    candles.forEach((c) => {
      const scaleY = c.baseVal + Math.sin(time * c.speed + c.offset) * 0.45;
      c.body.scale.y = scaleY;
      c.body.position.y = scaleY / 2; // Keep base anchored on PCB board
      
      // Update wicks accordingly
      c.wick.scale.y = 1.0 + Math.sin(time * c.speed + c.offset) * 0.25;
      c.wick.position.y = scaleY / 2;
    });

    // Update rising data particles
    const posArr = dataStreams.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3 + 1] += speeds[i]; // Move upwards

      // Reset when reaching Bitcoin coin height
      if (posArr[i * 3 + 1] > btcHologram.position.y) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.5;
        posArr[i * 3] = Math.cos(angle) * r;
        posArr[i * 3 + 1] = -0.5; // GPU heights
        posArr[i * 3 + 2] = Math.sin(angle) * r;
      }
    }
    dataStreams.geometry.attributes.position.needsUpdate = true;

    // Slow rotation of entire mining platform
    miningGroup.rotation.y = time * 0.035;

    // Update damping controls
    controls.update();

    // Raycast check intersections
    raycaster.setFromCamera(mouse, camera);
    
    // Check shroud and candles (recursive = true to traverse inside the 3D coin group)
    const interactables = [gpuShroud, btcHologram];
    candles.forEach(c => interactables.push(c.body));

    const intersects = raycaster.intersectObjects(interactables, true);

    if (intersects.length > 0) {
      let targetObj = intersects[0].object;
      
      // Resolve mesh pieces back to the main coin group
      if (targetObj.userData.parentGroup) {
        targetObj = targetObj.userData.parentGroup;
      }
      
      if (hoveredObject !== targetObj) {
        hoveredObject = targetObj;

        // Trigger hover sound
        if (window.AudioSynth) window.AudioSynth.playHover();

        // Print details to tooltip
        if (tooltip) {
          tooltip.style.display = 'block';
          
          if (hoveredObject.userData.type === "GPU") {
            tName.textContent = hoveredObject.userData.name;
            tPair.textContent = "FAN SYSTEM: 3200 RPM";
            
            const tempVal = document.getElementById('mining-temp');
            tPrice.textContent = tempVal ? `TEMP: ${tempVal.textContent}` : "TEMP: 68.20 °C";
            tPrice.style.color = "#10b981"; // Green
            tooltip.style.borderColor = "#10b981";
            tooltip.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(16, 185, 129, 0.12)`;
          } else if (hoveredObject.userData.type === "BTC") {
            tName.textContent = hoveredObject.userData.name;
            tPair.textContent = "TARGET BLOCK SYNCHRONOUS";
            
            const blockVal = document.getElementById('mining-blocks');
            tPrice.textContent = blockVal ? `SOLVED BLOCKS: ${blockVal.textContent}` : "SOLVED BLOCKS: 142";
            tPrice.style.color = "#f59e0b"; // Gold
            tooltip.style.borderColor = "#f59e0b";
            tooltip.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.12)`;
          } else if (hoveredObject.userData.type === "Candle") {
            tName.textContent = hoveredObject.userData.name;
            tPair.textContent = hoveredObject.userData.green ? "BULLISH MARKET CONFLUENCE" : "BEARISH MARKET CONFLUENCE";
            tPrice.textContent = hoveredObject.userData.green ? "▲ BUY SETUP" : "▼ SELL SETUP";
            tPrice.style.color = hoveredObject.userData.green ? "#10b981" : "#ef4444";
            tooltip.style.borderColor = hoveredObject.userData.green ? "#10b981" : "#ef4444";
            tooltip.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px ${hoveredObject.userData.green ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'}`;
          }
        }
        document.body.style.cursor = 'pointer';
      }
    } else {
      if (hoveredObject) {
        hoveredObject = null;
        if (tooltip) tooltip.style.display = 'none';
        document.body.style.cursor = 'none';
      }
    }

    renderer.render(scene, camera);
  }

  // Handle resizing
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
}

// Kickoff
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initHeroBlob();
    initUniverseGalaxy();
  }, 100);
});
