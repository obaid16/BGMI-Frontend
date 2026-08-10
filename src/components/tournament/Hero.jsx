'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Swords } from 'lucide-react';
import Button from '../common/Button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);
  const canvasContainerRef = useRef(null);

  // React state to store 2D projected screen coordinates for squads
  const [squads2D, setSquads2D] = useState([]);

  // 1. GSAP Timelines for Content entrance & scroll triggers
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background blobs subtle float animation
      gsap.to(bg1Ref.current, {
        y: -15,
        x: 8,
        duration: 7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(bg2Ref.current, {
        y: 15,
        x: -10,
        duration: 9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });

      // Main entrance timeline (MATCH START SEQUENCE)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.8 })
        .fromTo(line1Ref.current, { y: 40, opacity: 0, skewY: 1 }, { y: 0, opacity: 1, skewY: 0, duration: 0.8 }, '-=0.2')
        .fromTo(line2Ref.current, { y: 40, opacity: 0, skewY: 1 }, { y: 0, opacity: 1, skewY: 0, duration: 0.8 }, '-=0.5')
        .fromTo(subtitleRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo(
          ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
          '-=0.3'
        )
        .fromTo(
          statsRef.current?.children ? Array.from(statsRef.current.children) : [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          '-=0.2'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // 2. Three.js Battle Royale Battlefield Scene setup
  useEffect(() => {
    let THREE;
    let scene, camera, renderer;
    let animationFrameId;
    let isRendering = true;

    // Detect WebGL support
    const hasWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };

    if (!hasWebGL() || !canvasContainerRef.current) return;

    const initThree = async () => {
      try {
        THREE = await import('three');

        const container = canvasContainerRef.current;
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        // 1. Scene & Renderer setup (Dusk / Twilight sky)
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x060912, 0.024); // Heavy battleground twilight fog

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const canvasEl = renderer.domElement;
        container.appendChild(canvasEl);

        // 2. Camera Setup (Spectator broadcast angle)
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        camera.position.set(0, 7.5, 17.5);
        camera.lookAt(0, -1, -3);

        const isMobile = window.innerWidth < 768;

        // 3. Procedural Low-Poly Terrain
        const terrainSize = isMobile ? 32 : 55;
        const terrainSegments = isMobile ? 24 : 45;
        const terrainGeom = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
        terrainGeom.rotation.x = -Math.PI / 2;

        const pos = terrainGeom.attributes.position;
        // height-map the terrain vertices to make hills/valleys
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          
          // Outer hills and inner valleys
          let zHeight = Math.sin(x * 0.12) * Math.cos(y * 0.12) * 2.0;
          zHeight += Math.sin(x * 0.05) * 1.5; // macro elevation shifts
          
          // Depress center slightly for safe zone clear focus
          const distFromCenter = Math.sqrt(x * x + y * y);
          if (distFromCenter < 12) {
            zHeight *= (distFromCenter / 12);
          }
          
          pos.setZ(i, zHeight - 3.8); // Offset below flight paths
        }
        terrainGeom.computeVertexNormals();

        // Dark flat-shaded military terrain material
        const terrainMat = new THREE.MeshStandardMaterial({
          color: 0x090e18,
          roughness: 0.85,
          metalness: 0.15,
          flatShading: true,
        });

        const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
        scene.add(terrainMesh);

        // Tactical digital wireframe overlay
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0x00d8f6,
          wireframe: true,
          transparent: true,
          opacity: 0.07,
        });
        const wireOverlay = new THREE.Mesh(terrainGeom, wireMat);
        wireOverlay.position.y += 0.015; // Avoid z-fighting
        scene.add(wireOverlay);

        // 4. Shrinking Translucent Safe Zone Cylinder
        const zoneRadius = 9.5;
        const zoneGeom = new THREE.CylinderGeometry(zoneRadius, zoneRadius, 7, 36, 1, true);
        const zoneMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const safeZone = new THREE.Mesh(zoneGeom, zoneMat);
        safeZone.position.set(0, -0.5, -2);
        scene.add(safeZone);

        // Safe zone bounding outline on terrain
        const ringGeom = new THREE.RingGeometry(zoneRadius - 0.08, zoneRadius, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        });
        const safeZoneRing = new THREE.Mesh(ringGeom, ringMat);
        safeZoneRing.rotation.x = -Math.PI / 2;
        safeZoneRing.position.set(0, -3.5, -2);
        scene.add(safeZoneRing);

        // 5. Procedural Aircraft Silhouette
        const aircraft = new THREE.Group();
        const planeMat = new THREE.MeshStandardMaterial({
          color: 0x1b253b,
          roughness: 0.5,
          metalness: 0.8,
        });

        const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 1.4, 8), planeMat);
        fuselage.rotation.x = Math.PI / 2;
        aircraft.add(fuselage);

        const wing = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.03, 0.38), planeMat);
        wing.position.set(0, 0, 0.1);
        aircraft.add(wing);

        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.03, 0.22), planeMat);
        tail.position.set(0, 0, -0.5);
        aircraft.add(tail);

        aircraft.position.set(-20, 4.2, -6);
        aircraft.rotation.y = Math.PI / 2; // Face forward
        scene.add(aircraft);

        // Flight Path Trail Dots
        const trailCount = 20;
        const trailDots = [];
        const dotGeom = new THREE.SphereGeometry(0.04, 4, 4);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.35 });

        for (let i = 0; i < trailCount; i++) {
          const dot = new THREE.Mesh(dotGeom, dotMat);
          dot.position.set(0, -500, 0); // Hide initially
          scene.add(dot);
          trailDots.push(dot);
        }

        // 6. Falling Supply Drop Crate
        const dropGroup = new THREE.Group();
        const crateMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4, metalness: 0.6 });
        const lidMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 }); // Blue tarp lid

        const crateMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), crateMat);
        crateMesh.position.y = 0.15;
        dropGroup.add(crateMesh);

        const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.32), lidMat);
        lidMesh.position.y = 0.3;
        dropGroup.add(lidMesh);

        // Parachute
        const canopyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.42, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.4 })
        );
        canopyMesh.position.y = 0.9;
        dropGroup.add(canopyMesh);

        const dropX = 1.8;
        const dropZ = -1.2;
        dropGroup.position.set(dropX, 9, dropZ);
        scene.add(dropGroup);

        // Crate Smoke Flare Plume
        const smokeCount = 12;
        const smokeList = [];
        const smokeGeom = new THREE.SphereGeometry(0.06, 6, 6);
        
        for (let i = 0; i < smokeCount; i++) {
          const smokeMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
          });
          const puff = new THREE.Mesh(smokeGeom, smokeMat);
          puff.position.set(0, -500, 0); // Hide initially
          scene.add(puff);
          smokeList.push(puff);
        }

        // Calculate drop landing height on terrain
        const getTerrainHeight = (tx, tz) => {
          // Sync with geometry height formula
          let zHeight = Math.sin(tx * 0.12) * Math.cos(tz * 0.12) * 2.0;
          zHeight += Math.sin(tx * 0.05) * 1.5;
          const d = Math.sqrt(tx * tx + tz * tz);
          if (d < 12) zHeight *= (d / 12);
          return zHeight - 3.8;
        };

        const landingY = getTerrainHeight(dropX, dropZ);

        // 7. Interactive 3D Squad Markers
        const squadsList = [
          { name: 'ALP', label: 'ALP', fullName: 'Team Alpha', points: 73, rank: 1, pos: new THREE.Vector3(2.5, getTerrainHeight(2.5, -2) + 0.35, -2) },
          { name: 'TIT', label: 'TIT', fullName: 'Team Titans', points: 65, rank: 2, pos: new THREE.Vector3(-4.5, getTerrainHeight(-4.5, 3.5) + 0.35, 3.5) },
          { name: 'PHX', label: 'PHX', fullName: 'Phoenix Esports', points: 58, rank: 3, pos: new THREE.Vector3(5.5, getTerrainHeight(5.5, 4.5) + 0.35, 4.5) },
          { name: 'WAR', label: 'WAR', fullName: 'Warriors', points: 50, rank: 4, pos: new THREE.Vector3(-2.2, getTerrainHeight(-2.2, -5.5) + 0.35, -5.5) },
        ];

        const squadMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
        const squadMatGold = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true });
        const squadGeom = new THREE.OctahedronGeometry(0.18, 0);

        squadsList.forEach((sq, idx) => {
          const mesh = new THREE.Mesh(squadGeom, idx % 2 === 0 ? squadMat : squadMatGold);
          mesh.position.copy(sq.pos);
          scene.add(mesh);
          sq.mesh = mesh;
        });

        // 8. Dust particles battlefield atmosphere
        const dustCount = isMobile ? 80 : 250;
        const dustGeom = new THREE.BufferGeometry();
        const dustPos = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount; i++) {
          dustPos[i * 3] = (Math.random() - 0.5) * 35;
          dustPos[i * 3 + 1] = Math.random() * 8 - 2;
          dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({
          size: 0.05,
          color: 0x64748b,
          transparent: true,
          opacity: 0.45,
        });
        const dustPoints = new THREE.Points(dustGeom, dustMat);
        scene.add(dustPoints);

        // 9. Dusk/Sunset Tactical Stage Lighting
        const coolAmbient = new THREE.AmbientLight(0x0e1424, 0.95);
        scene.add(coolAmbient);

        const warmSunset = new THREE.DirectionalLight(0xff5500, 1.85); // Low sunset orange angle
        warmSunset.position.set(12, 3, -12);
        scene.add(warmSunset);

        const cyanFill = new THREE.DirectionalLight(0x00d8f6, 0.85); // Tactical glowing cyan highlights
        cyanFill.position.set(-12, 5, 12);
        scene.add(cyanFill);

        // 10. Pointer/Mouse Parallax Lerping
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        const handleMouseMove = (e) => {
          mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        if (!isMobile) {
          window.addEventListener('mousemove', handleMouseMove);
        }

        // 11. GSAP ScrollTrigger transitions
        gsap.to(container, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });

        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            gsap.set(container, { opacity: 1 - self.progress });
            if (camera) {
              camera.position.y = 7.5 - self.progress * 1.5;
              camera.position.z = 17.5 - self.progress * 2.5;
            }
          },
          onToggle: (self) => {
            isRendering = self.isActive;
          },
        });

        // 12. 60fps Loop
        const clock = new THREE.Clock();
        const tempV = new THREE.Vector3();
        let frameCount = 0;

        // Supply drop physics flags
        let landed = false;
        let flareSmokeActive = false;

        const animate = () => {
          if (!isRendering) {
            animationFrameId = requestAnimationFrame(animate);
            return;
          }

          const time = clock.getElapsedTime();

          // 1. Aircraft movement & dotted flight trails
          const planeX = -20 + (time * 1.4) % 40;
          aircraft.position.x = planeX;
          aircraft.position.y = 4.2 + Math.sin(time * 1.8) * 0.08;

          // Align flight path dots
          trailDots.forEach((dot, idx) => {
            const delayOffset = idx * 0.55;
            const dotX = aircraft.position.x - delayOffset;
            if (dotX > -18 && dotX < 18) {
              dot.position.set(dotX, 4.2 + Math.sin((time - delayOffset) * 1.8) * 0.08, -6);
            } else {
              dot.position.y = -500; // Hide outside map bounds
            }
          });

          // 2. Translucent Safe Zone contraction & pulsing
          const currentScale = 1.3 - ((time * 0.012) % 0.8);
          const pulse = 1.0 + Math.sin(time * 3.5) * 0.018;
          safeZone.scale.set(currentScale * pulse, 1, currentScale * pulse);
          safeZoneRing.scale.set(currentScale * pulse, currentScale * pulse, 1);

          // 3. Supply drop falling & terrain elevation landing
          if (!landed) {
            dropGroup.position.y -= 0.016;
            if (dropGroup.position.y <= landingY + 0.15) {
              dropGroup.position.y = landingY + 0.15;
              canopyMesh.visible = false; // Hide parachute
              landed = true;
              flareSmokeActive = true;
            }
          }

          // 4. Flare smoke plumes
          if (flareSmokeActive) {
            smokeList.forEach((puff, idx) => {
              const speedFactor = 0.35 + idx * 0.15;
              const puffTime = (time * 0.8 + idx * 0.28) % 1.0;
              
              // Drift upwards
              puff.position.x = dropX + Math.sin(time * 2 + idx) * 0.08;
              puff.position.y = landingY + 0.15 + puffTime * 1.35 * speedFactor;
              puff.position.z = dropZ + Math.cos(time * 2 + idx) * 0.08;
              
              // Expand & fade
              puff.scale.setScalar(0.4 + puffTime * 1.4);
              puff.material.opacity = 0.8 * (1.0 - puffTime);
            });
          }

          // 5. Squad marker floats
          squadsList.forEach((sq) => {
            if (sq.mesh) {
              sq.mesh.rotation.y = time * 0.8;
              sq.mesh.rotation.x = time * 0.4;
              sq.mesh.position.y = sq.pos.y + Math.sin(time * 2.2 + sq.points) * 0.06;
            }
          });

          // 6. Ambient atmosphere drifts
          dustPoints.rotation.y = time * 0.01;

          // 7. Mouse Lerp Parallax
          targetX += (mouseX - targetX) * 0.045;
          targetY += (mouseY - targetY) * 0.045;

          if (camera) {
            camera.position.x = targetX * 1.4;
            camera.lookAt(0, -0.6, -2);
          }

          // 8. 2D Coordinate projections for labels (throttled to 30fps)
          frameCount++;
          if (frameCount % 2 === 0) {
            const projectedCoords = squadsList.map((s) => {
              tempV.copy(s.mesh.position);
              tempV.project(camera);
              
              const px = (tempV.x * 0.5 + 0.5) * container.clientWidth;
              const py = (tempV.y * -0.5 + 0.5) * container.clientHeight;
              
              return {
                name: s.name,
                label: s.label,
                fullName: s.fullName,
                points: s.points,
                rank: s.rank,
                x: px,
                y: py,
                visible: tempV.z <= 1,
              };
            });
            setSquads2D(projectedCoords);
          }

          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // 13. Resize Handler
        const handleResize = () => {
          if (!container || !renderer || !camera) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        // 14. Full cleanups
        return () => {
          window.removeEventListener('resize', handleResize);
          if (!isMobile) {
            window.removeEventListener('mousemove', handleMouseMove);
          }
          cancelAnimationFrame(animationFrameId);

          // Dispose meshes, geometries, and materials
          terrainGeom.dispose();
          terrainMat.dispose();
          wireMat.dispose();
          zoneGeom.dispose();
          zoneMat.dispose();
          ringGeom.dispose();
          ringMat.dispose();
          fuselage.geometry.dispose();
          wing.geometry.dispose();
          tail.geometry.dispose();
          planeMat.dispose();
          dotGeom.dispose();
          dotMat.dispose();
          boxGeom.dispose();
          crateMat.dispose();
          lidMesh.geometry.dispose();
          lidMat.dispose();
          canopyMesh.geometry.dispose();
          canopyMesh.material.dispose();
          smokeGeom.dispose();
          smokeList.forEach((p) => p.material.dispose());
          squadGeom.dispose();
          squadMat.dispose();
          squadMatGold.dispose();
          dustGeom.dispose();
          dustMat.dispose();
          coolAmbient.dispose();
          warmSunset.dispose();
          cyanFill.dispose();

          if (canvasEl && canvasEl.parentNode) {
            canvasEl.parentNode.removeChild(canvasEl);
          }
          if (renderer) {
            renderer.dispose();
          }
        };
      } catch (err) {
        console.error('Three.js initialization failed inside Hero', err);
      }
    };

    initThree();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[88vh] flex items-center justify-center pt-8 pb-20 overflow-hidden bg-bgmi-dark select-none"
    >
      {/* Three.js 3D Esports Background Scene */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-0"
      />

      {/* Tactical HUD overlays */}
      <div className="absolute top-24 left-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest space-y-1.5 select-none hidden md:block">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-bgmi-gold rounded-full animate-pulse" />
          <span>Sector: 04 / Grid</span>
        </div>
        <div>Squads: 24 / Alive</div>
        <div>Players: 96 / Combat</div>
      </div>

      <div className="absolute top-24 right-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest space-y-1.5 select-none text-right hidden md:block">
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="text-emerald-400 font-bold">Safe Zone: Active</span>
        </div>
        <div>Zone Timer: <span className="font-bold text-bgmi-cyan">01:45</span></div>
      </div>

      <div className="absolute bottom-24 left-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest select-none hidden md:block">
        <span>BATTLEFIELD: READY</span>
      </div>

      <div className="absolute bottom-24 right-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest select-none text-right hidden md:block">
        <span>MATCH #07 — FINALS</span>
      </div>

      {/* Interactive Squad Projected HTML labels */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {squads2D.map((sq) => (
          <div
            key={sq.name}
            className="absolute pointer-events-auto select-none cursor-pointer group"
            style={{
              left: `${sq.x}px`,
              top: `${sq.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {/* Tiny pulsing dot */}
            <div className="relative flex h-2.5 w-2.5 mx-auto mb-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bgmi-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bgmi-cyan"></span>
            </div>
            
            {/* Name tag */}
            <div className="bg-slate-950/90 border border-bgmi-cyan/40 px-2 py-0.5 rounded font-mono font-bold text-[9px] text-bgmi-cyan uppercase tracking-wider shadow-md">
              {sq.label}
            </div>

            {/* Hover Tooltip Overlay */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-44 bg-slate-950/95 border border-bgmi-gold/50 rounded-lg p-2.5 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
              <div className="border-b border-bgmi-gold/30 pb-1 mb-1.5">
                <p className="font-display font-black text-[10px] text-white tracking-wide uppercase">{sq.fullName}</p>
              </div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                Squad size: <span className="text-white">4 Players</span>
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                Roster: <span className="text-emerald-400">Verified</span>
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                Points: <span className="text-bgmi-gold font-mono font-bold">{sq.points} PTS</span>
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                Rank: <span className="text-bgmi-cyan font-mono font-bold">#{sq.rank}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tactical grid overlay */}
      <div className="absolute inset-0 bg-tactical-grid opacity-35 pointer-events-none" />

      {/* Radial gradient hero glow */}
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />

      {/* Decorative Floating BG Blobs */}
      <div
        ref={bg1Ref}
        className="absolute top-1/4 left-8 w-80 h-80 bg-bgmi-gold/5 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        ref={bg2Ref}
        className="absolute bottom-16 right-8 w-[28rem] h-[28rem] bg-bgmi-cyan/5 rounded-full blur-[140px] pointer-events-none"
      />

      {/* Decorative corner brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-bgmi-gold/20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-bgmi-gold/20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-bgmi-gold/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-bgmi-gold/20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* TOURNAMENT STATUS BADGE */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-bgmi-surface/80 border border-bgmi-gold/50 shadow-gold-glow backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bgmi-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bgmi-gold"></span>
          </span>
          <span className="text-xs font-bold tracking-[0.2em] text-bgmi-gold uppercase">
            REGISTRATION OPEN — SEASON 2026
          </span>
        </div>

        {/* CINEMATIC TITLE */}
        <div className="space-y-1 mb-6">
          <h1 ref={line1Ref} className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-none">
            [COLLEGE NAME]
          </h1>
          <h2 ref={line2Ref} className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-bgmi-gold via-amber-400 to-orange-500 uppercase leading-none mt-2">
            BGMI ESPORTS CHAMPIONSHIP{' '}
            <span className="text-bgmi-cyan">2026</span>
          </h2>
        </div>

        {/* TAGLINE */}
        <div ref={subtitleRef} className="space-y-2 mb-12">
          <p className="text-base sm:text-xl md:text-2xl font-display tracking-[0.2em] text-bgmi-gold font-black uppercase max-w-3xl mx-auto">
            ONE COLLEGE. ONE BATTLEGROUND. ONE CHAMPION.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Compete against the best squads from our college.
          </p>
        </div>

        {/* CALL TO ACTION BUTTONS */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register">
            <Button variant="primary" size="lg" icon={Trophy} className="w-full sm:w-auto px-10 py-4 text-sm">
              REGISTER YOUR SQUAD
            </Button>
          </Link>
          <Link href="/matches">
            <Button variant="secondary" size="lg" icon={Swords} className="w-full sm:w-auto px-10 py-4 text-sm">
              VIEW TOURNAMENT
            </Button>
          </Link>
        </div>

        {/* HERO STATS OVERVIEW BAR */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bgmi-border/40 rounded-2xl overflow-hidden max-w-3xl mx-auto border border-bgmi-border/60 shadow-2xl"
        >
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-white">24</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registered Squads</p>
          </div>
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-bgmi-gold">96</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Players</p>
          </div>
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-bgmi-cyan">12</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Matches</p>
          </div>
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-emerald-400">4</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Current Round</p>
          </div>
        </div>

      </div>
    </section>
  );
}
