'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function HeroVideo({
  desktopVideo = 'https://videos.pexels.com/video-files/5086055/5086055-sd_640_360_30p.mp4',
  mobileVideo = 'https://videos.pexels.com/video-files/5086055/5086055-sd_640_360_30p.mp4',
  posterImage = '/images/hero_poster.png'
}) {
  const [videoSrc, setVideoSrc] = useState(desktopVideo);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVideoSrc(mobileVideo || desktopVideo);
      } else {
        setVideoSrc(desktopVideo);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopVideo, mobileVideo]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasError(false);
          })
          .catch((error) => {
            console.warn('Autoplay prevented or failed, showing poster fallback:', error);
          });
      }
    }
  }, [videoSrc]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-bgmi-dark z-0">
      {/* STATIC FALLBACK POSTER */}
      {(!isLoaded || hasError) && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out opacity-40"
          style={{ backgroundImage: `url(${posterImage})` }}
        />
      )}

      {/* CINEMATIC VIDEO */}
      {!hasError && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onCanPlayThrough={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            isLoaded ? 'opacity-35' : 'opacity-0'
          }`}
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* OVERLAY LAYERS */}
      {/* 1. Dark Vignette & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-bgmi-dark/95 via-bgmi-dark/70 to-bgmi-dark z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-vignette z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-hero-radial z-10 pointer-events-none opacity-90" />

      {/* 2. Tactical Grid Overlay */}
      <div className="absolute inset-0 bg-tactical-grid opacity-25 z-10 pointer-events-none" />

      {/* 3. Subtle Broadcast Scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.04] z-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%), linear-gradient(90deg, rgba(230, 25, 60, 0.08), rgba(0, 240, 255, 0.04), rgba(255, 183, 3, 0.04))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />
    </div>
  );
}

