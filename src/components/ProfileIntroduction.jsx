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

        <div style={{ flex: "1" }}>
          <h3 style={{
            fontSize: 48, fontWeight: 900, fontFamily: "var(--font-heading)",
            color: theme.text, marginBottom: 24, lineHeight: 1.1, letterSpacing: "-0.02em"
          }}>
            I build digital experiences that matter.
          </h3>
          <p style={{
            fontSize: 16, fontFamily: "var(--font-body)", color: theme.text,
            opacity: 0.8, lineHeight: 1.7, marginBottom: 24
          }}>
            I am a multidisciplinary Product Designer blending deep technical understanding with human-centered aesthetics. From conceptualizing 3D interactive experiences to crafting seamless mobile interfaces, I design digital products that leave a lasting impact.
          </p>
          <p style={{
            fontSize: 16, fontFamily: "var(--font-body)", color: theme.text,
            opacity: 0.8, lineHeight: 1.7
          }}>
            With a background in UI/UX, generative interfaces, and creative coding, I bridge the gap between imagination and execution.
          </p>
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
