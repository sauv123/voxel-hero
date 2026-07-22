import React, { useRef, useState } from 'react';

export default function ProfileIntroduction({ theme }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Restart from the beginning
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play(); // Ensure it continues playing
    }
  };

  return (
    <div style={{ padding: "0 40px" }}>
      <div
        className="profile-intro-container"
        style={{
          width: "100%", maxWidth: 1000, margin: "0 auto",
          display: "flex", gap: "40px", alignItems: "center",
          flexDirection: "row"
        }}
      >
        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <video 
            ref={videoRef}
            src="/portfolio.mp4" 
            autoPlay
            loop
            muted={isMuted}
            controls={!isMuted}
            playsInline
            preload="metadata"
            onClick={isMuted ? handleUnmute : undefined}
            style={{ 
              width: "100%", 
              borderRadius: "16px",
              outline: "none",
              objectFit: "cover",
              overflow: "hidden",
              cursor: isMuted ? "pointer" : "default",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              transform: "translateZ(0)"
            }}
          >
            Your browser does not support the video tag.
          </video>

          {isMuted && (
            <button
              onClick={handleUnmute}
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                background: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "14px",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)"}
            >
              Click to Unmute
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-intro-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
