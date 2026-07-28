import React, { useState, useEffect, useRef } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);

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
      { rootMargin: '200px' }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const displayImage = poster || fallbackImage;

  return (
    <div
      ref={containerRef}
      className={`lazy-video-wrapper ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onClick={onClick}
    >
      {/* Fallback Thumbnail Image while loading */}
      {displayImage && !isLoaded && (
        <img
          src={displayImage}
          alt="Video thumbnail"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: style.objectFit || 'cover',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.3s ease-out'
          }}
          loading="lazy"
        />
      )}

      {/* Video Element */}
      {inView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          autoPlay={autoPlay}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          onCanPlay={() => setIsLoaded(true)}
          onLoadedData={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: style.objectFit || 'cover',
          }}
          {...props}
        />
      )}
    </div>
  );
}
