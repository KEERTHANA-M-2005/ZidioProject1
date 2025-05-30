import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDScatterPlot = ({ data, xAxis, yAxis, zAxis }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (!data || data.length < 2 || !xAxis || !yAxis || !zAxis) return;

    const xIndex = data[0].indexOf(xAxis);
    const yIndex = data[0].indexOf(yAxis);
    const zIndex = data[0].indexOf(zAxis);

    if (xIndex === -1 || yIndex === -1 || zIndex === -1) return;

    const points = data.slice(1).map(row => ({
      x: parseFloat(row[xIndex]),
      y: parseFloat(row[yIndex]),
      z: parseFloat(row[zIndex]),
    })).filter(p => !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.z));

    // Clean up previous scene
    while (containerRef.current && containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf5ff); // light purple
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(50, 50, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Axes helper
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);

    // Add grid
    const gridHelper = new THREE.GridHelper(100, 10);
    scene.add(gridHelper);

    // Add data points
    const geometry = new THREE.SphereGeometry(0.7, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x6b21a8 });
    points.forEach((point) => {
      const sphere = new THREE.Mesh(geometry, material.clone());
      sphere.position.set(point.x, point.y, point.z);
      sphere.material.color.setHSL(Math.random(), 0.6, 0.6);
      scene.add(sphere);
    });

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(50, 50, 50);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040); // soft light
    scene.add(ambient);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      controls.dispose();
    };
  }, [data, xAxis, yAxis, zAxis]);

  return <div ref={containerRef} className="w-full h-[500px] mt-4 rounded shadow" />;
};

export default ThreeDScatterPlot;
