import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SHAPE_TYPES = {
  SPHERE: 'sphere',
  CUBE: 'cube',
  TETRAHEDRON: 'tetrahedron',
  OCTAHEDRON: 'octahedron',
  ICOSAHEDRON: 'icosahedron',
};

const ThreeDScatterPlot = forwardRef(({ data, xAxis, yAxis, zAxis, shape = 'sphere' }, ref) => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const animationIdRef = useRef();

  useImperativeHandle(ref, () => ({
    downloadImage: () => {
      if (rendererRef.current) {
        rendererRef.current.render(rendererRef.current.scene, rendererRef.current.camera);
        const link = document.createElement('a');
        link.download = '3d_scatter_plot.png';
        link.href = rendererRef.current.domElement.toDataURL('image/png');
        link.click();
      }
    }
  }));

  useEffect(() => {
    if (!data.length || !xAxis || !yAxis || !zAxis) return;
    if (!containerRef.current) return;

    const xIndex = data[0].indexOf(xAxis);
    const yIndex = data[0].indexOf(yAxis);
    const zIndex = data[0].indexOf(zAxis);

    if (xIndex === -1 || yIndex === -1 || zIndex === -1) return;

    const points = data.slice(1).map(row => ({
      x: parseFloat(row[xIndex]),
      y: parseFloat(row[yIndex]),
      z: parseFloat(row[zIndex]),
      size: (Math.random() * 2 + 1.5) * 3,
      color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 60%)`)
    })).filter(p => !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.z));

    // Clear previous render
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05020a);
    scene.fog = new THREE.FogExp2(0x05020a, 0.002);

    const width = containerRef.current.clientWidth || 800;
    const height = 600;

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1500);
    camera.position.set(90, 90, 90);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    renderer.scene = scene;
    renderer.camera = camera;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.minDistance = 15;
    controls.maxDistance = 400;
    controls.zoomSpeed = 1.5;
    controlsRef.current = controls;

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(80, 140, 80);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x8888ff, 1.0);
    scene.add(ambientLight);

    const axesHelper = new THREE.AxesHelper(70);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(120, 12, 0x4444ff, 0x222288);
    scene.add(gridHelper);

    const createAxisLabel = (text, position) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;

      ctx.font = '48px Arial Black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;

      ctx.fillStyle = '#00ffff';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(25, 12.5, 1);
      sprite.position.copy(position);
      scene.add(sprite);
    };

    createAxisLabel(xAxis || 'X', new THREE.Vector3(75, 0, 0));
    createAxisLabel(yAxis || 'Y', new THREE.Vector3(0, 75, 0));
    createAxisLabel(zAxis || 'Z', new THREE.Vector3(0, 0, 75));

    const createGlowSprite = (color, size) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const dim = 128;
      canvas.width = dim;
      canvas.height = dim;

      const gradient = ctx.createRadialGradient(dim / 2, dim / 2, 0, dim / 2, dim / 2, dim / 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.2, color);
      gradient.addColorStop(0.4, 'rgba(0,0,0,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dim, dim);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(size * 5, size * 5, 1);
      return sprite;
    };

    const pointsMeshes = [];
    points.forEach(p => {
      const geometry = (() => {
        switch (shape) {
          case SHAPE_TYPES.CUBE: return new THREE.BoxGeometry(1, 1, 1);
          case SHAPE_TYPES.TETRAHEDRON: return new THREE.TetrahedronGeometry(1);
          case SHAPE_TYPES.OCTAHEDRON: return new THREE.OctahedronGeometry(1);
          case SHAPE_TYPES.ICOSAHEDRON: return new THREE.IcosahedronGeometry(1);
          case SHAPE_TYPES.SPHERE:
          default: return new THREE.SphereGeometry(0.8, 32, 32);
        }
      })();

      const material = new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: 0.1,
        metalness: 1.0,
        emissive: p.color.clone().multiplyScalar(1.2),
        emissiveIntensity: 1.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(p.x, p.y, p.z);
      mesh.scale.setScalar(p.size);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      const glow = createGlowSprite(`#${p.color.getHexString()}`, p.size);
      glow.position.copy(mesh.position);
      scene.add(glow);

      pointsMeshes.push(mesh);
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.7,
      linewidth: 4,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < pointsMeshes.length; i++) {
      for (let j = i + 1; j < pointsMeshes.length; j++) {
        const a = pointsMeshes[i].position;
        const b = pointsMeshes[j].position;
        const distance = a.distanceTo(b);

        if (distance < 25) {
          const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
          const line = new THREE.Line(geometry, lineMaterial);
          scene.add(line);
        }
      }
    }

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      pointsMeshes.forEach(mesh => {
        mesh.rotation.x += 0.015;
        mesh.rotation.y += 0.02;
      });

      scene.rotation.y += 0.002;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Use ResizeObserver for robust resize handling
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = 600;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      controls.dispose();
      renderer.dispose();
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [data, xAxis, yAxis, zAxis, shape]);

  return <div ref={containerRef} className="w-full" style={{ height: 600 }} />;
});

export default ThreeDScatterPlot;
