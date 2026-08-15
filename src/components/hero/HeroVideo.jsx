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
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0B0E14] z-0">
      {/* 1. STATIC FALLBACK POSTER */}
      {(!isLoaded || hasError) && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out opacity-40"
          style={{ backgroundImage: `url(${posterImage})` }}
        />
      )}

      {/* 2. CINEMATIC BACKGROUND VIDEO */}
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
          className={`absolute inset-0 w-full h-full object-cover object-[60%_center] md:object-center transition-opacity duration-1000 ease-in-out ${
            isLoaded ? 'opacity-45 md:opacity-40' : 'opacity-0'
          }`}
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* 3. BROADCAST COMPOSITE OVERLAY LAYERS */}
      {/* Dark Color Grade Overlay */}
      <div className="absolute inset-0 bg-[#0B0E14]/75 mix-blend-multiply z-10 pointer-events-none" />

      {/* Left-to-Right Gradient for Editorial Left Typography Readability */}
      <div className="absolute inset-0 bg-hero-left-dark z-10 pointer-events-none" />

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-vignette z-10 pointer-events-none opacity-85" />

      {/* Red & Gold Atmospheric Spotlight Glows */}
      <div className="absolute inset-0 bg-glow-red z-10 pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-glow-gold z-10 pointer-events-none opacity-50" />

      {/* Subtle Tactical Grid Lines */}
      <div className="absolute inset-0 bg-tactical-grid z-10 pointer-events-none opacity-20" />
    </div>
  );
}


