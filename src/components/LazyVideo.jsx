import React, { useState, useEffect, useRef } from 'react';
import { videoManager } from '../utils/videoManager';

export default function LazyVideo({
  src,
  poster,
  fallbackImage,
  className = '',
  style = {},
  muted = true,
  autoPlay = true,
  loop = true,
  playsInline = true,
  controls = false,
  onClick,
  ...props
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef(null);
  const slotClaimedRef = useRef(false);

  // 1. Intersection Observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            setInView(false);
          }
        });
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // 2. Manage Concurrency Queue & Load Permission
  useEffect(() => {
    if (inView && !shouldLoad && !hasTimedOut) {
      let loadCallback = () => {
        slotClaimedRef.current = true;
        setShouldLoad(true);

        // Start 3s Hard Timeout Fallback
        timeoutRef.current = setTimeout(() => {
          if (!isLoaded) {
            setHasTimedOut(true);
            if (slotClaimedRef.current) {
              slotClaimedRef.current = false;
              videoManager.releaseSlot();
            }
          }
        }, 3000);
      };

      videoManager.requestLoad(loadCallback);

      return () => {
        videoManager.removeFromQueue(loadCallback);
      };
    }
  }, [inView, shouldLoad, hasTimedOut, isLoaded]);

  // Release slot on unmount or when scrolled out
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (slotClaimedRef.current) {
        slotClaimedRef.current = false;
        videoManager.releaseSlot();
      }
    };
  }, []);

  const handleCanPlay = () => {
    setIsLoaded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (slotClaimedRef.current) {
      slotClaimedRef.current = false;
      videoManager.releaseSlot();
    }
  };

  const handleError = () => {
    setHasTimedOut(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (slotClaimedRef.current) {
      slotClaimedRef.current = false;
      videoManager.releaseSlot();
    }
  };

  const displayImage = poster || fallbackImage;

  return (
    <div
      ref={containerRef}
      className={`lazy-video-wrapper ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onClick={onClick}
    >
      {/* Poster / Fallback Image */}
      {(displayImage && (!shouldLoad || hasTimedOut || !isLoaded)) && (
        <img
          src={displayImage}
          alt="Video thumbnail"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: style.objectFit || 'cover',
            zIndex: isLoaded && !hasTimedOut ? 0 : 2,
            transition: 'opacity 0.4s ease-out',
            opacity: isLoaded && !hasTimedOut ? 0 : 1
          }}
          loading="lazy"
        />
      )}

      {/* Lazy Video Tag */}
      {shouldLoad && !hasTimedOut && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          autoPlay={autoPlay && inView}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload="metadata"
          onCanPlay={handleCanPlay}
          onLoadedData={handleCanPlay}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: style.objectFit || 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease-out'
          }}
          {...props}
        />
      )}
    </div>
  );
}
