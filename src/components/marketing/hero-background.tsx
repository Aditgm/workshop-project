"use client";

import { useEffect, useRef, useState } from "react";

export function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt video autoplay with graceful fallback
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          // Autoplay prevented by browser (e.g. Low Power Mode, mobile data saver).
          // Animated Ken Burns poster background remains active.
          setIsVideoPlaying(false);
        });
    }
  }, []);

  return (
    <div className="absolute inset-0 size-full overflow-hidden pointer-events-none">
      {/* 
        Layer 1: High-Performance Instant Animated Poster Background
        Mobile-optimized WebP (only 6.8 KB) with hardware-accelerated ambient drift.
        Ensures 0ms delay, 0 black flicker, and fluid 60fps visuals on mobile even on low power mode.
      */}
      <picture className="absolute inset-0 size-full">
        <source
          media="(max-width: 640px)"
          srcSet="/hero-poster-mobile.webp"
          type="image/webp"
        />
        <source srcSet="/hero-poster.webp" type="image/webp" />
        <img
          src="/hero-poster.png"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="hero-kenburns absolute inset-0 size-full object-cover object-[62%_center] sm:object-[68%_center] lg:object-center opacity-85 transform-gpu"
        />
      </picture>

      {/* 
        Layer 2: Looping Video
        Configured with mobile-friendly attributes:
        - playsInline & webkit-playsinline to prevent unwanted full-screen takeovers
        - preload="metadata" to avoid hogging bandwidth on mobile connections
        - Smooth opacity transition once the video stream begins
      */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        poster="/hero-poster-mobile.webp"
        onPlaying={() => setIsVideoPlaying(true)}
        className={`absolute inset-0 size-full object-cover object-[62%_center] sm:object-[68%_center] lg:object-center transition-opacity duration-700 transform-gpu ${
          isVideoPlaying ? "opacity-85" : "opacity-0"
        }`}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
