import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from "react";
import manipalImg from "../assets/PXL_20230613_050806226.webp";
import founditImg from "../assets/IMG_128640.webp";
import mumbaiImg from "../assets/IMG_5539.webp";
import milanImg from "../assets/Screenshot 2026-06-01 at 11.17.15 AM.webp";
import ncaImg from "../assets/1745310056phpNlbiko.webp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

// ─── DATA ────────────────────────────────────────────────────────────
const GAME_ROUNDS = [
  [
    { text: '"I was ranked AIR 8 in a spelling bee."', type: "TRUTH", explain: "True." },
    { text: '"I started my career with photography."', type: "TRUTH", explain: "True." },
    { text: '"I have climbed K2 camp."', type: "LIE", explain: "Lie." },
  ],
  [
    { text: '"I can play 2 instruments."', type: "TRUTH", explain: "True." },
    { text: '"I can solve a Rubik\'s Cube in 46 seconds."', type: "TRUTH", explain: "True." },
    { text: '"I can juggle 5 balls at once."', type: "LIE", explain: "Lie." },
  ],
  [
    { text: '"I did my schooling in Bangalore."', type: "TRUTH", explain: "True." },
    { text: '"I have a boxing video on YouTube."', type: "TRUTH", explain: "True." },
    { text: '"I have never been to a beach in my life."', type: "LIE", explain: "Lie." },
  ],
  [
    { text: '"I\'m an engineer."', type: "TRUTH", explain: "True." },
    { text: '"I got a pair of Jordans with my first salary."', type: "TRUTH", explain: "True." },
    { text: '"I have travelled all continents."', type: "LIE", explain: "Lie." },
  ],
  [
    { text: '"I prefer beaches over mountains."', type: "TRUTH", explain: "True." },
    { text: '"I have a chess rating of 800."', type: "TRUTH", explain: "True." },
    { text: '"I once auditioned for a reality singing show."', type: "LIE", explain: "Lie." },
  ],
];

const ALBUMS = [
  { title: "Territory", artist: "The Blaze", hue: "200,60%,18%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/34/14/ac/3414ac09-342b-b97b-26ee-26490f861d88/cover.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/40/aa/66/40aa66b0-dd63-05ae-228a-876cb5792928/mzaf_11033422413859371303.plus.aac.p.m4a" },
  { title: "Tadow", artist: "Masego, FKJ", hue: "240,40%,20%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5d/e3/8a/5de38af4-52e3-993d-213b-7bdfcf8a055f/842812109249.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/14/81/ce148198-9eef-6127-6865-cdd135a280d1/mzaf_15017844372361939175.plus.aac.p.m4a" },
  { title: "ASTROTHUNDER", artist: "Travis Scott", hue: "0,50%,20%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/af/36/e8/af36e868-2d69-025b-4d07-07bd30a817b8/mzaf_3760909874374307499.plus.aac.p.m4a" },
  { title: "Ustad", artist: "Baalti", hue: "0,60%,16%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/3c/4c/653c4c73-e2cd-6fff-e8ba-ba6fb5d811c6/00_Cover_Art.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/60/ac/16/60ac163d-abf6-cf87-3e8a-a79c6f7bae6e/mzaf_16313706047862865627.plus.aac.p.m4a" },
];

const WORK_EXPERIENCE = [
  { company: "Bips", role: "Product Designer", year: "2024 - Present", color: "#6366f1", icon: "B" },
  { company: "BambooHR", role: "UX Designer", year: "2023 - 2024", color: "#64748b", icon: "B" },
  { company: "Delicious AI", role: "Product Designer", year: "2022 - 2023", color: "#f43f5e", icon: "D" },
  { company: "Outcode", role: "UI/UX Designer", year: "2021 - 2022", color: "#0ea5e9", icon: "O" },
  { company: "Avalaunch Media", role: "Designer", year: "2020 - 2021", color: "#f97316", icon: "A" },
];

const TIMELINE = [
  { id:1, text: "Graduated from MIT Manipal.", photos:[{src: milanImg, bg:"#0d1a28", e:"🏫"}] },
  { id:2, text: "Started my career in Bengaluru at foundit.", photos:[{src: founditImg, bg:"#281a0d", e:"🚀"}] },
  { id:3, text: "Moved to Mumbai in search of bigger opportunities.", photos:[{src: manipalImg, bg:"#0d1428", e:"🎨"}] },
  { id:4, text: "Launched my first product as a designer.", photos:[{videoSrc:"/product.mp4", bg:"#28100d", e:"🏆", caption: "PRODUCT_V1"}] },
  { id:5, text: "Took a leap of faith and moved to Milan for my Master's.", photos:[{src: ncaImg, bg:"#0d1a28", e:"✈️"}] },
  { id:6, text: "Came 3rd in NCA(design awards).", photos:[{src: mumbaiImg, bg:"#28280d", e:"🥉"}] },
];

const PX_STEP = 450;
const LEAD = 300;

function stepToX(index) {
  return LEAD + index * PX_STEP;
}

// ─── Timeline ────────────────────────────────────────────────────────
function TimelinePhoto({ photo, index, total, theme }) {
  const rot = total === 1 ? 0 : index === 0 ? -10 : index === 1 ? 7 : -4;
  return (
    <div className="timeline-photo timeline-photo-interactive" style={{
      position: "absolute",
      width: 260, height: 300,
      background: "#fff",
      padding: "8px 8px 30px 8px",
      boxShadow: "none",
      transform: `rotate(${rot}deg) translateX(${index * 20}px) translateY(${index * 12}px)`,
      zIndex: total - index,
      borderRadius: 4,
      display: "flex", flexDirection: "column",
      border: "1px solid rgba(0,0,0,0.15)"
    }}>
      <div style={{flex: 1, background: photo.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, overflow: "hidden", position: "relative"}}>
        {photo.videoSrc ? (
          <video src={photo.videoSrc} autoPlay loop muted playsInline style={{width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0}} />
        ) : photo.src ? (
          <img src={photo.src} alt={`About me photo ${i + 1}`} loading="lazy" style={{width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0}} />
        ) : (
          photo.e
        )}
      </div>
      <div style={{ position: "absolute", bottom: 4, right: 6, fontSize: 8, fontFamily: "var(--font-body)", color: "#000", opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "90%" }}>
        {photo.caption || `IMG_${photo.e.codePointAt(0)}`}
      </div>
    </div>
  );
}

function Timeline({ theme }) {
  const containerRef = useRef(null);
  const [scroll, setScroll] = useState(0);
  const [cw, setCw] = useState(900);
  const dragging = useRef(false);
  const dragData = useRef(null);
  const vel = useRef(0);
  const raf = useRef(null);

  const totalW = LEAD * 2 + (TIMELINE.length - 1) * PX_STEP;
  const clamp = useCallback((v) => Math.max(0, Math.min(totalW - cw, v)), [totalW, cw]);
  const center = scroll + cw / 2;

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setCw(e.contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const inertia = useCallback(() => {
    vel.current *= 0.94;
    if (Math.abs(vel.current) < 0.3) { vel.current = 0; return; }
    setScroll(p => clamp(p + vel.current));
    raf.current = requestAnimationFrame(inertia);
  }, [clamp]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      cancelAnimationFrame(raf.current);
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      vel.current = d * 0.85;
      setScroll(p => clamp(p + d * 0.85));
      raf.current = requestAnimationFrame(inertia);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [inertia, clamp]);

  const onMouseDown = (e) => {
    cancelAnimationFrame(raf.current);
    vel.current = 0;
    dragging.current = true;
    dragData.current = { sx: e.clientX, ss: scroll, lx: e.clientX, lt: Date.now() };
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current || !dragData.current) return;
      const dx = dragData.current.sx - e.clientX;
      const dt = Date.now() - dragData.current.lt || 1;
      vel.current = (e.clientX - dragData.current.lx) / dt * -16;
      dragData.current.lx = e.clientX;
      dragData.current.lt = Date.now();
      setScroll(clamp(dragData.current.ss + dx));
    };
    const up = () => {
      dragging.current = false;
      raf.current = requestAnimationFrame(inertia);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [inertia, clamp]);

  return (
    <div style={{ padding: "0 40px" }}>
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        style={{
          position: "relative", height: 720, borderRadius: 4,
          background: `#000`,
          border: `1px solid ${theme.text}20`,
          boxShadow: `none`,
          overflow: "hidden", cursor: dragging.current ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: -scroll, width: totalW, height: "100%", willChange: "transform" }}>
          
          {/* Main Axis Line */}
          <div style={{ position: "absolute", left: 0, top: 240, width: "100%", height: 2, background: `#FFFFFF30` }} />
          
          {/* Colored Progress Line */}
          <div style={{ 
            position: "absolute", left: 0, top: 240, 
            width: scroll + cw / 2, 
            height: 2, 
            background: theme.text,
            transition: "width 0.1s ease-out" 
          }} />

          {/* Kinetic Background Numbers */}
          {TIMELINE.map((entry, idx) => {
            const x = stepToX(idx);
            const d = Math.abs(x - center);
            const t = Math.max(0, 1 - d / (PX_STEP * 1.5)); 
            const sz = 32 + t * 50; 
            const op = 0.03 + t * 0.12;
            
            return (
              <div key={entry.id} style={{
                position: "absolute", left: x, top: 180,
                transform: `translate(-50%, -50%) rotate(${scroll * 0.05}deg)`,
                fontSize: 180, fontWeight: 900,
                color: '#FFF', opacity: 0.05,
                fontFamily: "var(--font-heading)"
              }}>
                {String(idx + 1).padStart(2, '0')}
              </div>
            );
          })}

          {/* Photos & Connectors below axis */}
          {TIMELINE.map((entry, idx) => {
            const x = stepToX(idx);
            const isPassed = x <= scroll + cw / 2;
            
            return (
              <div key={entry.id} style={{
                position: "absolute", left: x, top: 240,
                display: "flex", flexDirection: "column", alignItems: "center"
              }}>
                {/* Technical Connector line */}
                <div style={{ width: 1, height: 12, background: isPassed ? theme.text : "rgba(255,255,255,0.2)" }} />
                
                <div style={{ 
                  width: 6, height: 6, borderRadius: "50%", 
                  background: isPassed ? theme.text : '#FFF', 
                  marginTop: -3, zIndex: 10
                }} />
                
                {/* Polaroids */}
                <div style={{ position: "relative", width: 260, height: 300, marginLeft: -130, marginTop: 12 }}>
                  {entry.photos.map((ph, i) => (
                    <TimelinePhoto key={i} photo={ph} index={i} total={entry.photos.length} theme={theme} />
                  ))}
                </div>

                {/* Text Description */}
                <div style={{
                  marginTop: 24, width: 220, textAlign: "center",
                  fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
                  color: '#FFF', lineHeight: 1.4
                }}>
                  {entry.text}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Gradients to fade edges */}
        <div style={{position:"absolute",inset:0,left:0,width:160, background:`linear-gradient(to right,#000,transparent)`,pointerEvents:"none"}} />
        <div style={{position:"absolute",inset:0,left:"auto",right:0,width:160, background:`linear-gradient(to left,#000,transparent)`,pointerEvents:"none"}} />

        <div style={{
          position:"absolute", bottom:20, left:24,
          fontSize:9, color: `#FFFFFF50`, letterSpacing:2,
          fontFamily:"var(--font-body)", fontWeight:700, zIndex:20,
          textTransform:"uppercase",
        }}>Important milestones of my career, drag to explore</div>
      </div>
    </div>
  );
}

// ─── Video ────────────────────────────────────────────────────────────
function VideoSection({ theme }) {
  return (
    <div style={{ padding: "0 40px" }}>
      <div
        style={{
          position:"relative", width:"100%", aspectRatio:"16/8", maxWidth: 1000, margin: "0 auto",
          borderRadius:2, overflow:"hidden",
          border: `1.5px solid ${theme.text}25`,
          background: `${theme.text}05`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <p style={{
          fontFamily:"var(--font-heading)",
          fontSize: 48,
          fontWeight:900,
          textTransform: "uppercase",
          color: theme.text,
          opacity: 0.3
        }}>
          Coming Soon
        </p>
      </div>
    </div>
  );
}

// ─── Work Experience ─────────────────────────────────────────────────────────
function WorkExperience({ theme }) {
  return (
    <div className="modern-brutal-card" style={{
      background: `transparent`,
      border: `1px solid ${theme.text}20`,
      padding:32, height:"100%", display: "flex", flexDirection: "column", color: theme.text
    }}>
      <h3 style={{fontSize: 12, textTransform:"uppercase", letterSpacing: 3, color: theme.text, opacity: 0.7, marginBottom: 32, fontFamily: "var(--font-body)", fontWeight: 700}}>Career</h3>
      <div style={{display: "flex", flexDirection: "column", gap: 28, flex: 1, justifyContent: "center"}}>
        {WORK_EXPERIENCE.map((job, i) => (
          <div key={i} style={{display: "flex", alignItems: "center", gap: 20}}>
            <div style={{width: 50, height: 50, borderRadius: 25, background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 900, color: "white"}}>
              {job.icon}
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 18, fontWeight: 700, color: "#000", fontFamily:"var(--font-heading)", letterSpacing: "-0.02em"}}>{job.company}</div>
              <div style={{fontSize: 13, color: "#000", opacity: 0.6, fontFamily:"var(--font-body)", textTransform: "uppercase", letterSpacing: 0.5}}>{job.role}</div>
            </div>
<div
  style={{
    padding: "6px 14px",
    borderRadius: 4,
    border: `1px solid ${theme.text}`,
    fontSize: 10,
    color: theme.text,
    opacity: 0.8,
    background: `rgba(0,0,0,0.05)`,
    fontFamily: "var(--font-body)",
    fontWeight: 700,
  }}
>
  {job.year}
</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Languages Toggle ────────────────────────────────────────────────────────
function LanguagesToggle({ theme }) {
  const [lang, setLang] = useState("EN");
  
  return (
    <div className="modern-brutal-card" style={{
      background: `transparent`,
      border: `1px solid ${theme.text}20`,
      padding:32, position: "relative", color: theme.text
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h3 style={{fontSize: 12, textTransform:"uppercase", letterSpacing: 3, color: theme.text, opacity: 0.7, margin:0, fontFamily: "var(--font-body)", fontWeight: 700}}>Languages</h3>
        <div style={{
          display: "flex", background: `${theme.text}10`, borderRadius: 4, padding: 4, border: `1px solid ${theme.text}40`
        }}>
          <button onClick={() => setLang("EN")} style={{
            background: lang==="EN" ? theme.text : "transparent",
            color: lang==="EN" ? theme.bg : theme.text, 
            border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer", 
            fontSize: 11, fontWeight: 700, fontFamily: "var(--font-heading)"
          }}>EN</button>
          <button onClick={() => setLang("HI")} style={{
            background: lang==="HI" ? theme.text : "transparent",
            color: lang==="HI" ? theme.bg : theme.text, 
            border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer", 
            fontSize: 11, fontWeight: 700, fontFamily: "var(--font-heading)"
          }}>HI</button>
          <button onClick={() => setLang("IT")} style={{
            background: lang==="IT" ? theme.text : "transparent",
            color: lang==="IT" ? theme.bg : theme.text, 
            border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer", 
            fontSize: 11, fontWeight: 700, fontFamily: "var(--font-heading)"
          }}>IT</button>
        </div>
      </div>
      
      <div style={{minHeight: 100, display: "flex", flexDirection: "column", justifyContent: "center"}}>
        {lang === "EN" ? (
          <div style={{animation: "about-fadeUp 0.3s ease"}}>
            <div style={{fontSize: 32, fontWeight: 800, color: theme.text, marginBottom: 6, fontFamily:"var(--font-heading)", letterSpacing: "-0.03em"}}>"Hey there!"</div>
            <div style={{fontSize: 15, color: theme.text, opacity: 0.7, lineHeight: 1.5, fontFamily:"var(--font-body)"}}>
              I speak English fluently, having learned it from a young age.
            </div>
          </div>
        ) : lang === "HI" ? (
          <div style={{animation: "about-fadeUp 0.3s ease"}}>
            <div style={{fontSize: 32, fontWeight: 800, color: theme.text, marginBottom: 6, fontFamily:"'Hind', 'Noto Sans Devanagari', sans-serif", letterSpacing: "-0.03em"}}>"कैसे हो!"</div>
            <div style={{fontSize: 15, color: theme.text, opacity: 0.7, lineHeight: 1.5, fontFamily:"var(--font-body)"}}>
              हिंदी मेरी मातृभाषा है।
            </div>
          </div>
        ) : (
          <div style={{animation: "about-fadeUp 0.3s ease"}}>
            <div style={{fontSize: 32, fontWeight: 800, color: theme.text, marginBottom: 6, fontFamily:"var(--font-heading)", letterSpacing: "-0.03em"}}>"Ciao!"</div>
            <div style={{fontSize: 15, color: theme.text, opacity: 0.7, lineHeight: 1.5, fontFamily:"var(--font-body)"}}>
              Parlo anche un po' di italiano.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Hobbies ─────────────────────────────────────────────────────────────────
function HobbiesCard({ theme, onOpenHobbies }) {
  return (
    <div className="modern-brutal-card" onClick={onOpenHobbies} style={{
      background: `transparent`, cursor: "pointer",
      border: `1px solid ${theme.text}20`,
      padding:32, display: "flex", flexDirection: "column", justifyContent: "space-between"
    }}>
      <h3 style={{fontSize: 12, textTransform:"uppercase", letterSpacing: 3, color: theme.text, opacity: 0.7, margin:0, fontFamily: "var(--font-body)", fontWeight: 700}}>My Gallery</h3>
      
      <div>
        <div style={{fontSize: 36, fontWeight: 800, color: theme.text, marginBottom: 8, fontFamily:"var(--font-heading)", letterSpacing: "-0.02em"}}>Visual Gallery</div>
        <div style={{fontSize: 14, color: theme.text, opacity: 0.6, fontFamily: "var(--font-body)", lineHeight: 1.5}}>
          Photography, travel, and creative exploration.
        </div>
      </div>
      
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div style={{
          fontSize: 14, fontWeight: 900, color: theme.bg, letterSpacing: 2, textTransform: "uppercase", 
          background: theme.text, padding: "10px 24px", borderRadius: 4, border: `1.5px solid ${theme.text}`,
          fontFamily:"var(--font-body)",
        }}>
          Rank: Blue Belt
        </div>
      </div>
    </div>
  );
}

// ─── Quote ───────────────────────────────────────────────────────────────────
function QuoteCard({ theme }) {
  const [pull, setPull] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startPull = useRef(0);

  const handleDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX || e.touches?.[0].clientX;
    startPull.current = pull;
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragging.current) return;
      const x = e.clientX || e.touches?.[0].clientX;
      const dx = x - startX.current;
      // Require 200px drag to reach 100%
      const newPull = Math.max(0, Math.min(100, startPull.current + (dx / 200) * 100));
      setPull(newPull);
    };
    const handleUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      // Snap to full if pulled past 60%, otherwise snap back
      setPull(p => {
        if (p > 60) return 100;
        return 0;
      });
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  return (
    <div className="modern-brutal-card" style={{
      background: `transparent`,
      border: `1px solid ${theme.text}20`,
      padding:32, display: "flex", flexDirection: "column",
      position: "relative", color: theme.text
    }}>
      <h3 style={{fontSize: 12, textTransform:"uppercase", letterSpacing: 3, color: theme.text, opacity: 0.7, marginBottom: 24, fontFamily: "var(--font-body)", fontWeight: 700}}>Philosophy</h3>
      <p style={{
        fontSize:26, fontWeight: 800, lineHeight:1.3,
        color:theme.text,
        fontFamily:"var(--font-heading)",
        marginBottom:20, flex: 1, letterSpacing: "-0.02em"
      }}>
        "A jack of all trades is a master of none<span style={{ opacity: pull / 100, display: pull === 0 ? 'none' : 'inline' }}>, but oftentimes better than a master of one.</span>"
      </p>
      
      {/* Pull Interaction */}
      <div style={{ position: "relative", height: 40, marginTop: "auto", display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", height: 2, background: `rgba(0,0,0,0.2)`, position: "absolute" }} />
        <div style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0, opacity: pull / 100, background: `linear-gradient(to right, rgba(0,0,0,0.2), transparent)`, pointerEvents: "none" }} />
        
        <div 
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          style={{
            position: "absolute", left: `${pull}%`, transform: "translateX(-50%)",
            width: 30, height: 30, borderRadius: "50%", background: "#000",
            cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)", transition: dragging.current ? "none" : "left 0.3s ease",
            zIndex: 10
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFF" }} />
        </div>
        
        <div style={{ 
          position: "absolute", width: "100%", textAlign: "center", pointerEvents: "none",
          fontSize: 10, fontFamily: "var(--font-body)", color: "#000", opacity: pull === 100 ? 0 : Math.max(0.4, 1 - pull/50),
          letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, transition: dragging.current ? "none" : "opacity 0.3s"
        }}>
          {pull > 20 ? "Pull Harder →" : "Pull Handle →"}
        </div>
      </div>
    </div>
  );
}

// ─── Truths Game ────────────────────────────────────────────────────────────
function TruthsGame({ theme }) {
  const [phase, setPhase] = useState("idle");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  
  // Jumble the options every time a new round starts
  const cards = useMemo(() => {
    return [...GAME_ROUNDS[round]].sort(() => Math.random() - 0.5);
  }, [round]);

  const [jitter, setJitter] = useState(false);

  const getScoreMessage = (s) => {
    if (s === 5) return { text: "Flawless victory! Are you my biographer?", emoji: "🏆" };
    if (s === 4) return { text: "Impressive deduction. Almost perfect.", emoji: "🕵️" };
    if (s === 3) return { text: "Not bad, but you've still got much to learn.", emoji: "🤔" };
    if (s === 2) return { text: "Did you even read my portfolio?", emoji: "😅" };
    if (s === 1) return { text: "Oof. That was rough.", emoji: "🤡" };
    return { text: "Who are you and what are you doing here?", emoji: "💀" };
  };

  const pick = (i) => {
    if (phase !== "playing") return;
    setPicked(i); 
    setPhase("revealed");
    if (cards[i].type === "LIE") {
      setScore(s => s + 1);
    } else {
      setJitter(true);
      setTimeout(() => setJitter(false), 500);
    }
  };
  const next = () => {
    if (round === GAME_ROUNDS.length - 1) {
      setPhase("finished");
    } else {
      setRound(r => r + 1);
      setPicked(null); setPhase("playing");
    }
  };
  const restart = () => {
    setRound(0);
    setScore(0);
    setPicked(null);
    setPhase("playing");
  };

  return (
    <div className="modern-brutal-card" style={{
      background: `transparent`,
      border: `1px solid ${theme.text}20`,
      padding:40, position: "relative", color: theme.text, display:"flex", flexDirection:"column"
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
        <h3 style={{fontSize: 12, textTransform:"uppercase", letterSpacing: 3, color: theme.text, opacity: 0.5, margin:0, fontFamily: "var(--font-body)", fontWeight: 700}}>
          Two Truths and a Lie
        </h3>
        <span style={{fontSize: 11, color: theme.text, opacity: 0.5, fontFamily: "var(--font-body)", fontWeight: 700}}>
          {phase!=="idle" && `Round ${round+1} / ${GAME_ROUNDS.length}`}
        </span>
      </div>

      <div style={{position:"relative",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20, flex: 1}}>
        {cards.map((c,i) => {
          const revealed = phase==="revealed";
          const isPicked = picked===i;
          const isLie = c.type==="LIE";
          
          return (
            <div
              key={i}
              onClick={()=>pick(i)}
              style={{
                background: revealed 
                  ? (isLie ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)") 
                  : (isPicked ? "#FFFA00" : `${theme.text}05`), 
                borderRadius:2, padding:"24px", minHeight:220,
                cursor: phase==="playing"?"pointer":"default",
                border: revealed
                  ? `3px solid ${isLie ? "#4ade80" : "#f87171"}`
                  : (isPicked ? `3px solid #000` : `1.5px solid ${theme.text}15`),
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: (isPicked && revealed && isLie) ? "translateY(-8px) scale(1.02)" : "none",
                boxShadow: (isPicked && revealed && isLie) ? `8px 8px 0 ${theme.text}30` : "none",
                display: "flex", flexDirection: "column"
              }}
              className={(isPicked && revealed && !isLie && jitter) ? "about-jitter" : ""}
            >
              <p style={{
                fontSize:18, fontWeight: 700, lineHeight:1.4,
                marginBottom:20, color: (isPicked && !revealed) ? "#000" : theme.text,
                fontFamily:"var(--font-heading)", flex: 1, letterSpacing: "-0.01em"
              }}>{c.text}</p>
              
              {revealed && (
                <div style={{animation:"about-fadeUp 0.4s ease both"}}>
                  <div style={{
                    display:"inline-block",padding:"6px 14px",borderRadius:4,
                    fontSize:11,fontWeight:900,letterSpacing:2,marginBottom:12,
                    background: isLie ? "#4ade80" : "#f87171",
                    color: isLie ? "#000" : "#fff", fontFamily:"var(--font-body)",
                    textTransform: "uppercase"
                  }}>{isLie ? "✅ CORRECT (LIE)" : "❌ WRONG (TRUTH)"}</div>
                  <p style={{fontSize:13, color: theme.text, lineHeight:1.5, fontFamily:"var(--font-body)", opacity: 0.8}}>{c.explain}</p>
                </div>
              )}
            </div>
          );
        })}

        {phase==="idle" && (
          <div style={{
            position:"absolute",inset:0,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            background: `rgba(0,0,0,0.85)`, backdropFilter: "blur(8px)",
            borderRadius:2, zIndex: 10, padding: 40, textAlign: "center"
          }}>
            <h2 style={{ color: "#FCFAF2", fontSize: 28, marginBottom: 20, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>How to Play</h2>
            <div style={{ color: "#FCFAF2", fontSize: 14, opacity: 0.9, marginBottom: 40, fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
              Each round has 3 statements about a person:<br/>
              <strong style={{color: "#4ade80"}}>2 statements are true</strong><br/>
              <strong style={{color: "#f87171"}}>1 statement is a lie</strong><br/><br/>
              The goal is to guess which one is the lie.
            </div>
            <button
              onClick={()=>setPhase("playing")}
              style={{
                padding:"16px 40px",borderRadius:4,
                border:"none",
                background: theme.text,
                color: '#FCFAF2', fontSize: 16,
                fontWeight: 900, fontFamily: "var(--font-heading)",
                cursor: "pointer",
                boxShadow: "none",
                transition: "transform 0.2s",
                textTransform: "uppercase", letterSpacing: 2
              }}
              onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
              onMouseLeave={e=>e.target.style.transform="scale(1)"}
            >Check Answer</button>
          </div>
        )}

        {phase==="finished" && (
          <div style={{
            position:"absolute",inset:0,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            background: `rgba(0,0,0,0.85)`, backdropFilter: "blur(8px)",
            borderRadius:2, zIndex: 10, padding: 40, textAlign: "center"
          }}>
            <div style={{fontSize: 64, marginBottom: 10}}>{getScoreMessage(score).emoji}</div>
            <h2 style={{ color: "#FCFAF2", fontSize: 24, marginBottom: 8, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>Final Score: {score} / {GAME_ROUNDS.length}</h2>
            <div style={{ color: "#4ade80", fontSize: 16, fontWeight: 700, opacity: 0.9, marginBottom: 30, fontFamily: "var(--font-body)", letterSpacing: 1 }}>
              "{getScoreMessage(score).text}"
            </div>
            <button
              onClick={restart}
              style={{
                padding:"12px 32px",borderRadius:4,
                border:"none",
                background: theme.text,
                color: '#FCFAF2', fontSize: 14,
                fontWeight: 800, fontFamily: "var(--font-heading)",
                cursor: "pointer",
                textTransform: "uppercase", letterSpacing: 1
              }}
            >Restart Game</button>
          </div>
        )}
      </div>

      {phase==="revealed" && (
        <div style={{display: "flex", justifyContent: "center", marginTop: 32}}>
          <button
            onClick={next}
            style={{
              padding:"12px 32px",borderRadius:4,
              background: theme.text,
              border: "none",
              color: '#FCFAF2', fontSize: 14,
              fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-heading)",
              textTransform: "uppercase", letterSpacing: 1
            }}
          >{round===GAME_ROUNDS.length-1?"Play Again":"Next Round →"}</button>
        </div>
      )}
    </div>
  );
}

// ─── Vinyl Player ────────────────────────────────────────────────────────────
function VinylPlayer({ theme }) {
  const [loaded, setLoaded] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [angle, setAngle] = useState(0);
  const [volume, setVolume] = useState(80);
  const raf = useRef(null);
  const prevTime = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Update audio source when album changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = ALBUMS[loaded].audio;
      audioRef.current.load();
      if (playing) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed", e);
          setPlaying(false);
        });
      }
    }
  }, [loaded]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (playing) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed", e);
        setPlaying(false);
      });
      prevTime.current = null;
      const spin = (t) => {
        if (prevTime.current) setAngle(a => (a + (t-prevTime.current)*0.1) % 360);
        prevTime.current = t;
        raf.current = requestAnimationFrame(spin);
      };
      raf.current = requestAnimationFrame(spin);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(raf.current);
    }
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const album = ALBUMS[loaded];
  
  const tonearmAngle = playing ? 28 : -15;

  return (
    <div className="modern-brutal-card" style={{
      background: `transparent`,
      border: `1px solid ${theme.text}20`,
      padding:40, color: theme.text
    }}>
      <h3 style={{fontSize: 12, textTransform:"uppercase", letterSpacing: 3, color: theme.text, opacity: 0.5, marginBottom: 40, fontFamily: "var(--font-body)", fontWeight: 700}}>
        Music <span style={{ opacity: 0.6 }}>// Drag a record to the platter</span>
      </h3>

      <div style={{display:"flex",gap:60,alignItems:"center"}}>
        {/* Record Player Body */}
        <div 
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const idx = e.dataTransfer.getData("album_idx");
            if (idx !== "") {
              setLoaded(Number(idx));
              setPlaying(true);
            }
          }}
          style={{
          position:"relative", width: 300, height: 300, background: "#111", borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          {/* Platter */}
          <div style={{
            width:260,height:260,borderRadius:"50%",
            background: `radial-gradient(circle at 50% 50%, #080808 0%, #111 20%, #050505 40%, #111 60%, #080808 80%, #000 100%)`,
            border: "1.5px solid #222",
            transform:`rotate(${angle}deg)`,
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
          }}>
             {/* Record Grooves */}
             <div style={{position: "absolute", inset: 15, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)"}} />
             <div style={{position: "absolute", inset: 30, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.02)"}} />
             <div style={{position: "absolute", inset: 45, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)"}} />
             
             {/* Label / Album Cover */}
             <div style={{
               width: 90, height: 90, borderRadius: "50%",
               backgroundImage: `url(${album.cover})`,
               backgroundSize: "cover",
               backgroundPosition: "center",
               display: "flex", alignItems: "center", justifyContent: "center",
               boxShadow: "0 0 20px rgba(0,0,0,0.8)",
               transition: "background-image 0.5s ease"
             }}>
             </div>
             {/* Center hole */}
             <div style={{position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "#000", border: "1px solid #111"}} />
          </div>

          {/* Tonearm Base */}
          <div style={{position: "absolute", top: 30, right: 30, width: 50, height: 50, borderRadius: "50%", background: "#222", border: "2.5px solid #000", boxShadow: "0 4px 15px rgba(0,0,0,0.5)"}} />
          
          {/* Tonearm */}
          <div style={{
            position: "absolute", top: 55, right: 55, width: 10, height: 160,
            transformOrigin: "top center", transform: `rotate(${tonearmAngle}deg)`,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10
          }}>
            <div style={{position: "absolute", top: 0, right: 1, width: 10, height: 140, background: "linear-gradient(to right, #444, #888, #333)", borderRadius: 5, transform: "rotate(12deg)", transformOrigin: "top center", border: "1px solid #000"}} />
            <div style={{position: "absolute", top: 145, right: 24, width: 20, height: 36, background: "#000", borderRadius: 3, transform: "rotate(35deg)"}} />
          </div>
          
          {/* Controls */}
          <div style={{position: "absolute", bottom: 25, right: 25}}>
            <button onClick={() => setPlaying(!playing)} style={{
              width: 50, height: 50, borderRadius: "50%", background: theme.text, border: "none",
              color: '#FCFAF2', display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              boxShadow: "6px 6px 0 rgba(0,0,0,0.2)", transition: "all 0.2s", fontSize: 20
            }}
            onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
            onMouseLeave={e=>e.target.style.transform="scale(1)"}
            >
              {playing ? "||" : "▶"}
            </button>
          </div>
          
          {/* Volume Slider */}
          <div style={{position: "absolute", bottom: 25, left: 25, width: 80, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start"}}>
            <span style={{fontSize: 9, color: "#888", fontWeight: 900, letterSpacing: 2, fontFamily: "var(--font-body)"}}>GAIN.LVL</span>
            <input type="range" min="0" max="100" value={volume} onChange={e=>setVolume(e.target.value)} style={{width: "100%", accentColor: theme.text, cursor: "pointer"}} />
          </div>
        </div>

        {/* Albums List */}
        <div style={{flex: 1}}>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20}}>
            {ALBUMS.map((a, i) => (
              <div 
                key={i} 
                draggable
                onDragStart={e => e.dataTransfer.setData("album_idx", i)}
                onClick={() => { setLoaded(i); setPlaying(true); }} 
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: 16,
                  background: loaded === i ? `${theme.text}1A` : `transparent`,
                  border: `1px solid ${loaded === i ? theme.text + '30' : 'transparent'}`,
                  borderRadius: 16, cursor: "pointer", transition: "all 0.3s ease",
                  transform: loaded === i ? "translateY(-2px)" : "none",
                  boxShadow: loaded === i ? `0 8px 24px -8px rgba(0,0,0,0.1)` : "none"
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                  backgroundImage: `url(${a.cover})`, backgroundSize: "cover", backgroundPosition: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#000", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{fontSize: 16, fontWeight: 700, color: loaded === i ? '#FCFAF2' : theme.text, marginBottom: 4, fontFamily:"var(--font-heading)", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{a.title}</div>
                  <div style={{fontSize: 12, color: loaded === i ? '#FCFAF2' : theme.text, opacity: 0.7, fontFamily:"var(--font-body)", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{a.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AboutMe({ theme, onClose }) {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const [hobbiesOpen, setHobbiesOpen] = useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: '100vh' },
      { opacity: 1, y: '0vh', duration: 1, ease: 'power4.out', clearProps: 'transform' }
    );
    // Smooth opacity transition for background text
    gsap.fromTo('.about-bg-text', { opacity: 0 }, { opacity: 0.03, duration: 1.5, delay: 0.5 });

    // Staggered entrance for sections
    gsap.fromTo('.about-section-reveal', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.6 }
    );
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: '100vh',
      duration: 0.8,
      ease: 'power3.in',
      onComplete: onClose
    });
  };

  return (
    <div 
        ref={containerRef} 
        className="about-overlay" 
        style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 9999,
            backgroundColor: '#FCFAF2',
            color: theme.text,
            fontFamily: "var(--font-heading)",
            overflowX: "hidden",
            overflowY: "auto"
        }}
    >
      <div className="about-grain-overlay" />

      {/* Close Button */}
      <div 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 32, right: 32, width: 48, height: 48,
          borderRadius: '50%', backgroundColor: theme.text, color: theme.bg,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer', zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>

      {/* Large Background Decorative Text */}
      <div className="about-bg-text" style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-15deg)",
        fontSize: "40vw", fontWeight: 900, whiteSpace: "nowrap", pointerEvents: "none",
        color: theme.text, opacity: 0.03, zIndex: -1, fontFamily: "var(--font-heading)"
      }}>
        ABOUT.ME
      </div>



      <div style={{paddingTop: 80, paddingBottom: 120, maxWidth: "1280px", margin: "0 auto"}}>
        
        {/* Header Section */}
        <div className="about-fade-up" style={{padding:"0 40px 48px"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:20}}>
            <h1 style={{
              fontSize: clampValue(80, "12vw", 140), 
              fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.9,
              color: theme.text,
              fontFamily: 'var(--font-heading)'
            }}>About.Me</h1>
          </div>
        </div>
        
        {/* Timeline Component */}
        <div className="about-section-reveal">
          <Timeline theme={theme} />
        </div>

        {/* Video Section */}
        <div style={{marginTop: 80}} className="about-section-reveal">
          <div style={{padding:"0 40px 24px"}}>
            <h2 style={{
              fontSize: 12, color: theme.text, opacity: 0.5, letterSpacing: 4,
              textTransform: "uppercase", fontWeight: 900,
              fontFamily: "var(--font-body)",
            }}>Introduction</h2>
          </div>
          <VideoSection theme={theme} />
        </div>

        {/* Secondary Info Grid */}
        <div style={{padding:"60px 40px 40px", marginTop: 40}}>
          <div style={{marginBottom: 60}} className="about-section-reveal">
            <h2 style={{
              fontSize: 80, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.9,
              color: theme.text, textTransform: "uppercase"
            }}>
              Beyond<br/>the Pixels
            </h2>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:32,marginBottom:32}} className="about-section-reveal">
            <TruthsGame theme={theme} />
            <ToolboxSection theme={theme} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:32,marginBottom:32}} className="about-section-reveal">
            <LanguagesToggle theme={theme} />
            <HobbiesCard theme={theme} onOpenHobbies={() => setHobbiesOpen(true)} />
            <QuoteCard theme={theme} />
          </div>

          <div className="about-section-reveal">
            <VinylPlayer theme={theme} />
          </div>
        </div>

        {/* Footer Meta */}
        <div style={{
          padding:"60px 40px 0",
          display:"flex", justifyContent:"center", alignItems:"center",
          borderTop:`1.5px solid ${theme.text}15`,
          marginTop:40,
        }}>
          <p style={{fontSize:11, color:theme.text, opacity:0.4, fontFamily:"var(--font-body)", letterSpacing:2, fontWeight: 700}}>
            Sauveer Sinha
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Toolbox Section & Accordion ──────────────────────────────
function ToolboxAccordion({ title, note, desc, items, theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'figma': return '🎨';
      case 'framer': return '⚡';
      case 'openhuman': return '👤';
      case 'opencode': return '💻';
      case 'opendesign': return '📐';
      case 'claude': return '🧠';
      case 'antigravity': return '🚀';
      case 'ai agents': return '🤖';
      case 'creative coding': return '✨';
      case 'vocal ux': return '🗣️';
      case 'generative interfaces': return '🌌';
      case 'proactive design': return '🎯';
      case 'how ai changes trust': return '🤝';
      case 'human-machine collaboration': return '🦾';
      case 'digital experiences beyond screens.': return '🌐';
      default: return '✦';
    }
  };

  return (
    <div style={{
      border: `1px solid ${theme.text}20`,
      boxShadow: `none`,
      borderRadius: 4, overflow: "hidden",
      display: "flex", flexDirection: "column",
      marginBottom: 32
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "24px", cursor: "pointer", 
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: isOpen ? theme.text : "transparent",
          color: isOpen ? theme.bg : theme.text,
          transition: "all 0.3s ease"
        }}
      >
        <div>
          <p style={{fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, opacity: 0.7, margin: "0 0 8px 0", textTransform: 'uppercase'}}>{note}</p>
          <h4 style={{fontSize: 24, fontWeight: 900, margin: 0, textTransform: 'uppercase'}}>{title}</h4>
        </div>
        <div style={{fontSize: 24, fontWeight: 900}}>{isOpen ? '−' : '+'}</div>
      </div>
      
      <div 
        ref={contentRef}
        style={{
          maxHeight: isOpen ? 500 : 0, 
          overflow: "hidden", 
          transition: "max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          background: "transparent"
        }}
      >
        <div style={{padding: 24, borderTop: `2px solid ${theme.text}20`}}>
          {desc && <p style={{fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, opacity: 0.7, margin: "0 0 20px 0"}}>{desc}</p>}
          <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16}}>
            {items.map(item => (
              <li key={item} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading)"}}>
                <span style={{fontSize: 24, display: 'inline-block'}}>{getIcon(item)}</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ToolboxSection({ theme }) {
  const dockItems = ["Figma", "Framer", "Adobe"];
  const categories = [
    {
      title: "AI Toolbox",
      desc: "My go-to agents & models.",
      items: ["Opencode", "Opendesign", "Claude", "Antigravity"]
    },
    {
      title: "Currently Exploring",
      desc: "Things I'm actively learning.",
      items: ["AI Agents", "Creative Coding", "Vocal UX", "Gen UI"]
    },
    {
      title: "Curious About",
      desc: "Ideas I keep coming back to.",
      items: ["Proactive Design", "Human-machine trust", "Digital experiences"]
    }
  ];

  const getIcon = (name) => {
    if(name.toLowerCase().includes('figma')) return (
      <svg width="28" height="28" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 28.5C24.2467 28.5 28.5 24.2467 28.5 19C28.5 13.7533 24.2467 9.5 19 9.5H9.5V28.5H19Z" fill="#F24E1E"/>
        <path d="M9.5 28.5C4.25329 28.5 0 24.2467 0 19C0 13.7533 4.25329 9.5 9.5 9.5H19V28.5H9.5Z" fill="#A259FF"/>
        <path d="M19 47.5C24.2467 47.5 28.5 43.2467 28.5 38C28.5 32.7533 24.2467 28.5 19 28.5H9.5V47.5H19Z" fill="#1ABCFE"/>
        <path d="M9.5 47.5C4.25329 47.5 0 43.2467 0 38C0 32.7533 4.25329 28.5 9.5 28.5H19V47.5H9.5Z" fill="#0ACF83"/>
        <path d="M19 57C13.7533 57 9.5 52.7467 9.5 47.5V38H19C24.2467 38 28.5 42.2533 28.5 47.5C28.5 52.7467 24.2467 57 19 57Z" fill="#FF7262"/>
      </svg>
    );
    if(name.toLowerCase().includes('framer')) return (
      <svg width="28" height="28" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 9.5H38V28.5H19L0 9.5Z" fill="#000" />
        <path d="M0 28.5H38L19 47.5V28.5H0Z" fill="#000" />
        <path d="M19 47.5L38 28.5V47.5H19Z" fill="#000" />
      </svg>
    );
    if(name.toLowerCase().includes('adobe')) return (
      <svg width="28" height="28" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M164.21 21.33h91.79v213.34h-91.79L164.21 21.33z" fill="#FF0000"/>
        <path d="M91.79 21.33H0v213.34h91.79L91.79 21.33z" fill="#FF0000"/>
        <path d="M128 75.33l62.48 159.34h-41.22l-15.65-42.34H110.15l28.66-72.33-10.81 28.5L96.34 234.67H55.13L128 75.33z" fill="#FF0000"/>
      </svg>
    );
    if(name.toLowerCase().includes('ai') || name.toLowerCase().includes('claude') || name.toLowerCase().includes('antigravity')) return '🧠';
    if(name.toLowerCase().includes('code')) return '💻';
    return '✦';
  };

  return (
    <div className="modern-brutal-card" style={{
      background: `transparent`,
      border: `1px solid ${theme.text}20`,
      padding: 32, display: "flex", flexDirection: "column", color: theme.text
    }}>
      <h3 style={{fontSize: 12, textTransform:"uppercase", letterSpacing: 3, color: theme.text, opacity: 0.7, marginBottom: 24, fontFamily: "var(--font-body)", fontWeight: 700}}>Field Notes</h3>
      
      {/* iOS Style Dock for top tools */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, marginTop: 10 }}>
        <div style={{
          background: "rgba(100,100,100,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${theme.text}20`,
          borderRadius: 24,
          padding: "12px 16px",
          display: "flex", gap: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}>
          {dockItems.map(item => (
            <div key={item} style={{
              width: 52, height: 52, borderRadius: 14,
              background: theme.text, color: theme.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, cursor: "pointer", transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2) translateY(-8px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            title={item}
            >
              {getIcon(item)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {categories.map((cat, idx) => (
          <ToolboxAccordion 
            key={idx} 
            title={cat.title} 
            desc={cat.desc} 
            items={cat.items} 
            theme={theme} 
            note={`0${idx+1}`} 
          />
        ))}
      </div>
    </div>
  );
}

// Helper for responsive font sizes
function clampValue(min, val, max) {
  return `clamp(${min}px, ${val}, ${max}px)`;
}
