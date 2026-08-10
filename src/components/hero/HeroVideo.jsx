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

  // Switch video source based on screen width
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

  // Autoplay handler for browser restrictions
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
            // Autoplay is blocked or failed, fallback to poster visually
          });
      }
    }
  }, [videoSrc]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 z-0">
      {/* STATIC FALLBACK POSTER / PRELOADER */}
      {(!isLoaded || hasError) && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out animate-pulse"
          style={{ backgroundImage: `url(${posterImage})` }}
        />
      )}

      {/* CINEMATIC VIDEO */}
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlayThrough={() => setIsLoaded(true)}
          onError={() => {
            console.warn('Error loading video source, reverting to poster.');
            setHasError(true);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            isLoaded ? 'opacity-35' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* OVERLAY LAYERS */}
      {/* 1. Vignette & Dark Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-hero-radial z-10 pointer-events-none opacity-90" />

      {/* 2. Tactical grid and noise effect */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 z-10 pointer-events-none" />
      
      {/* 3. Scanline styling overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />
    </div>
  );
}
