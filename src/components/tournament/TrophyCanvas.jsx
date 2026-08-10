'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';

export default function TrophyCanvas({ variant = 'golden', height = 220 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // WebGL compatibility check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebglSupported(supported);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!webglSupported) return;

    // Load Three.js dynamically to avoid SSR errors
    let THREE;
    let renderer;
    let scene;
    let camera;
    let animationFrameId;
    let isRendering = true;

    const initThree = async () => {
      try {
        THREE = await import('three');

        if (!containerRef.current || !canvasRef.current) return;

        const width = containerRef.current.clientWidth || 300;
        const currentHeight = height;

        // 1. Scene setup
        scene = new THREE.Scene();

        // 2. Camera setup
        camera = new THREE.PerspectiveCamera(45, width / currentHeight, 0.1, 100);
        camera.position.set(0, 1.2, 5.5);

        // 3. Renderer setup
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, currentHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 4. Create Trophy Group
        const trophyGroup = new THREE.Group();

        // Colors & Materials
        const isWireframe = variant === 'wireframe';
        const goldColor = 0xffd700;
        const cyanColor = 0x00f0ff;
        const darkBaseColor = 0x1e293b;

        let metalMaterial;
        let baseMaterial;
        let emblemMaterial;

        if (isWireframe) {
          metalMaterial = new THREE.MeshBasicMaterial({
            color: cyanColor,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
          });
          baseMaterial = new THREE.MeshBasicMaterial({
            color: 0x1e293b,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
          });
          emblemMaterial = new THREE.MeshBasicMaterial({
            color: goldColor,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
          });
        } else {
          // Standard golden shader materials
          metalMaterial = new THREE.MeshStandardMaterial({
            color: goldColor,
            roughness: 0.15,
            metalness: 0.9,
          });
          baseMaterial = new THREE.MeshStandardMaterial({
            color: darkBaseColor,
            roughness: 0.4,
            metalness: 0.7,
          });
          emblemMaterial = new THREE.MeshStandardMaterial({
            color: goldColor,
            roughness: 0.1,
            metalness: 0.95,
            emissive: goldColor,
            emissiveIntensity: 0.15,
          });
        }

        // Procedural parts of the Trophy
        const baseGeom = new THREE.CylinderGeometry(0.8, 1.0, 0.35, 32);
        const baseMesh = new THREE.Mesh(baseGeom, baseMaterial);
        baseMesh.position.y = -0.7;
        trophyGroup.add(baseMesh);

        const stemGeom = new THREE.CylinderGeometry(0.18, 0.28, 0.8, 16);
        const stemMesh = new THREE.Mesh(stemGeom, metalMaterial);
        stemMesh.position.y = -0.2;
        trophyGroup.add(stemMesh);

        const bowlLowerGeom = new THREE.CylinderGeometry(0.8, 0.2, 0.6, 32);
        const bowlLower = new THREE.Mesh(bowlLowerGeom, metalMaterial);
        bowlLower.position.y = 0.5;
        trophyGroup.add(bowlLower);

        const bowlUpperGeom = new THREE.CylinderGeometry(0.9, 0.8, 0.5, 32);
        const bowlUpper = new THREE.Mesh(bowlUpperGeom, metalMaterial);
        bowlUpper.position.y = 1.05;
        trophyGroup.add(bowlUpper);

        const rimGeom = new THREE.TorusGeometry(0.9, 0.06, 8, 32);
        const rimMesh = new THREE.Mesh(rimGeom, metalMaterial);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.y = 1.3;
        trophyGroup.add(rimMesh);

        // Handles (Torus arcs)
        const handleGeomLeft = new THREE.TorusGeometry(0.4, 0.06, 8, 24, Math.PI);
        const handleLeft = new THREE.Mesh(handleGeomLeft, metalMaterial);
        handleLeft.position.set(-0.95, 0.9, 0);
        handleLeft.rotation.z = -Math.PI / 6;
        trophyGroup.add(handleLeft);

        const handleGeomRight = new THREE.TorusGeometry(0.4, 0.06, 8, 24, Math.PI);
        const handleRight = new THREE.Mesh(handleGeomRight, metalMaterial);
        handleRight.position.set(0.95, 0.9, 0);
        handleRight.rotation.z = Math.PI + Math.PI / 6;
        trophyGroup.add(handleRight);

        // Floating Octahedron Emblem above the cup
        const emblemGeom = new THREE.OctahedronGeometry(0.28);
        const emblemMesh = new THREE.Mesh(emblemGeom, emblemMaterial);
        emblemMesh.position.y = 1.85;
        trophyGroup.add(emblemMesh);

        scene.add(trophyGroup);

        // 5. Lights (needed for Standard Material)
        if (!isWireframe) {
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
          scene.add(ambientLight);

          const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
          keyLight.position.set(5, 6, 5);
          scene.add(keyLight);

          const fillLight = new THREE.DirectionalLight(cyanColor, 0.8);
          fillLight.position.set(-5, 3, 2);
          scene.add(fillLight);

          const goldGlow = new THREE.PointLight(goldColor, 1.5, 6);
          goldGlow.position.set(0, 1.8, 2);
          scene.add(goldGlow);
        } else {
          // Subtle basic lighting for visibility
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
          scene.add(ambientLight);
        }

        // 6. Intersection Observer to pause loop when out of view
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isRendering = entry.isIntersecting;
            });
          },
          { threshold: 0.05 }
        );

        if (canvasRef.current) {
          observer.observe(canvasRef.current);
        }

        // 7. Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
          if (!isRendering) {
            animationFrameId = requestAnimationFrame(animate);
            return;
          }

          const elapsedTime = clock.getElapsedTime();

          // Smooth trophy group rotation
          trophyGroup.rotation.y = elapsedTime * 0.45;

          // Emblem floating animation
          emblemMesh.position.y = 1.75 + Math.sin(elapsedTime * 2.2) * 0.08;
          emblemMesh.rotation.y = elapsedTime * 1.5;
          emblemMesh.rotation.x = elapsedTime * 0.5;

          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // 8. Resize Handler
        const handleResize = () => {
          if (!containerRef.current || !renderer || !camera) return;
          const w = containerRef.current.clientWidth;
          camera.aspect = w / height;
          camera.updateProjectionMatrix();
          renderer.setSize(w, height);
        };

        window.addEventListener('resize', handleResize);

        // Cache cleanup handler
        return () => {
          window.removeEventListener('resize', handleResize);
          observer.disconnect();
          cancelAnimationFrame(animationFrameId);

          // Dispose geometries/materials
          baseGeom.dispose();
          stemGeom.dispose();
          bowlLowerGeom.dispose();
          bowlUpperGeom.dispose();
          rimGeom.dispose();
          handleGeomLeft.dispose();
          handleGeomRight.dispose();
          emblemGeom.dispose();

          metalMaterial.dispose();
          baseMaterial.dispose();
          emblemMaterial.dispose();

          if (renderer) {
            renderer.dispose();
          }
        };
      } catch (err) {
        console.error('Three.js initialization failed inside TrophyCanvas', err);
        setWebglSupported(false);
      }
    };

    initThree();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [webglSupported, variant, height]);

  // CSS Fallback Render when WebGL is unsupported
  if (!webglSupported) {
    const isGold = variant === 'golden';
    return (
      <div
        className={`w-full flex flex-col items-center justify-center border rounded-2xl p-6 ${
          isGold
            ? 'bg-gradient-to-br from-amber-500/10 to-transparent border-bgmi-gold/30 shadow-gold-glow'
            : 'bg-gradient-to-br from-bgmi-cyan/5 to-transparent border-bgmi-cyan/20'
        }`}
        style={{ height }}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 animate-bounce shadow-md ${
            isGold
              ? 'bg-bgmi-gold/20 text-bgmi-gold border border-bgmi-gold/40'
              : 'bg-bgmi-cyan/10 text-bgmi-cyan border border-bgmi-cyan/30'
          }`}
        >
          <Trophy className="w-8 h-8" />
        </div>
        <p className={`font-display font-black text-sm uppercase tracking-wider ${isGold ? 'text-bgmi-gold' : 'text-bgmi-cyan'}`}>
          {isGold ? 'Championship Trophy' : 'Championship Prize'}
        </p>
        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-1">
          {isGold ? 'College Champions 2026' : 'Awaiting Winners'}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full relative flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="block cursor-grab active:cursor-grabbing" />
    </div>
  );
}
