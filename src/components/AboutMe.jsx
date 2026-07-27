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
    { text: '"I was ranked AIR 8"', type: "TRUTH", explain: "I was good in spelling B" },
    { text: '"I started my career with photography"', type: "TRUTH", explain: "My first camera was a Canon EOS 1000D" },
    { text: '"I have climbed K2 camp"', type: "LIE", explain: "That's my dream goal" },
  ],
  [
    { text: '"I can play 2 instruments"', type: "TRUTH", explain: "Guitar and piano" },
    { text: '"I can solve a Rubik\'s Cube in 46 seconds"', type: "TRUTH", explain: "Yes, I was pretty good at it" },
    { text: '"I can juggle 5 balls at once"', type: "LIE", explain: "It would be a struggle" },
  ],
  [
    { text: '"I did my schooling in Bangalore"', type: "TRUTH", explain: "Yes. In NHVPS" },
    { text: '"I have a boxing video on YouTube"', type: "TRUTH", explain: "Yes, an amateur one" },
    { text: '"I have never been to a beach in my life"', type: "LIE", explain: "I've been to plenty of pretty beaches" },
  ],
  [
    { text: '"I\'m an engineer"', type: "TRUTH", explain: "Yes. I'm a print and media engineer" },
    { text: '"I got a pair of Jordans with my first salary"', type: "TRUTH", explain: "The Hyper Royals" },
    { text: '"I have travelled all continents"', type: "LIE", explain: "Only two. Till now." },
  ],
  [
    { text: '"I prefer beaches over mountains"', type: "TRUTH", explain: "Yes" },
    { text: '"I have a chess rating of 800"', type: "TRUTH", explain: "Yes, I love to play chess" },
    { text: '"I once auditioned for a reality singing show"', type: "LIE", explain: "No, I only sing in the shower" },
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

function Timeline({ theme }) {
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(".timeline-line-bg",
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 1, ease: "power2.inOut" }
      )
      .fromTo(".timeline-dot",
        { scale: 0 },
        { scale: 1, duration: 0.4, stagger: 0.15, ease: "back.out(2)" },
        "-=0.8"
      )
      .fromTo(".timeline-content",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power2.out" },
        "-=0.8"
      );

      // Scroll-based animations
      const entries = gsap.utils.toArray(".timeline-entry");
      const scroller = containerRef.current;
      
      // Animate the fill line on scroll
      gsap.to(".timeline-line-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: listRef.current,
          scroller: scroller,
          start: "top 50%",
          end: "bottom 50%",
          scrub: true
        }
      });
      
      entries.forEach((entry, i) => {
        const dot = entry.querySelector(".timeline-dot");
        
        // Dissolve when scrolling up past the top
        gsap.to(entry, {
          opacity: 0,
          scale: 0.95,
          filter: "blur(4px)",
          scrollTrigger: {
            trigger: entry,
            scroller: scroller,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        // Dot turns brand color as you scroll to it
        gsap.to(dot, {
          backgroundColor: theme.brand,
          scrollTrigger: {
            trigger: entry,
            scroller: scroller,
            start: "top 70%",
            end: "top 40%",
            scrub: true
          }
        });
      });
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="custom-scroll" style={{
      background: "#111111",
      borderRadius: 4,
      color: '#FCFAF2',
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column",
      height: "400px",
      overflowY: "auto",
      position: "relative"
    }}>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, position: "sticky", top: 0, background: "#111111", zIndex: 10, padding: "24px 24px 10px 24px" }}>
        <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: '#FCFAF2', opacity: 0.5, margin: 0, fontFamily: "var(--font-body)", fontWeight: 700 }}>
          Timeline
        </h3>
      </div>
      
      <div ref={listRef} style={{ position: "relative", paddingLeft: "48px", paddingRight: "24px" }}>
        {/* Vertical line background */}
        <div className="timeline-line-bg" style={{ position: "absolute", left: "30px", top: 0, bottom: "24px", width: "2px", background: "rgba(255,255,255,0.1)" }} />
        {/* Vertical line fill (animates on scroll) */}
        <div className="timeline-line-fill" style={{ position: "absolute", left: "30px", top: 0, bottom: "24px", width: "2px", background: theme.brand, transformOrigin: "top", transform: "scaleY(0)" }} />
        
        {TIMELINE.map((entry, idx) => (
          <div key={entry.id} className="timeline-entry" style={{ position: "relative", marginBottom: "32px", willChange: "transform, opacity" }}>
            <div className="timeline-dot" style={{ position: "absolute", left: "-22px", top: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
            
            <div className="timeline-content">
              <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-body)", marginBottom: "12px", lineHeight: 1.4 }}>
                {entry.text}
              </div>
              
              <div className="custom-scroll" style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {entry.photos.map((ph, i) => (
                <div key={i} style={{
                  width: "120px", height: "150px", flexShrink: 0, borderRadius: "6px", overflow: "hidden", position: "relative", background: ph.bg, border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {ph.videoSrc ? (
                    <video src={ph.videoSrc} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : ph.src ? (
                    <img src={ph.src} alt="Timeline" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "32px" }}>{ph.e}</div>
                  )}
                  {ph.caption && (
                    <div style={{ position: "absolute", bottom: "4px", right: "6px", fontSize: "8px", fontFamily: "var(--font-body)", color: "#ffffff", opacity: 0.8, background: "rgba(0,0,0,0.5)", padding: "2px 4px", borderRadius: 2 }}>
                      {ph.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

// ─── Two Truths and a Lie ────────────────────────────────────────────
function TruthsGame({ theme }) {
  const [phase, setPhase] = useState("intro");
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
    <div className="custom-scroll" style={{
      background: `#111111`,
      border: `none`,
      borderRadius: 4,
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      padding: "24px", position: "relative", color: '#FCFAF2', display:"flex", flexDirection:"column",
      height: "400px"
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <h3 style={{fontSize: 11, textTransform:"uppercase", letterSpacing: 2, color: '#FCFAF2', opacity: 0.5, margin:0, fontFamily: "var(--font-body)", fontWeight: 700}}>
          Two Truths and a Lie
        </h3>
        <span style={{fontSize: 10, color: '#FCFAF2', opacity: 0.5, fontFamily: "var(--font-body)", fontWeight: 700}}>
          {phase === "intro" ? "Mini Game" : phase !== "finished" && `Round ${round+1} / ${GAME_ROUNDS.length}`}
        </span>
      </div>

      {phase === "intro" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          flex: 1, textAlign: "center", padding: "20px 0", animation: "about-fadeUp 0.4s ease"
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            backdropFilter: "blur(8px)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FCFAF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09009 9.00002C9.32519 8.33169 9.78924 7.76813 10.4001 7.40915C11.011 7.05018 11.7314 6.91896 12.4391 7.03873C13.1468 7.15851 13.7994 7.52154 14.2885 8.06584C14.7777 8.61013 15.0733 9.3031 15.127 10.0298C15.1807 10.7565 14.9893 11.4727 14.5855 12.0573C14.1818 12.6419 13.5904 13.0583 12.9126 13.2323C12.2348 13.4062 11.5126 13.3262 10.8703 13.0069C10.228 12.6876 9.70582 12.1481 9.39009 11.477" stroke="#FCFAF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="#FCFAF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ color: '#FCFAF2', fontSize: 13, opacity: 0.9, marginBottom: 24, fontFamily: "var(--font-body)", lineHeight: 1.5, maxWidth: "240px" }}>
            Each round has two truths and one lie, spot the lie to score.
          </p>
          <button
            onClick={() => setPhase("playing")}
            style={{
              padding: "10px 24px", borderRadius: 4,
              background: "#ffffff", color: "#111111", border: "none",
              fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12,
              cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Start Playing
          </button>
        </div>
      )}

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
                background: "#fdf8e1", // note paper yellow
                borderRadius: 2, 
                padding: revealed ? "12px 24px 12px 16px" : "16px", 
                minHeight: revealed ? 50 : 60,
                cursor: phase==="playing"?"pointer":"default",
                border: "none",
                boxShadow: "2px 4px 10px rgba(0,0,0,0.15)",
                transform: `rotate(${[-1.5, 2, -1][i % 3]}deg) scale(${isPicked && !revealed ? 1.02 : 1})`,
                transition: "all 0.3s ease",
                display: "flex", flexDirection: "column", justifyContent: "center",
                color: "#111111",
                position: "relative"
              }}
              className={(isPicked && revealed && !isLie && jitter) ? "about-jitter" : ""}
            >
              <p style={{
                fontSize: revealed ? 12 : 13, fontWeight: 700, lineHeight: 1.3,
                marginBottom: revealed ? 4 : 0, color: "#111111",
                fontFamily: "var(--font-heading)", letterSpacing: "-0.01em", margin: 0
              }}>{c.text}</p>
              
              {revealed && (
                <div style={{animation:"about-fadeUp 0.4s ease both"}}>
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    right: "12px",
                    transform: "translateY(-50%) rotate(-10deg)",
                    fontSize: 28,
                    fontWeight: 900,
                    color: isLie ? "#16a34a" : "#ef4444",
                    opacity: 0.8
                  }}>
                    {isLie ? "✓" : "✗"}
                  </div>
                  <p style={{fontSize: 11, color: '#444444', lineHeight: 1.3, fontFamily:"var(--font-body)", margin: 0}}>{c.explain}</p>
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
          <h4 style={{ color: '#FCFAF2', fontSize: 18, marginBottom: 8, fontFamily: "var(--font-heading)", fontWeight: 900 }}>
            Score: {score} / {GAME_ROUNDS.length}
          </h4>
          <p style={{ color: '#FCFAF2', fontSize: 12, opacity: 0.8, marginBottom: 20, fontFamily: "var(--font-body)", lineHeight: 1.4 }}>
            {score >= 4 
              ? "Impressive! Let's build something great together."
              : "Let's connect and catch up over a quick chat or call."}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={triggerChat}
              style={{
                padding:"10px 20px",borderRadius:4,
                background: "#ffffff",
                color: '#000000', fontSize: 11,
                border: `none`,
                fontWeight: 900, fontFamily: "var(--font-heading)",
                textTransform: "uppercase", letterSpacing: 1, cursor:"pointer"
              }}
            >
              Let's Chat
            </button>
            <button
              onClick={restart}
              style={{
                padding:"10px 20px",borderRadius:4,
                background: "transparent",
                color: '#FCFAF2', fontSize: 11,
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
              background: "#ffffff",
              border: "none",
              color: '#000000', fontSize: 11,
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
      background: "#111111",
      padding: "24px",
      borderRadius: 4,
      color: '#FCFAF2',
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column",
      height: "240px",
      overflowY: "hidden"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: '#FCFAF2', opacity: 0.5, margin: 0, fontFamily: "var(--font-body)", fontWeight: 700 }}>
          Languages
        </h3>
        <div style={{ display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: 4, padding: 2 }}>
          {[{key: "EN", label: "EN"}, {key: "HI", label: "HI"}, {key: "IT", label: "IT"}].map(l => (
            <button key={l.key} onClick={() => setLang(l.key)} style={{
              background: lang === l.key ? "#333333" : "transparent",
              color: lang === l.key ? "#ffffff" : theme.text, 
              border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", 
              fontSize: 12, fontWeight: 700, fontFamily: "var(--font-heading)"
            }}>{l.label}</button>
          ))}
        </div>
      </div>
      
      <div style={{ minHeight: 80, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        {lang === "EN" ? (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#FCFAF2', marginBottom: 4, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>"Hey there!"</div>
            <div style={{ fontSize: 13, color: '#FCFAF2', opacity: 0.7, lineHeight: 1.4, fontFamily: "var(--font-body)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>I speak English fluently, having learned and worked in it from a young age.</span>
              <span style={{ fontSize: 24, marginLeft: 12 }}>🇺🇸</span>
            </div>
          </div>
        ) : lang === "HI" ? (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#FCFAF2', marginBottom: 4, fontFamily: "'Hind', sans-serif", letterSpacing: "-0.02em" }}>"कैसे हो!"</div>
            <div style={{ fontSize: 13, color: '#FCFAF2', opacity: 0.7, lineHeight: 1.4, fontFamily: "var(--font-body)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>हिंदी मेरी मातृभाषा है।</span>
              <span style={{ fontSize: 24, marginLeft: 12 }}>🇮🇳</span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#FCFAF2', marginBottom: 4, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>"Ciao!"</div>
            <div style={{ fontSize: 13, color: '#FCFAF2', opacity: 0.7, lineHeight: 1.4, fontFamily: "var(--font-body)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Parlo anche un po' di italiano, vivendo a Milano.</span>
              <span style={{ fontSize: 24, marginLeft: 12 }}>🇮🇹</span>
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
      background: "#111111",
      borderRadius: 4,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      color: '#FCFAF2',
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      justifyContent: "space-between",
      height: "240px"
    }}>
      <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: '#FCFAF2', opacity: 0.5, marginBottom: 20, fontFamily: "var(--font-body)", fontWeight: 700 }}>
        Philosophy
      </h3>
      <p style={{
        fontSize: 17, fontWeight: 800, lineHeight: 1.3,
        color: '#FCFAF2',
        fontFamily: "var(--font-heading)",
        marginBottom: 16, letterSpacing: "-0.01em"
      }}>
        "A jack of all trades is a master of none<span style={{ opacity: pull / 100, display: pull === 0 ? 'none' : 'inline' }}>, but oftentimes better than a master of one.</span>"
      </p>
      
      <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", height: 2, background: `rgba(255, 255, 255, 0.15)`, position: "absolute" }} />
        
         <div 
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          style={{
            position: "absolute", left: `${pull}%`, transform: "translateX(-50%)",
            width: 24, height: 24, borderRadius: "50%", background: "#ffffff",
            cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)", transition: isDragging ? "none" : "left 0.3s ease",
            zIndex: 10
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#000000" }} />
        </div>
        
        <div style={{ 
          position: "absolute", width: "100%", textAlign: "center", pointerEvents: "none",
          fontSize: 8, fontFamily: "Space Mono, monospace", color: "rgba(255, 255, 255, 0.6)", opacity: pull === 100 ? 0 : Math.max(0.4, 1 - pull/50),
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
      background: "#111111",
      borderRadius: 4,
      padding: "24px",
      color: '#FCFAF2',
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      justifyContent: "center",
      alignItems: "center",
      height: "400px",
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
      background: "#111111",
      borderRadius: 4,
      padding: "24px",
      color: '#FCFAF2',
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column",
      height: "400px",
      overflow: "hidden"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: '#FCFAF2', opacity: 0.5, margin: 0, fontFamily: "var(--font-body)", fontWeight: 700 }}>
          Tools & Stack
        </h3>
        
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(categories).map(catKey => (
            <button
              key={catKey}
              onClick={() => setActiveTab(catKey)}
              style={{
                background: activeTab === catKey ? "#333333" : "transparent",
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
              color: "#ffffff",
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
      background: "#111111",
      borderRadius: 4,
      border: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      padding: "24px", color: '#FCFAF2'
    }}>
      <h3 style={{fontSize: 11, textTransform:"uppercase", letterSpacing: 2, color: '#FCFAF2', opacity: 0.5, marginBottom: 20, fontFamily: "var(--font-body)", fontWeight: 700}}>
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

          <div style={{position: "absolute", top: 15, right: 15, width: 30, height: 30, borderRadius: "50%", background: "#222", border: "2px solid #555"}} />
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
            <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"} style={{
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
                  <div style={{fontSize: 12, fontFamily: "var(--font-heading)", fontWeight: 800, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{a.title}</div>
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
  const invertedTheme = { ...theme, bg: '#0a0a0a', text: '#FCFAF2' };

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
      role="dialog"
      aria-modal="true"
      aria-label="About Me"
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 180,
        backgroundColor: '#0a0a0a',
        color: '#FCFAF2',
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
        <h1 className="about-section-reveal section-header" style={{ 
          marginBottom: "40px", 
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <span style={{ color: "#4ade80", fontSize: "clamp(2rem, 5vw, 40px)" }}>✦</span> About Me
        </h1>
        
        {/* Profile Introduction Section */}
        <div className="about-section-reveal" style={{ marginBottom: "80px" }}>
          <ProfileIntroduction theme={invertedTheme} />
        </div>

        {/* Primary Dashboard Grid (Top Row) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "16px",
          width: "100%",
          marginBottom: "16px"
        }}>
          <div className="about-section-reveal">
            <Timeline theme={invertedTheme} />
          </div>
          <div className="about-section-reveal">
            <ToolboxSection theme={invertedTheme} />
          </div>
        </div>

        {/* Secondary Dashboard Grid (Bottom Row) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "16px",
          width: "100%",
          marginBottom: "16px"
        }}>
          <div className="about-section-reveal">
            <TruthsGame theme={invertedTheme} />
          </div>
          <div className="about-section-reveal">
            <VisualGalleryCard theme={invertedTheme} />
          </div>
        </div>

        {/* Tertiary Dashboard Grid (Third Row) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "16px",
          width: "100%"
        }}>
          <div className="about-section-reveal">
            <LanguagesToggle theme={invertedTheme} />
          </div>
          <div className="about-section-reveal">
            <QuoteCard theme={invertedTheme} />
          </div>
        </div>

        {/* Platter component taking full width */}
        <div className="about-section-reveal" style={{ marginTop: "16px" }}>
          <VinylPlayer theme={invertedTheme} />
        </div>

        {/* Brands Section */}
        <div className="about-section-reveal" style={{ marginTop: "20px", marginBottom: "40px" }}>
          <BrandsSection theme={theme} />
        </div>

      </div>
      
      {/* Global Footer */}
      <Footer theme={invertedTheme} activeChar="deer" />
    </div>
  );
}
