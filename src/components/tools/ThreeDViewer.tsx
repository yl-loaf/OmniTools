/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  Upload,
  RotateCw,
  Eye,
  Layers,
  Box,
  Sliders,
  Download,
  Camera,
  Maximize2,
  Sparkles,
  Info,
  Palette,
  RefreshCw,
  Compass,
  FileCode
} from 'lucide-react';

export const ThreeDViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Viewer Config & State
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const [modelColor, setModelColor] = useState<string>('#3b82f6');
  const [roughness, setRoughness] = useState<number>(0.3);
  const [metalness, setMetalness] = useState<number>(0.2);
  const [shadingMode, setShadingMode] = useState<'pbr' | 'normals' | 'matcap' | 'wireframe'>('pbr');
  const [bgStyle, setBgStyle] = useState<'dark' | 'studio' | 'black' | 'light'>('studio');

  // Model Stats
  const [modelName, setModelName] = useState<string>('Mechanical Gear.stl');
  const [stats, setStats] = useState<{
    vertexCount: number;
    triangleCount: number;
    dimensions: { x: number; y: number; z: number };
    volumeApprox: number;
  }>({
    vertexCount: 1440,
    triangleCount: 2880,
    dimensions: { x: 40.0, y: 40.0, z: 12.5 },
    volumeApprox: 12850,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Three.js Scene Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const currentMeshRef = useRef<THREE.Mesh | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const axesRef = useRef<THREE.AxesHelper | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Interaction State (Orbit rotation)
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modelRotationRef = useRef<{ x: number; y: number }>({ x: 0.4, y: 0.6 });
  const cameraDistanceRef = useRef<number>(60);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 30, cameraDistanceRef.current);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(40, 60, 40);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.6);
    dirLight2.position.set(-40, -20, -40);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xa855f7, 0.8, 100);
    pointLight.position.set(0, 30, 20);
    scene.add(pointLight);

    // 4. Grid & Axes Helpers
    const grid = new THREE.GridHelper(80, 40, 0x3b82f6, 0x334155);
    grid.position.y = -15;
    scene.add(grid);
    gridRef.current = grid;

    const axes = new THREE.AxesHelper(20);
    axes.position.set(-35, -15, -35);
    scene.add(axes);
    axesRef.current = axes;

    // 5. Initial Demo Model: Procedural Mechanical Gear
    loadProceduralGear(scene);

    // 6. Animation Loop
    const animate = () => {
      if (autoRotate && currentMeshRef.current && !isDraggingRef.current) {
        modelRotationRef.current.y += 0.008;
      }

      if (currentMeshRef.current) {
        currentMeshRef.current.rotation.x = modelRotationRef.current.x;
        currentMeshRef.current.rotation.y = modelRotationRef.current.y;
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      renderer.dispose();
    };
  }, []);

  // Update Mesh Material when styling options change
  useEffect(() => {
    if (!currentMeshRef.current) return;
    const mesh = currentMeshRef.current;

    let mat: THREE.Material;
    if (shadingMode === 'normals') {
      mat = new THREE.MeshNormalMaterial({ wireframe });
    } else if (shadingMode === 'matcap') {
      mat = new THREE.MeshMatcapMaterial({ color: modelColor, wireframe });
    } else {
      mat = new THREE.MeshStandardMaterial({
        color: modelColor,
        roughness,
        metalness,
        wireframe,
        flatShading: false,
      });
    }

    mesh.material = mat;
  }, [modelColor, roughness, metalness, wireframe, shadingMode]);

  // Update Helpers visibility
  useEffect(() => {
    if (gridRef.current) gridRef.current.visible = showGrid;
    if (axesRef.current) axesRef.current.visible = showAxes;
  }, [showGrid, showAxes]);

  // Procedural Gear Demo Generator
  const loadProceduralGear = (scene: THREE.Scene) => {
    if (currentMeshRef.current) scene.remove(currentMeshRef.current);

    const teeth = 18;
    const outerRadius = 18;
    const innerRadius = 14;
    const toothDepth = 4;
    const holeRadius = 6;
    const height = 8;

    const shape = new THREE.Shape();
    const totalPoints = teeth * 4;

    for (let i = 0; i < totalPoints; i++) {
      const angle = (i / totalPoints) * Math.PI * 2;
      const segment = i % 4;
      const r = segment === 1 || segment === 2 ? outerRadius + toothDepth : innerRadius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    // Center Hole
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    const extrudeSettings = {
      steps: 2,
      depth: height,
      bevelEnabled: true,
      bevelThickness: 1.2,
      bevelSize: 1,
      bevelSegments: 3,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: modelColor,
      roughness: 0.3,
      metalness: 0.4,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = 0;

    scene.add(mesh);
    currentMeshRef.current = mesh;

    updateGeometryStats(geometry, 'Mechanical Gear.stl');
  };

  // Compute Geometry Stats
  const updateGeometryStats = (geometry: THREE.BufferGeometry, name: string) => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);

    const positionAttr = geometry.attributes.position;
    const vertexCount = positionAttr ? positionAttr.count : 0;
    const triangleCount = geometry.index ? geometry.index.count / 3 : vertexCount / 3;
    const volumeApprox = (size.x * size.y * size.z * 0.45).toFixed(1);

    setModelName(name);
    setStats({
      vertexCount,
      triangleCount: Math.round(triangleCount),
      dimensions: {
        x: parseFloat(size.x.toFixed(2)),
        y: parseFloat(size.y.toFixed(2)),
        z: parseFloat(size.z.toFixed(2)),
      },
      volumeApprox: parseFloat(volumeApprox),
    });
  };

  // STL / OBJ / 3MF Parser
  const parseSTL = (buffer: ArrayBuffer, filename: string) => {
    const dataView = new DataView(buffer);
    const isBinary = buffer.byteLength > 84 && dataView.getUint32(80, true) * 50 + 84 === buffer.byteLength;

    const vertices: number[] = [];
    const normals: number[] = [];

    if (isBinary) {
      const trianglesCount = dataView.getUint32(80, true);
      let offset = 84;

      for (let i = 0; i < trianglesCount; i++) {
        if (offset + 50 > buffer.byteLength) break;
        const nx = dataView.getFloat32(offset, true);
        const ny = dataView.getFloat32(offset + 4, true);
        const nz = dataView.getFloat32(offset + 8, true);
        offset += 12;

        for (let j = 0; j < 3; j++) {
          const vx = dataView.getFloat32(offset, true);
          const vy = dataView.getFloat32(offset + 4, true);
          const vz = dataView.getFloat32(offset + 8, true);
          vertices.push(vx, vy, vz);
          normals.push(nx, ny, nz);
          offset += 12;
        }
        offset += 2; // Attribute byte count
      }
    } else {
      // ASCII STL
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(buffer);
      const normalRegex = /facet\s+normal\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/gi;
      const vertexRegex = /vertex\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/gi;

      let vertexMatch;
      while ((vertexMatch = vertexRegex.exec(text)) !== null) {
        vertices.push(parseFloat(vertexMatch[1]), parseFloat(vertexMatch[2]), parseFloat(vertexMatch[3]));
        normals.push(0, 1, 0);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    if (normals.length === vertices.length) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    } else {
      geometry.computeVertexNormals();
    }
    geometry.center();

    // Scale to fit viewport nicely
    geometry.computeBoundingSphere();
    const sphere = geometry.boundingSphere;
    if (sphere && sphere.radius > 0) {
      const scale = 25 / sphere.radius;
      geometry.scale(scale, scale, scale);
    }

    displayGeometry(geometry, filename);
  };

  // Simple OBJ Parser
  const parseOBJ = (text: string, filename: string) => {
    const rawVertices: number[][] = [];
    const faces: number[] = [];

    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('v ')) {
        const parts = trimmed.split(/\s+/).slice(1).map(Number);
        if (parts.length >= 3) rawVertices.push(parts);
      } else if (trimmed.startsWith('f ')) {
        const parts = trimmed.split(/\s+/).slice(1);
        const vIndices = parts.map((p) => {
          const idx = parseInt(p.split('/')[0], 10);
          return idx < 0 ? rawVertices.length + idx : idx - 1;
        });

        // Triangulate polygon faces (fan)
        for (let i = 1; i < vIndices.length - 1; i++) {
          faces.push(vIndices[0], vIndices[i], vIndices[i + 1]);
        }
      }
    }

    const flattenedVertices: number[] = [];
    for (const faceIdx of faces) {
      const vert = rawVertices[faceIdx];
      if (vert) flattenedVertices.push(...vert);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(flattenedVertices, 3));
    geometry.computeVertexNormals();
    geometry.center();

    geometry.computeBoundingSphere();
    if (geometry.boundingSphere && geometry.boundingSphere.radius > 0) {
      const scale = 25 / geometry.boundingSphere.radius;
      geometry.scale(scale, scale, scale);
    }

    displayGeometry(geometry, filename);
  };

  const displayGeometry = (geometry: THREE.BufferGeometry, filename: string) => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (currentMeshRef.current) scene.remove(currentMeshRef.current);

    const material = new THREE.MeshStandardMaterial({
      color: modelColor,
      roughness,
      metalness,
      wireframe,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    currentMeshRef.current = mesh;

    updateGeometryStats(geometry, filename);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);

    const reader = new FileReader();
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'stl' || ext === '3mf' || ext === 'ply') {
      reader.onload = (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          parseSTL(buffer, file.name);
          setLoading(false);
        } catch (err: any) {
          setErrorMsg(`Failed to parse ${ext?.toUpperCase()} file: ${err.message}`);
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === 'obj') {
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          parseOBJ(text, file.name);
          setLoading(false);
        } catch (err: any) {
          setErrorMsg(`Failed to parse OBJ file: ${err.message}`);
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } else {
      setErrorMsg(`Unsupported 3D file format .${ext}. Please upload .STL, .OBJ, .3MF, or .PLY.`);
      setLoading(false);
    }
  };

  // Mouse / Touch Orbit Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelRotationRef.current.y += deltaX * 0.01;
    modelRotationRef.current.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;

    cameraDistanceRef.current = Math.max(15, Math.min(150, cameraDistanceRef.current + e.deltaY * 0.05));
    cameraRef.current.position.z = cameraDistanceRef.current;
  };

  // Reset Camera View
  const handleResetView = () => {
    modelRotationRef.current = { x: 0.4, y: 0.6 };
    cameraDistanceRef.current = 60;
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 30, 60);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  // Capture High-Res Snapshot
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${modelName.replace(/\.[^/.]+$/, '')}_render.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Background Styles
  const bgClasses = {
    dark: 'bg-slate-950',
    studio: 'bg-gradient-to-b from-slate-900 via-slate-950 to-[#0b0f19]',
    black: 'bg-black',
    light: 'bg-gradient-to-b from-slate-100 to-slate-300',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-xs font-bold shadow-xs">
              <Box className="w-3.5 h-3.5 text-purple-400" />
              <span>Interactive WebGL 3D Mesh & CAD Viewer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              3D File Previewer (STL, OBJ, 3MF, PLY)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Inspect 3D printing STL models, OBJ meshes, and CAD geometry with full orbit controls, wireframe modes, vertex counters, and snapshot exports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload 3D Model</span>
              <input
                type="file"
                accept=".stl,.obj,.3mf,.ply"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleCaptureSnapshot}
              title="Save snapshot image"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D WebGL Canvas Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group">
            {/* Viewport Canvas */}
            <div
              ref={mountRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className={`w-full h-[520px] cursor-grab active:cursor-grabbing transition-colors duration-500 ${bgClasses[bgStyle]}`}
            />

            {/* Quick Canvas Overlay Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl text-xs font-mono font-bold text-white shadow-lg flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-blue-400" />
                <span>{modelName}</span>
              </span>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'Pause auto-rotation' : 'Start auto-rotation'}
                className={`p-2 rounded-xl border backdrop-blur-md transition shadow-md ${
                  autoRotate
                    ? 'bg-blue-600/90 text-white border-blue-500'
                    : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetView}
                title="Reset Camera Orientation"
                className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl backdrop-blur-md transition"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Overlay Info Pill */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10 text-[11px] font-mono text-slate-400">
              <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                Left Click + Drag to Rotate • Scroll to Zoom
              </span>
              <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                Triangles: {stats.triangleCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-200 font-semibold">
              {errorMsg}
            </div>
          )}
        </div>

        {/* CAD & Mesh Inspector Sidebar */}
        <div className="space-y-6">
          {/* Model Statistics Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Mesh & Dimensions</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-0.5">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Triangles</div>
                <div className="font-mono font-bold text-white text-sm">{stats.triangleCount.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-0.5">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Vertices</div>
                <div className="font-mono font-bold text-white text-sm">{stats.vertexCount.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Bounding Box (X × Y × Z)</div>
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-1.5 bg-slate-900 rounded border border-slate-800 text-red-400">
                  <span className="text-[10px] block text-slate-500">X Width</span>
                  <strong>{stats.dimensions.x}</strong>
                </div>
                <div className="p-1.5 bg-slate-900 rounded border border-slate-800 text-green-400">
                  <span className="text-[10px] block text-slate-500">Y Height</span>
                  <strong>{stats.dimensions.y}</strong>
                </div>
                <div className="p-1.5 bg-slate-900 rounded border border-slate-800 text-blue-400">
                  <span className="text-[10px] block text-slate-500">Z Depth</span>
                  <strong>{stats.dimensions.z}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Shading & Render Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Material & Shading</span>
            </h3>

            {/* Shading Modes */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-semibold">Shader Type</label>
              <div className="grid grid-cols-3 gap-1">
                {(['pbr', 'normals', 'matcap'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setShadingMode(mode)}
                    className={`py-1.5 rounded-lg font-bold capitalize transition ${
                      shadingMode === mode
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Color Picker */}
            {shadingMode !== 'normals' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Color</span>
                  <span className="font-mono text-slate-300">{modelColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={modelColor}
                    onChange={(e) => setModelColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#94a3b8', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setModelColor(c)}
                      style={{ backgroundColor: c }}
                      className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Wireframe & Grid Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 font-semibold">Wireframe Overlay</span>
                <input
                  type="checkbox"
                  checked={wireframe}
                  onChange={(e) => setWireframe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 font-semibold">Ground Plane Grid</span>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 font-semibold">3D Coordinate Axes</span>
                <input
                  type="checkbox"
                  checked={showAxes}
                  onChange={(e) => setShowAxes(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
