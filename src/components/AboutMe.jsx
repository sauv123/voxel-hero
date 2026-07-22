import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProfileIntroduction from "./ProfileIntroduction";

import manipalImg from "../assets/PXL_20230613_050806226.webp";
import founditImg from "../assets/IMG_128640.webp";
import mumbaiImg from "../assets/IMG_5539.webp";
import milanImg from "../assets/Screenshot 2026-06-01 at 11.17.15 AM.webp";
import ncaImg from "../assets/1745310056phpNlbiko.webp";
import Footer from "./Footer";
import BrandsSection from "./BrandsSection";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ────────────────────────────────────────────────────────────
const GAME_ROUNDS = [
  [
    { text: '"I was ranked AIR 8 in a spelling bee"', type: "TRUTH", explain: "True" },
    { text: '"I started my career with photography"', type: "TRUTH", explain: "True" },
    { text: '"I have climbed K2 camp"', type: "LIE", explain: "Lie" },
  ],
  [
    { text: '"I can play 2 instruments"', type: "TRUTH", explain: "True" },
    { text: '"I can solve a Rubik\'s Cube in 46 seconds"', type: "TRUTH", explain: "True" },
    { text: '"I can juggle 5 balls at once"', type: "LIE", explain: "Lie" },
  ],
  [
    { text: '"I did my schooling in Bangalore"', type: "TRUTH", explain: "True" },
    { text: '"I have a boxing video on YouTube"', type: "TRUTH", explain: "True" },
    { text: '"I have never been to a beach in my life"', type: "LIE", explain: "Lie" },
  ],
  [
    { text: '"I\'m an engineer"', type: "TRUTH", explain: "True" },
    { text: '"I got a pair of Jordans with my first salary"', type: "TRUTH", explain: "True" },
    { text: '"I have travelled all continents"', type: "LIE", explain: "Lie" },
  ],
  [
    { text: '"I prefer beaches over mountains"', type: "TRUTH", explain: "True" },
    { text: '"I have a chess rating of 800"', type: "TRUTH", explain: "True" },
    { text: '"I once auditioned for a reality singing show"', type: "LIE", explain: "Lie" },
  ],
];

const ALBUMS = [
  { title: "Territory", artist: "The Blaze", hue: "200,60%,18%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/34/14/ac/3414ac09-342b-b97b-26ee-26490f861d88/cover.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/40/aa/66/40aa66b0-dd63-05ae-228a-876cb5792928/mzaf_11033422413859371303.plus.aac.p.m4a" },
  { title: "Tadow", artist: "Masego, FKJ", hue: "240,40%,20%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5d/e3/8a/5de38af4-52e3-993d-213b-7bdfcf8a055f/842812109249.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/14/81/ce148198-9eef-6127-6865-cdd135a280d1/mzaf_15017844372361939175.plus.aac.p.m4a" },
  { title: "ASTROTHUNDER", artist: "Travis Scott", hue: "0,50%,20%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/af/36/e8/af36e868-2d69-025b-4d07-07bd30a817b8/mzaf_3760909874374307499.plus.aac.p.m4a" },
  { title: "Ustad", artist: "Baalti", hue: "0,60%,16%", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/3c/4c/653c4c73-e2cd-6fff-e8ba-ba6fb5d811c6/00_Cover_Art.jpg/300x300bb.jpg", audio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/60/ac/16/60ac163d-abf6-cf87-3e8a-a79c6f7bae6e/mzaf_16313706047862865627.plus.aac.p.m4a" },
];

const TIMELINE = [
  { id: 1, text: "Graduated from MIT Manipal.", photos: [{ src: ncaImg, bg: "#0d1a28", e: "🏫" }] },
  { id: 2, text: "Started my career in Bengaluru at foundit.", photos: [{ src: founditImg, bg: "#281a0d", e: "🚀" }] },
  { id: 3, text: "Moved to Mumbai in search of bigger opportunities.", photos: [{ src: manipalImg, bg: "#0d1428", e: "🎨" }] },
  { id: 4, text: "Launched my first product as a designer.", photos: [{ videoSrc: "/product.mp4", bg: "#28100d", e: "🏆", caption: "PRODUCT_V1" }] },
  { id: 5, text: "Took a leap of faith and moved to Milan for my Master's.", photos: [{ src: mumbaiImg, bg: "#0d1a28", e: "✈️" }] },
  { id: 6, text: "Came 3rd in NCA(design awards).", photos: [{ src: milanImg, bg: "#28280d", e: "🥉" }] },
];

// ─── Timeline (Mobile Responsive Optimized Sizes) ────────────────────
function TimelinePhoto({ photo, index, total, isMobile }) {
  const rot = total === 1 ? 0 : index === 0 ? -10 : index === 1 ? 7 : -4;
  const cardW = isMobile ? 140 : 260;
  const cardH = isMobile ? 170 : 300;

  return (
    <div className="timeline-photo timeline-photo-interactive" style={{
      position: "absolute",
      width: cardW, height: cardH,
      background: "#fff",
      padding: isMobile ? "4px 4px 18px 4px" : "8px 8px 30px 8px",
      boxShadow: "none",
      transform: `rotate(${rot}deg) translateX(${index * (isMobile ? 10 : 20)}px) translateY(${index * (isMobile ? 6 : 12)}px)`,
      zIndex: total - index,
      borderRadius: 4,
      display: "flex", flexDirection: "column",
      border: "1px solid rgba(0,0,0,0.15)"
    }}>
      <div style={{ flex: 1, background: photo.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 22 : 36, overflow: "hidden", position: "relative" }}>
        {photo.videoSrc ? (
          <video src={photo.videoSrc} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
        ) : photo.src ? (
          <img src={photo.src} alt={`About me photo ${index + 1}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
        ) : (
          photo.e
        )}
      </div>
      <div style={{ position: "absolute", bottom: 2, right: 6, fontSize: 7, fontFamily: "var(--font-body)", color: "#000", opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "90%" }}>
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
  const [isDragging, setIsDragging] = useState(false);
  const dragData = useRef(null);
  const vel = useRef(0);
  const raf = useRef(null);
  
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pxStep = isMobile ? 240 : 450;
  const lead = isMobile ? 120 : 300;
  const timelineHeight = isMobile ? 420 : 720;
  const axisY = isMobile ? 140 : 240;

  const totalW = lead + (TIMELINE.length - 1) * pxStep + Math.max(lead, cw / 2 + 150);
  const clamp = useCallback((v) => Math.max(0, Math.min(totalW - cw, v)), [totalW, cw]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setCw(e.contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const inertiaRef = useRef();
  const inertia = useCallback(() => {
    vel.current *= 0.94;
    if (Math.abs(vel.current) < 0.3) { vel.current = 0; return; }
    setScroll(p => clamp(p + vel.current));
    raf.current = requestAnimationFrame(inertiaRef.current);
  }, [clamp]);

  useEffect(() => {
    inertiaRef.current = inertia;
  }, [inertia]);

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
  }, [inertia, clamp, isMobile]);

  const onMouseDown = (e) => {
    cancelAnimationFrame(raf.current);
    vel.current = 0;
    dragging.current = true;
    setIsDragging(true);
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    dragData.current = { sx: clientX, ss: scroll, lx: clientX, lt: Date.now() };
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current || !dragData.current) return;
      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const dx = dragData.current.sx - clientX;
      const dt = Date.now() - dragData.current.lt || 1;
      vel.current = (clientX - dragData.current.lx) / dt * -16;
      dragData.current.lx = clientX;
      dragData.current.lt = Date.now();
      setScroll(clamp(dragData.current.ss + dx));
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      raf.current = requestAnimationFrame(inertia);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
    return () => { 
      window.removeEventListener("mousemove", move); 
      window.removeEventListener("mouseup", up); 
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [inertia, clamp]);

  return (
    <div style={{ padding: "0", margin: "0 auto", position: "relative", width: "100%" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
        fontFamily: "Space Mono, monospace",
        fontSize: isMobile ? "9px" : "11px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "rgba(0, 0, 0, 0.6)"
      }}>
        <span>Important Career Milestones</span>
        <span>Swipe / Drag to explore →</span>
      </div>

      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        style={{
          position: "relative", height: timelineHeight, borderRadius: 16,
          background: `#000`,
          border: `1px solid ${theme.text}20`,
          boxShadow: `none`,
          overflow: "hidden", cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: -scroll, width: totalW, height: "100%", willChange: "transform" }}>
          
          {/* Main Axis Line */}
          <div style={{ position: "absolute", left: 0, top: axisY, width: "100%", height: 2, background: `#FFFFFF30` }} />
          
          {/* Colored Progress Line */}
          <div style={{ 
            position: "absolute", left: 0, top: axisY, 
            width: scroll + cw / 2, 
            height: 2, 
            background: theme.text,
            transition: "width 0.1s ease-out" 
          }} />

          {/* Kinetic Background Numbers */}
          {TIMELINE.map((entry, idx) => {
            const x = lead + idx * pxStep;
            const isActive = idx === TIMELINE.length - 1 
              ? (scroll + cw / 2 >= x - (isMobile ? 120 : 250))
              : Math.abs(x - (scroll + cw / 2)) < (isMobile ? 120 : 250);
            return (
              <div key={entry.id} style={{
                position: "absolute", left: x, top: axisY - (isMobile ? 40 : 60),
                transform: `translate(-50%, -50%)`,
                fontSize: isMobile ? 70 : 180, fontWeight: 900,
                color: isActive && idx === 5 ? '#4ade80' : (isActive ? (theme.brand || '#FFF') : '#FFF'), 
                opacity: isActive ? 0.6 : 0.05,
                fontFamily: "var(--font-heading)",
                transition: "all 0.3s ease"
              }}>
                {String(idx + 1).padStart(2, '0')}
              </div>
            );
          })}

          {/* Photos & Connectors below axis */}
          {TIMELINE.map((entry, idx) => {
            const x = lead + idx * pxStep;
            const isPassed = x <= scroll + cw / 2;
            
            return (
              <div key={entry.id} style={{
                position: "absolute", left: x, top: axisY,
                display: "flex", flexDirection: "column", alignItems: "center"
              }}>
                <div style={{ width: 1, height: 12, background: isPassed ? theme.text : "rgba(255,255,255,0.2)" }} />
                <div style={{ 
                  width: 6, height: 6, borderRadius: "50%", 
                  background: isPassed ? theme.text : '#FFF', 
                  marginTop: -3, zIndex: 10
                }} />
                
                {/* Polaroid Box */}
                <div style={{ 
                  position: "relative", 
                  width: isMobile ? 140 : 260, 
                  height: isMobile ? 170 : 300, 
                  marginLeft: isMobile ? -70 : -130, 
                  marginTop: 12 
                }}>
                  {entry.photos.map((ph, i) => (
                    <TimelinePhoto key={i} photo={ph} index={i} total={entry.photos.length} theme={theme} isMobile={isMobile} />
                  ))}
                </div>

                {/* Text Description */}
                <div style={{
                  marginTop: isMobile ? 16 : 24, 
                  width: isMobile ? 130 : 220, 
                  textAlign: "center",
                  fontFamily: "var(--font-heading)", 
                  fontSize: isMobile ? 10 : 13, 
                  fontWeight: 700,
                  color: '#FFF', 
                  lineHeight: 1.3
                }}>
                  {entry.text}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Gradients to fade edges */}
        <div style={{position:"absolute",inset:0,left:0,width:80, background:`linear-gradient(to right,#000,transparent)`,pointerEvents:"none"}} />
        <div style={{position:"absolute",inset:0,left:"auto",right:0,width:80, background:`linear-gradient(to left,#000,transparent)`,pointerEvents:"none"}} />
      </div>
    </div>
  );
}

// ─── Two Truths and a Lie ────────────────────────────────────────────
function TruthsGame({ theme }) {
  const [phase, setPhase] = useState("playing");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState(() => [...GAME_ROUNDS[0]].sort(() => Math.random() - 0.5));
  const prevRound = useRef(0);
  
  useEffect(() => {
    if (prevRound.current !== round) {
      setCards([...GAME_ROUNDS[round]].sort(() => Math.random() - 0.5));
      prevRound.current = round;
    }
  }, [round]);

  const [jitter, setJitter] = useState(false);

  const triggerChat = () => {
    window.dispatchEvent(new Event('openContactModal'));
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
    <div style={{
      background: `#ffffff`,
      border: `none`,
      borderRadius: 4,
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      padding: "24px", position: "relative", color: theme.text, display:"flex", flexDirection:"column"
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <h3 style={{fontSize: 11, textTransform:"uppercase", letterSpacing: 2, color: theme.text, opacity: 0.5, margin:0, fontFamily: "var(--font-body)", fontWeight: 700}}>
          Two Truths and a Lie
        </h3>
        <span style={{fontSize: 10, color: theme.text, opacity: 0.5, fontFamily: "var(--font-body)", fontWeight: 700}}>
          {phase !== "finished" && `Round ${round+1} / ${GAME_ROUNDS.length}`}
        </span>
      </div>

      <div style={{
        display: phase === "playing" || phase === "revealed" ? "grid" : "none",
        gridTemplateColumns: "1fr",
        gap: 12, flex: 1
      }}>
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
                  ? (isLie ? "rgba(74, 222, 128, 0.15)" : "rgba(248, 113, 113, 0.08)") 
                  : (isPicked ? "#FFFA00" : `rgba(0,0,0,0.02)`), 
                borderRadius: 4, padding: "14px", minHeight: 70,
                cursor: phase==="playing"?"pointer":"default",
                border: revealed
                  ? `2px solid ${isLie ? "#4ade80" : "#f87171"}`
                  : (isPicked ? `2px solid #000` : `1px solid rgba(0,0,0,0.05)`),
                transition: "all 0.3s ease",
                display: "flex", flexDirection: "column", justifyContent: "center"
              }}
              className={(isPicked && revealed && !isLie && jitter) ? "about-jitter" : ""}
            >
              <p style={{
                fontSize: 13, fontWeight: 700, lineHeight: 1.4,
                marginBottom: revealed ? 8 : 0, color: (isPicked && !revealed) ? "#000" : theme.text,
                fontFamily: "var(--font-heading)", letterSpacing: "-0.01em", margin: 0
              }}>{c.text}</p>
              
              {revealed && (
                <div style={{animation:"about-fadeUp 0.4s ease both"}}>
                  <div style={{
                    display:"inline-block",padding:"2px 6px",borderRadius:3,
                    fontSize:8,fontWeight:900,letterSpacing:0.5,marginBottom:4,
                    background: isLie ? "#4ade80" : "#f87171",
                    color: isLie ? "#000" : "#fff", fontFamily:"var(--font-body)",
                    textTransform: "uppercase"
                  }}>{isLie ? "✓ LIE" : "✗ TRUTH"}</div>
                  <p style={{fontSize: 10, color: theme.text, lineHeight: 1.3, fontFamily:"var(--font-body)", opacity: 0.8, margin: 0}}>{c.explain}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {phase==="finished" && (
        <div style={{
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding: "16px 0", textAlign: "center", animation: "about-fadeUp 0.4s ease"
        }}>
          <h4 style={{ color: theme.text, fontSize: 18, marginBottom: 8, fontFamily: "var(--font-heading)", fontWeight: 900 }}>
            Score: {score} / {GAME_ROUNDS.length}
          </h4>
          <p style={{ color: theme.text, fontSize: 12, opacity: 0.8, marginBottom: 20, fontFamily: "var(--font-body)", lineHeight: 1.4 }}>
            {score >= 4 
              ? "Impressive! Let's build something great together."
              : "Let's connect and catch up over a quick chat or call."}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={triggerChat}
              style={{
                padding:"10px 20px",borderRadius:4,
                border:"none",
                background: "#000000",
                color: '#ffffff', fontSize: 11,
                fontWeight: 900, fontFamily: "var(--font-heading)",
                cursor: "pointer",
                textTransform: "uppercase", letterSpacing: 1
              }}
            >Let's Chat ↗</button>
            <button
              onClick={restart}
              style={{
                padding:"10px 20px",borderRadius:4,
                border:"1px solid rgba(0,0,0,0.15)",
                background: "transparent",
                color: theme.text, fontSize: 11,
                fontWeight: 900, fontFamily: "var(--font-heading)",
                cursor: "pointer",
                textTransform: "uppercase", letterSpacing: 1
              }}
            >Try Again</button>
          </div>
        </div>
      )}

      {phase==="revealed" && (
        <div style={{display: "flex", justifyContent: "center", marginTop: 20}}>
          <button
            onClick={next}
            style={{
              padding:"10px 20px",borderRadius:4,
              background: "#000000",
              border: "none",
              color: '#ffffff', fontSize: 11,
              fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-heading)",
              textTransform: "uppercase", letterSpacing: 1
            }}
          >{round===GAME_ROUNDS.length-1?"Show Final Score":"Next Round"}</button>
        </div>
      )}
    </div>
  );
}

// ─── Languages ─────────────────────────────────────────────────────────
function LanguagesToggle({ theme }) {
  const [lang, setLang] = useState("EN");
  
  return (
    <div style={{
      background: "#ffffff",
      padding: "24px",
      borderRadius: 4,
      color: theme.text,
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: theme.text, opacity: 0.5, margin: 0, fontFamily: "var(--font-body)", fontWeight: 700 }}>
          Languages
        </h3>
        <div style={{ display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: 4, padding: 2 }}>
          {["EN", "HI", "IT"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? "#000000" : "transparent",
              color: lang === l ? "#ffffff" : theme.text, 
              border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", 
              fontSize: 12, fontWeight: 700, fontFamily: "var(--font-heading)"
            }}>{l}</button>
          ))}
        </div>
      </div>
      
      <div style={{ minHeight: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {lang === "EN" ? (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 4, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>"Hey there!"</div>
            <div style={{ fontSize: 13, color: theme.text, opacity: 0.7, lineHeight: 1.4, fontFamily: "var(--font-body)" }}>
              I speak English fluently, having learned and worked in it from a young age.
            </div>
          </div>
        ) : lang === "HI" ? (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 4, fontFamily: "'Hind', sans-serif", letterSpacing: "-0.02em" }}>"कैसे हो!"</div>
            <div style={{ fontSize: 13, color: theme.text, opacity: 0.7, lineHeight: 1.4, fontFamily: "var(--font-body)" }}>
              हिंदी मेरी मातृभाषा है।
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 4, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>"Ciao!"</div>
            <div style={{ fontSize: 13, color: theme.text, opacity: 0.7, lineHeight: 1.4, fontFamily: "var(--font-body)" }}>
              Parlo anche un po' di italiano, vivendo a Milano.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quote Card ────────────────────────────────────────────────────────
function QuoteCard({ theme }) {
  const [pull, setPull] = useState(0);
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startPull = useRef(0);

  const handleDown = (e) => {
    dragging.current = true;
    setIsDragging(true);
    startX.current = e.clientX || e.touches?.[0].clientX;
    startPull.current = pull;
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragging.current) return;
      const x = e.clientX || e.touches?.[0].clientX;
      const dx = x - startX.current;
      const newPull = Math.max(0, Math.min(100, startPull.current + (dx / 150) * 100));
      setPull(newPull);
    };
    const handleUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      setPull(p => (p > 60 ? 100 : 0));
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
    <div style={{
      background: "#ffffff",
      borderRadius: 4,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      color: theme.text,
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      justifyContent: "space-between"
    }}>
      <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: theme.text, opacity: 0.5, marginBottom: 20, fontFamily: "var(--font-body)", fontWeight: 700 }}>
        Philosophy
      </h3>
      <p style={{
        fontSize: 17, fontWeight: 800, lineHeight: 1.3,
        color: theme.text,
        fontFamily: "var(--font-heading)",
        marginBottom: 16, letterSpacing: "-0.01em"
      }}>
        "A jack of all trades is a master of none<span style={{ opacity: pull / 100, display: pull === 0 ? 'none' : 'inline' }}>, but oftentimes better than a master of one.</span>"
      </p>
      
      <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", height: 2, background: `rgba(0,0,0,0.06)`, position: "absolute" }} />
        
         <div 
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          style={{
            position: "absolute", left: `${pull}%`, transform: "translateX(-50%)",
            width: 24, height: 24, borderRadius: "50%", background: "#000",
            cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)", transition: isDragging ? "none" : "left 0.3s ease",
            zIndex: 10
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFF" }} />
        </div>
        
        <div style={{ 
          position: "absolute", width: "100%", textAlign: "center", pointerEvents: "none",
          fontSize: 8, fontFamily: "Space Mono, monospace", color: "#888", opacity: pull === 100 ? 0 : Math.max(0.4, 1 - pull/50),
          letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700
        }}>
          {pull > 20 ? "Pull →" : "Slide →"}
        </div>
      </div>
    </div>
  );
}

// ─── Visual Journal Card ──────────────────────────────────────────────
function VisualGalleryCard({ theme }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 4,
      padding: "24px",
      color: theme.text,
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "150px",
      textAlign: "center"
    }}>
      <span style={{ fontSize: 28, marginBottom: 8 }}>🖼️</span>
      <h3 style={{ fontSize: 13, margin: "0 0 4px 0", fontFamily: "var(--font-heading)", fontWeight: 900 }}>Visual Journal</h3>
      <p style={{ fontSize: 10, color: "#888", fontFamily: "var(--font-body)", margin: 0 }}>Waiting for upload...</p>
    </div>
  );
}

// ─── Tools & Stack ───────────────────────────────────────────────────
function ToolboxSection({ theme }) {
  const [activeTab, setActiveTab] = useState("tools");

  const getToolLogo = (name) => {
    const term = name.toLowerCase();
    if (term.includes("figma")) return (
      <svg width="12" height="18" viewBox="0 0 38 57" fill="none" style={{ marginRight: "4px" }}>
        <path d="M19 28.5C24.2467 28.5 28.5 24.2467 28.5 19C28.5 13.7533 24.2467 9.5 19 9.5H9.5V28.5H19Z" fill="#F24E1E"/>
        <path d="M9.5 28.5C4.25329 28.5 0 24.2467 0 19C0 13.7533 4.25329 9.5 9.5 9.5H19V28.5H9.5Z" fill="#A259FF"/>
        <path d="M19 47.5C24.2467 47.5 28.5 43.2467 28.5 38C28.5 32.7533 24.2467 28.5 19 28.5H9.5V47.5H19Z" fill="#1ABCFE"/>
        <path d="M9.5 47.5C4.25329 47.5 0 43.2467 0 38C0 32.7533 4.25329 28.5 9.5 28.5H19V47.5H9.5Z" fill="#0ACF83"/>
        <path d="M19 57C13.7533 57 9.5 52.7467 9.5 47.5V38H19C24.2467 38 28.5 42.2533 28.5 47.5C28.5 52.7467 24.2467 57 19 57Z" fill="#FF7262"/>
      </svg>
    );
    if (term.includes("framer")) return (
      <svg width="12" height="18" viewBox="0 0 38 57" fill="none" style={{ marginRight: "4px" }}>
        <path d="M0 9.5H38V28.5H19L0 9.5Z" fill="#00C5FF" />
        <path d="M0 28.5H38L19 47.5V28.5H0Z" fill="#0055FF" />
        <path d="M19 47.5L38 28.5V47.5H19Z" fill="#000000" />
      </svg>
    );
    if (term.includes("react")) return (
      <svg width="14" height="14" viewBox="0 0 841.9 595.3" style={{ marginRight: "4px" }}>
        <g fill="none" stroke="#61DAFB" strokeWidth="58">
          <ellipse rx="84" ry="24" transform="rotate(0)"/>
          <ellipse rx="84" ry="24" transform="rotate(60)"/>
          <ellipse rx="84" ry="24" transform="rotate(120)"/>
        </g>
        <circle cx="0" cy="0" r="17" fill="#61DAFB"/>
      </svg>
    );
    if (term.includes("vite")) return (
      <svg width="14" height="14" viewBox="0 0 512 512" style={{ marginRight: "4px" }}>
        <path d="M256 0L48 96l208 416L464 96z" fill="url(#viteGrad)"/>
        <defs>
          <linearGradient id="viteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BD34FE" />
            <stop offset="100%" stopColor="#41B883" />
          </linearGradient>
        </defs>
      </svg>
    );
    if (term.includes("python")) return (
      <svg width="14" height="14" viewBox="0 0 110 110" style={{ marginRight: "4px" }}>
        <path d="M55 2c-15.3 0-24 1.4-27 4.2C24.4 9.5 24 16 24 24h31v3h-34c-6.8 0-12 1.4-14 3.7C5 33 5 40 5 48.7c0 8.7 0 15.6 2 18 2 2.3 7 3.7 14 3.7h9v-11c0-7.8 7-14.8 14.8-14.8h21c7.8 0 14.8-7 14.8-14.8V23c0-7.8-6.2-13.8-14-15.8C63.6 2.3 58 2 55 2z" fill="#3776AB"/>
        <path d="M55 108c15.3 0 24-1.4 27-4.2 3.6-3.3 4-9.8 4-17.8H55v-3h34c6.8 0 12-1.4 14-3.7 2-2.3 2-9.3 2-18 0-8.7 0-15.6-2-18-2-2.3-7-3.7-14-3.7h-9v11c0 7.8-7 14.8-14.8 14.8h-21C41.4 64.4 34.4 71.4 34.4 79.2v11c0 7.8 6.2 13.8 14 15.8 3.2 1.8 8.8 2 11.8 2z" fill="#FFE873"/>
      </svg>
    );
    if (term.includes("node")) return (
      <svg width="14" height="14" viewBox="0 0 256 256" style={{ marginRight: "4px" }}>
        <path d="M128 0L24 60v120l104 60 104-60V60z" fill="#339933" />
      </svg>
    );
    if (term.includes("git")) return (
      <svg width="14" height="14" viewBox="0 0 100 100" style={{ marginRight: "4px" }}>
        <path d="M92 44.5L55.5 8c-3-3-8-3-11 0L33 19.5l11.5 11.5c3.2-1 7 .2 9.5 2.8 2.5 2.5 3.8 6.2 2.8 9.5l11.5 11.5c3.3-1 7 .2 9.5 2.8 3.6 3.6 3.6 9.5 0 13.1-3.6 3.6-9.5 3.6-13.1 0-2.8-2.8-3.8-6.8-2.8-10.2L51 49c-1 3.2-4.2 5.5-7.7 5.5-4.5 0-8-3.5-8-8 0-3.5 2.3-6.7 5.5-7.7v-12L39.3 25l-27.5 27.5c-3 3-3 8 0 11l36.5 36.5c3 3 8 3 11 0l33-33c3-3.2 3-8.2-.3-12.5z" fill="#F05032" />
      </svg>
    );
    if (term.includes("claude")) return (
      <svg width="14" height="14" viewBox="0 0 256 256" style={{ marginRight: "4px" }}>
        <path d="M128 0c70.7 0 128 57.3 128 128s-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0z" fill="#D97706" />
      </svg>
    );
    return <span>✦</span>;
  };

  const categories = {
    tools: {
      label: "My Toolbox",
      items: ["Figma", "Framer", "Open Design", "Open Code", "Claude Code", "Claude", "Antigravity"]
    },
    ai: {
      label: "Currently Exploring",
      items: ["AI Agents", "Creative Coding", "Vocal UX", "Generative Interfaces"]
    },
    interests: {
      label: "Curious About",
      items: ["Proactive Design", "How AI Changes Trust", "Human-Machine Collaborations", "Spatial Computing", "Digital Experiences Beyond Screens"]
    }
  };

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 4,
      padding: "24px",
      color: theme.text,
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: theme.text, opacity: 0.5, margin: 0, fontFamily: "var(--font-body)", fontWeight: 700 }}>
          Tools & Stack
        </h3>
        
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(categories).map(catKey => (
            <button
              key={catKey}
              onClick={() => setActiveTab(catKey)}
              style={{
                background: activeTab === catKey ? "#000000" : "transparent",
                color: activeTab === catKey ? "#ffffff" : "#888",
                border: "none",
                fontSize: 12,
                fontWeight: 900,
                padding: "10px 18px",
                borderRadius: 4,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "all 0.2s"
              }}
            >
              {categories[catKey].label}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, contentVisibility: "auto", minHeight: 80, alignContent: "flex-start", paddingTop: 10 }}>
        {categories[activeTab].items.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: "10px 18px",
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.05)",
              color: "#000000",
              fontFamily: "Space Mono, monospace",
              fontSize: "12px",
              fontWeight: 700,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              animation: "about-fadeUp 0.3s ease both"
            }}
          >
            {getToolLogo(item)}
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Vinyl Player ────────────────────────────────────────────────────
function VinylPlayer({ theme }) {
  const [loaded, setLoaded] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [angle, setAngle] = useState(0);
  const [volume] = useState(80);
  const raf = useRef(null);
  const prevTime = useRef(null);
  const audioRef = useRef(null);

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
  }, [loaded, playing]);

  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (playing) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed", e);
        setPlaying(false);
      });
      prevTime.current = null;
      const spin = (t) => {
        if (prevTime.current) setAngle(a => (a + (t - prevTime.current) * 0.1) % 360);
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const album = ALBUMS[loaded];
  const tonearmAngle = playing ? 28 : -15;

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 4,
      border: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      padding: "24px", color: theme.text
    }}>
      <h3 style={{fontSize: 11, textTransform:"uppercase", letterSpacing: 2, color: theme.text, opacity: 0.5, marginBottom: 20, fontFamily: "var(--font-body)", fontWeight: 700}}>
        Music platter <span style={{ opacity: 0.6 }}>// Tap a record to play or drag on desktop</span>
      </h3>

      <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {/* Record Platter */}
        <div 
          onPointerDown={(e) => {
            if (!playing) setPlaying(true);
          }}
          onPointerMove={(e) => {
            if (e.buttons > 0 && !playing) setPlaying(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const i = e.dataTransfer.getData('albumIndex');
            if (i !== null && i !== "") {
              setLoaded(Number(i));
              setPlaying(true);
            }
          }}
          style={{
          position:"relative", width: 220, height: 220, background: "#111", borderRadius: 4,
          border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          cursor: playing ? "default" : "grab"
        }}>
          <div style={{
            width: 190, height: 190, borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, #080808 0%, #111 20%, #050505 40%, #111 60%, #080808 80%, #000 100%)`,
            border: "1.5px solid #222",
            transform: `rotate(${angle}deg)`,
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
          }}>
             <div style={{position: "absolute", inset: 12, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)"}} />
             <div style={{position: "absolute", inset: 24, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.02)"}} />
             <div style={{
               width: 60, height: 60, borderRadius: "50%",
               backgroundImage: `url(${album.cover})`,
               backgroundSize: "cover",
               backgroundPosition: "center",
               boxShadow: "0 0 15px rgba(0,0,0,0.8)"
             }} />
             <div style={{position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#000"}} />
          </div>

          <div style={{position: "absolute", top: 15, right: 15, width: 30, height: 30, borderRadius: "50%", background: "#222", border: "2px solid #000"}} />
          <div style={{
            position: "absolute", top: 30, right: 30, width: 6, height: 100,
            transformOrigin: "top center", transform: `rotate(${tonearmAngle}deg)`,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10
          }}>
            <div style={{position: "absolute", top: 0, right: 1, width: 6, height: 85, background: "linear-gradient(to right, #444, #888)", borderRadius: 3, transform: "rotate(12deg)", transformOrigin: "top center"}} />
            <div style={{position: "absolute", top: 90, right: 12, width: 10, height: 20, background: "#000", borderRadius: 1, transform: "rotate(35deg)"}} />
          </div>
          
          <div style={{position: "absolute", bottom: 15, right: 15}}>
            <button onClick={() => setPlaying(!playing)} style={{
              width: 36, height: 36, borderRadius: "50%", background: theme.text, border: "none",
              color: '#ffffff', display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)", fontSize: 13
            }}>
              {playing ? "⏸" : "▶"}
            </button>
          </div>
        </div>

        {/* Draggable Records Gallery */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
            {ALBUMS.map((a, i) => (
              <div 
                key={i} 
                draggable
                onDragStart={(e) => e.dataTransfer.setData('albumIndex', i)}
                onClick={() => { setLoaded(i); setPlaying(true); }} 
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "grab",
                  width: "120px",
                  transform: loaded === i ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              >
                {/* Mini Vinyl */}
                <div style={{
                  width: 120, height: 120, borderRadius: "50%",
                  background: `radial-gradient(circle at 50% 50%, #080808 0%, #111 20%, #050505 40%, #111 60%, #080808 80%, #000 100%)`,
                  border: loaded === i ? `2px solid rgba(0,0,0,0.8)` : `2px solid #222`,
                  position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: loaded === i ? "0 10px 25px rgba(0,0,0,0.3), 0 0 0 4px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{position: "absolute", inset: 6, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)"}} />
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    backgroundImage: `url(${a.cover})`, backgroundSize: "cover", backgroundPosition: "center",
                    boxShadow: "0 0 8px rgba(0,0,0,0.5)"
                  }} />
                  <div style={{position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "#000"}} />
                </div>
                {/* Text underneath */}
                <div style={{ textAlign: "center", width: "100%", opacity: loaded === i ? 1 : 0.6, transition: "opacity 0.3s" }}>
                  <div style={{fontSize: 12, fontFamily: "var(--font-heading)", fontWeight: 800, color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{a.title}</div>
                  <div style={{fontSize: 10, fontFamily: "var(--font-body)", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{a.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function AboutMe({ theme, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: '100vh' },
      { opacity: 1, y: '0vh', duration: 1, ease: 'power4.out', clearProps: 'transform' }
    );

    // Staggered entrance for sections
    gsap.fromTo('.about-section-reveal', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 180,
        backgroundColor: '#FCFAF2',
        color: theme.text,
        overflowX: "hidden",
        overflowY: "auto"
      }}
      className="scroll-container"
    >

      <div style={{ 
        paddingTop: 40, 
        paddingBottom: 100, 
        width: "100%",
        margin: "0 auto", 
        paddingLeft: "24px", 
        paddingRight: "24px",
        boxSizing: "border-box"
      }}>
        
        {/* Title */}
        <h1 className="about-section-reveal" style={{ 
          fontSize: "56px", 
          fontWeight: 900, 
          fontFamily: "var(--font-heading)", 
          marginBottom: "40px", 
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <span style={{ color: "#4ade80", fontSize: "40px" }}>✦</span> About Me
        </h1>
        
        {/* Profile Introduction Section */}
        <div className="about-section-reveal" style={{ marginBottom: "80px" }}>
          <ProfileIntroduction theme={theme} />
        </div>

        {/* Timeline block */}
        <div className="about-section-reveal" style={{ marginBottom: "32px" }}>
          <Timeline theme={theme} />
        </div>

        {/* Secondary Dashboard Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "16px",
          width: "100%"
        }}>
          <div className="about-section-reveal" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TruthsGame theme={theme} />
            <LanguagesToggle theme={theme} />
          </div>

          <div className="about-section-reveal" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <ToolboxSection theme={theme} />
            <VisualGalleryCard theme={theme} />
            <QuoteCard theme={theme} />
          </div>
        </div>

        {/* Platter component taking full width */}
        <div className="about-section-reveal" style={{ marginTop: "16px" }}>
          <VinylPlayer theme={theme} />
        </div>

        {/* Brands Section */}
        <div className="about-section-reveal" style={{ marginTop: "60px", marginBottom: "40px" }}>
          <BrandsSection theme={theme} />
        </div>

        {/* Footer Meta */}
        <div style={{
          paddingTop: "30px",
          display: "flex", justifyContent: "center", alignItems: "center",
          borderTop: `1px solid rgba(0,0,0,0.06)`,
          marginTop: "40px",
          marginBottom: "60px"
        }}>
          <p style={{ fontSize: 9, color: theme.text, opacity: 0.4, fontFamily: "Space Mono, monospace", letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>
            Sauveer Sinha • Milan, Italy
          </p>
        </div>
      </div>
      
      {/* Global Footer */}
      <Footer theme={theme} activeChar="deer" />
    </div>
  );
}
