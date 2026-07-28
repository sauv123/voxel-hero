import React, { useRef, useState, useEffect } from 'react';

export default function ProfileIntroduction({ theme }) {
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsMuted(false);
      setShowControls(true);
    }
  };

  return (
    <>
      <div
        className="profile-intro-container"
        style={{
          width: "100%", margin: "0 auto",
          display: "flex", gap: "40px", alignItems: "center",
          flexDirection: "row"
        }}
      >
        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <video 
            ref={videoRef}
            src="/portfolio.mp4" 
            muted={isMuted}
            autoPlay
            loop
            playsInline
            controls={showControls}
            controlsList="nodownload noplaybackrate"
            onClick={handleVideoClick}
            style={{ 
              width: "100%", 
              minHeight: "400px",
              aspectRatio: "16/9",
              borderRadius: "16px",
              outline: "none",
              objectFit: "cover",
              overflow: "hidden",
              cursor: "pointer",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              transform: "translateZ(0)"
            }}
          />

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-intro-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </>
  );
}
