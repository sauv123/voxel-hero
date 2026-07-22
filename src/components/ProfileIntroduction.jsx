import React from 'react';

export default function ProfileIntroduction({ theme }) {
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
        <div style={{
          flex: "0 0 40%", 
          aspectRatio: "3/4",
          borderRadius: 4, overflow: "hidden",
          border: `1.5px solid ${theme.text}25`,
          background: `${theme.text}05`,
          position: "relative"
        }}>
          {/* Replace this src with your uploaded image path, e.g., "/profile.jpg" */}
          <img 
            src="/profile.jpg" 
            alt="Profile" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            position: "absolute", inset: 0, display: "none", 
            alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-heading)", fontSize: 24, opacity: 0.3,
            color: theme.text, textTransform: "uppercase", textAlign: "center"
          }}>
            Drop<br/>profile.jpg<br/>in public/
          </div>
        </div>

        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <video 
            src="/portfolio.mp4" 
            controls 
            style={{ 
              width: "100%", 
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)", 
              outline: "none",
              border: `1.5px solid ${theme.text}25`
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-intro-container {
            flex-direction: column !important;
          }
          .profile-intro-container > div:first-child {
            width: 100% !important;
            flex: none !important;
            aspectRatio: "1/1" !important;
          }
        }
      `}</style>
    </div>
  );
}
