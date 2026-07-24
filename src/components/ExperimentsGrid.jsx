import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ExperimentsGrid.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Binary Shark Pool Component ─────────────────────────────────────────────
const BinarySharkPool = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  
  const sharkRef = useRef({ 
    x: 200, 
    y: 150, 
    vx: 1.8, 
    vy: 1.2 
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const fontSize = 14;
    const spacing = 20;
    const mouseRadius = 70;
    const repulsionStrength = 3.5;
    const springFactor = 0.08;
    const friction = 0.82;

    class Particle {
      constructor(x, y) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.char = Math.random() > 0.5 ? '1' : '0';
      }

      update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force * repulsionStrength;
          this.vy -= Math.sin(angle) * force * repulsionStrength;
        }

        this.vx += (this.originX - this.x) * springFactor;
        this.vy += (this.originY - this.y) * springFactor;

        this.vx *= friction;
        this.vy *= friction;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw(context) {
        context.fillText(this.char, this.x, this.y);
      }
    }

    const initGrid = () => {
      particles = [];
      const { width, height } = canvas;
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      
      const offsetX = (width - cols * spacing) / 2;
      const offsetY = (height - rows * spacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          particles.push(new Particle(offsetX + i * spacing, offsetY + j * spacing));
        }
      }
    };

    const resize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      ctx.font = `500 ${fontSize}px "Courier New", Courier, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      initGrid();
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(13, 13, 13, 0.15)'; // Darker binary text for light theme pool contrast

      particles.forEach((p) => {
        p.update(mouseRef.current.x, mouseRef.current.y);
        p.draw(ctx);
      });

      let { x, y, vx, vy } = sharkRef.current;
      
      x += vx;
      y += vy;

      if (x < 40) { x = 40; vx *= -1; }
      if (x > canvas.width - 40) { x = canvas.width - 40; vx *= -1; }
      if (y < 40) { y = 40; vy *= -1; }
      if (y > canvas.height - 40) { y = canvas.height - 40; vy *= -1; }

      const dx = mouseRef.current.x - x;
      const dy = mouseRef.current.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 140) {
        vx -= (dx / dist) * 1.2;
        vy -= (dy / dist) * 1.2;
      }

      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 10) {
        vx = (vx / speed) * 10;
        vy = (vy / speed) * 10;
      } else if (speed > 1.8 && dist >= 140) {
        vx *= 0.98;
        vy *= 0.98;
      } else if (speed < 1.8) {
        vx = (vx / speed) * 1.8;
        vy = (vy / speed) * 1.8;
      }

      sharkRef.current = { x, y, vx, vy };

      const sharkElement = containerRef.current?.querySelector('#shark-element');
      if (sharkElement) {
        const rotationDeg = Math.atan2(vy, vx) * (180 / Math.PI) + 90; 
        sharkElement.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rotationDeg}deg)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  return (
    <div 
      ref={containerRef} 
      className="binary-shark-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="binary-shark-canvas" />
      
      {/* Floating Shark Overlay */}
      <div id="shark-element" className="binary-shark-element">
        <svg viewBox="0 0 100 100" width="60" height="60">
           <path d="M 30 45 C 10 50, 0 65, 10 75 C 20 60, 40 55, 40 55 Z" fill="#2563EB" />
           <path d="M 70 45 C 90 50, 100 65, 90 75 C 80 60, 60 55, 60 55 Z" fill="#2563EB" />
           <path d="M 40 85 C 30 100, 20 100, 30 90 L 50 80 L 70 90 C 80 100, 70 100, 60 85 Z" fill="#2563EB" />
           <path d="M 50 10 C 20 30, 25 70, 50 90 C 75 70, 80 30, 50 10 Z" fill="#3B82F6" />
           <path d="M 50 15 C 35 30, 38 65, 50 80 C 62 65, 65 30, 50 15 Z" fill="#60A5FA" />
           <path d="M 47 40 C 45 60, 50 65, 53 40 Z" fill="#1D4ED8" />
           <circle cx="38" cy="30" r="3.5" fill="#0F172A" />
           <circle cx="37" cy="29" r="1.2" fill="#FFFFFF" />
           <circle cx="62" cy="30" r="3.5" fill="#0F172A" />
           <circle cx="61" cy="29" r="1.2" fill="#FFFFFF" />
           <ellipse cx="33" cy="34" rx="3.5" ry="1.8" fill="#FCA5A5" opacity="0.8"/>
           <ellipse cx="67" cy="34" rx="3.5" ry="1.8" fill="#FCA5A5" opacity="0.8"/>
        </svg>
      </div>
    </div>
  );
};

// ─── Experiments Data ────────────────────────────────────────────────────────
// ─── Experiments Data ────────────────────────────────────────────────────────
const EXPERIMENTS = [
  {
    id: 9,
    title: 'ORION',
    tags: ['AI Assistant', 'macOS Automation', 'Python', 'Three.js', 'Voice UI'],
    video: '/works/AI design Sauveer.mp4',
    size: 'huge',
    description: 'A lightweight, ultra-fast, native macOS AI voice assistant built with a pure Python backend and an interactive 3D frontend.',
    whoItsFor: 'General users, who want a deeply integrated, visually stunning, and highly responsive desktop AI assistant without the resource drain of heavy frameworks like Electron or React.',
    problem: 'Most AI voice assistants are either trapped inside web browsers, suffer from high latency, or are built on bloated frameworks that slow down the computer. Furthermore, small fast models (like 8B parameter LLMs) struggle with strictly formatting JSON tool calls, leading to broken interactions when trying to execute local commands.',
    goal: 'To deliver a sub-second latency, visually engaging, and highly capable desktop voice assistant that feels like a native OS feature. It aims to intelligently manage the user\'s computer, dynamically adapt to their speech, and gracefully handle API rate limits and parsing errors without ever crashing.',
    techStackCategories: [
      { label: "Backend Engine", value: "Pure Python (Standard Library: http.server, urllib, re, subprocess)" },
      { label: "Frontend UI", value: "Vanilla JavaScript, HTML5, CSS3" },
      { label: "Visuals & Animation", value: "Three.js (3D particle system), GSAP (Cinematic text animations)" },
      { label: "AI Logic (LLM)", value: "Groq API (Llama-3.1-8b-instant)" },
      { label: "Voice Synthesis", value: "Cartesia API (Sonic-3.5)" },
      { label: "OS Automation", value: "Native macOS osascript (AppleScript) and shell commands" }
    ],
    coreFeatures: [
      "Cinematic UI & Real-Time Transcription: A responsive 3D particle orb that changes states (Idle, Listening, Thinking, Responding) alongside Apple-style GSAP animated subtitles.",
      "Native macOS Automation: Directly controls system hardware and software (adjust volume/brightness, open/close apps, play media, empty trash, check system stats).",
      "Multimodal Drag-and-Drop: Seamlessly drag images or PDFs onto the UI to have the Orb analyze files using vision models or extract text for discussion.",
      "Resilient Execution Engine: Uses a custom Regex-based extraction system that flawlessly catches and executes tool commands even when the AI outputs malformed JSON or broken XML tags.",
      "Dynamic Memory System: Features both a short-term topic isolation module to prevent context bleeding, and a silent background agent that builds a persistent, long-term JSON knowledge graph of user preferences.",
      "Rate Limit Armor: Intercepts external API HTTP 429 blocks, parses the exact required timeout, intelligently pauses execution, and automatically retries without dropping the conversation."
    ],
    techStack: ['Python', 'Three.js', 'Groq API', 'Cartesia API']
  },
  {
    id: 14,
    title: 'THE BLOCKCHAIN MOSAIC',
    tags: ['Web3', 'GenerativeArt', 'WebAudio', 'LiveVisualization', 'React'],
    video: '/works/mosaic.mp4',
    size: 'hero',
    description: 'A live, generative art painting and audio engine that visualizes real-time Ethereum blockchain transaction patterns, block congestion, and whale alerts.',
    whoItsFor: 'Web3 builders, crypto enthusiasts, generative art collectors, and digital galleries seeking a physical or virtual installation representing the "pulse" of the internet\'s financial layer.',
    problem: 'Blockchain activity (swaps, NFT mints, high gas spikes, massive whale movements) is completely invisible to the naked eye. Users must look at dry hash blocks on Etherscan rather than experiencing the system\'s kinetic energy.',
    goal: 'Map raw transaction metadata (volume, type, fee rates) to visual variables (Hues, Saturation, Grid coordinates) and spatialized sounds (Karplus-Strong string models, chimes, 808 sub-bass Kicks) to create a premium, real-time sensory installation.',
    techStackCategories: [
      { label: "Frontend", value: "Vanilla HTML5 Canvas, Vanilla CSS (Glassmorphism), JavaScript (ESM), GSAP (GreenSock Animation Platform), Web Audio API" },
      { label: "Backend", value: "Node.js, Express, WebSocket (ws), SQLite (Ingestion Database)" },
      { label: "Blockchain", value: "Ethers.js, Tenderly mainnet gateway RPC" }
    ],
    coreFeatures: [
      "Generative Art Grid: Each tile represents a block, and inner pixels represent individual transactions color-coded by type (Swaps, Mints, Transfers).",
      "Sonification Engine: Converts blockchain actions into high-fidelity physical string string-plucks (Karplus-Strong) and 808 drum beats.",
      "Live WebSocket Sync: Real-time updates pushed directly to the UI without page reloads.",
      "Wallet Tracker: Highlights specific tiles in real time when monitored addresses transact.",
      "Daily Portraits & Dynamic Archives: Generates interactive calendar replays of historical blockchain activity, adjusting to the current calendar date automatically."
    ],
    techStack: ['HTML5 Canvas', 'Web Audio API', 'Node.js', 'Ethers.js']
  },
  {
    id: 1,
    title: 'PENTAGON TYPO SCULPTOR',
    tags: ['Typography', 'ParametricDesign', 'GenerativeArt', 'DesignTools', 'React', 'TailwindCSS', 'FontMorphing', 'SVGExport'],
    video: '/works/pentagon font.mp4',
    size: 'wide',
    description: 'An interactive parametric typography composer that fluidly morphs character letterforms using a 5-point pentagonal font balance pad and generative mathematical algorithms.',
    whoItsFor: 'Graphic & Editorial Designers: For creating unique headlines, display typography, and visual branding assets.\nTypographers & Creative Coders: For exploring multi-font spatial interpolation and parametric letterform variations.\nWeb Developers: For generating custom responsive typographic art or copying ready-to-use inline HTML/CSS code snippets.',
    problem: 'Traditional variable fonts are limited to standard axes (such as weight, width, or slant). Creating complex, non-linear text effects or interpolating across multiple distinct typeface families usually requires tedious manual vector editing in tools like Illustrator or Figma.',
    goal: 'Provide an intuitive visual workspace where designers can blend 5 distinct font families across custom distribution curves, fine-tune individual character parameters, and export production-ready assets (SVG, PNG, JPEG, or HTML/CSS).',
    techStackCategories: [
      { label: "Frontend Framework", value: "React 18 with TypeScript & Vite" },
      { label: "Styling", value: "Tailwind CSS" },
      { label: "Icons", value: "Lucide React" },
      { label: "Animation", value: "Motion (motion/react)" },
      { label: "Rendering & Export Engine", value: "HTML5 Canvas & Inline SVG Compiler" },
      { label: "Typography", value: "Google Fonts Integration with 5-vertex spatial weight math" }
    ],
    coreFeatures: [
      "5-Point Pentagon Balance Pad: Drag-and-drop coordinate handle mapping weight distribution across 5 configurable typeface vertices.",
      "Generative Sculpting Algorithms: 8 parametric algorithms (Gaussian, Sine Wave Pulse, Fibonacci Spiral, Alternating Binary, Perlin Noise, Stepped Pyramid, Kinetic Ripple, and Per-Character Randomization).",
      "Per-Character Micro Tuning: Click any letter on the artboard to adjust individual scale, rotation, baseline offset, weight, opacity, italic stance, and custom color overrides.",
      "Multi-Format Export Options: SVG, PNG, JPEG, HTML/CSS.",
      "Canvas Color & Grid Palette: Customizable canvas backgrounds (including transparent grid, dark, light, and custom hex colors).",
      "Specimen Sheet Inspector: Technical modal displaying font weight ratios, kerning tables, and spatial coordinate metrics."
    ],
    techStack: ['React', 'Tailwind CSS', 'Motion', 'Canvas API']
  },
  {
    id: 2,
    title: 'SPATIAL PROTOTYPES',
    tags: ['Spatial', 'visionOS', 'SwiftUI'],
    video: '/2.mp4',
    size: 'square',
    description: '[Placeholder text] Prototyping interactions for next-generation spatial headsets.',
    techStack: ['visionOS', 'SwiftUI', 'RealityKit']
  },
  {
    id: 3,
    title: 'HYDROTYPE 3D',
    tags: ['ReactThreeFiber', 'ThreeJS', 'GSAP', 'RapierPhysics', 'CreativeCoding', 'WebGL', 'InteractiveDesign'],
    video: '/krizia.mp4',
    size: 'square',
    description: 'An immersive web interaction combining reactive 2D typography with real-time 3D rigid-body physics to create a tactile, high-end hero section.',
    goal: 'Build a high-performance interactive canvas where 2D editorial typography and 3D physical objects react in unison to user cursor gestures, providing immediate, realistic, and tactile feedback without sacrificing framerates.',
    techStackCategories: [
      { label: "Build Tool", value: "Vite" },
      { label: "Frontend Framework", value: "React" },
      { label: "3D Renderer", value: "React Three Fiber (@react-three/fiber) & Three.js" },
      { label: "3D Helpers", value: "Drei (@react-three/drei)" },
      { label: "Physics Engine", value: "Rapier (@react-three/rapier — WebAssembly-powered physics)" },
      { label: "Animation Library", value: "GSAP (GreenSock) for high-precision text interpolation" }
    ],
    coreFeatures: [
      "Magnifying Kinetic Typography: Individual DOM letter splitting with GSAP easing that magnifies, expands, and changes color on mouse hover.",
      "Curved Surface Trimesh Physics: Custom cylinder pool geometry configured as a concave trimesh collider so objects roll realistically around internal curves.",
      "Hover-Activated Physics Impulse: Trigger zones (e.g., wallet hover) that inject dynamic linear forces and directional torque onto the ball in real time.",
      "Layered Event Passthrough: Dual-layer DOM architecture (pointer-events: none on overlay wrappers) allowing direct interactions with both the HTML overlay and the WebGL canvas behind it.",
      "Custom Friction & Restitution Tuning: Fine-tuned physical parameters (gravity, mass, bounce, surface friction) for natural rolling movement without visual clipping."
    ],
    techStack: ['React Three Fiber', 'Rapier', 'GSAP']
  },
  {
    id: 5,
    title: 'GENERATIVE BRAND',
    tags: ['Interactive Pool', 'Creative Code', 'HTML5 Canvas'],
    isInteractivePool: true,
    size: 'wide',
    description: '[Placeholder text] An interactive particle pool simulating fluid dynamics and repulsion physics based on mouse proximity.',
    techStack: ['HTML5 Canvas', 'Vanilla JS', 'Physics Engine']
  },
  {
    id: 4,
    title: 'LEMON NOTES',
    tags: ['EdTech', 'AI', 'Productivity', 'Next.js', 'Supabase', 'React', 'TailwindCSS'],
    video: '/lemon_notes.mp4',
    size: 'wide',
    description: 'An intelligent study companion that instantly transforms raw notes, PDFs, images, and audio recordings into structured summaries and interactive quizzes.',
    whoItsFor: "Students, researchers, and lifelong learners who want to optimize their study time, improve their retention through active recall, and organize large volumes of study material quickly.",
    problem: "Students spend too much time manually organizing notes, extracting key concepts from lengthy PDFs or lectures, and building flashcards/quizzes. This manual process takes away from actual learning and active recall time, leading to less efficient studying.",
    goal: "To provide a friction-free pipeline where raw, unstructured information (text, documents, images, audio) is instantly \"squeezed\" into high-yield study materials (summaries, concept tags, and interactive quizzes) to maximize study efficiency and knowledge retention.",
    techStackCategories: [
      { label: "Frontend", value: "Next.js (App Router), React, Tailwind CSS, Framer Motion" },
      { label: "UI Components", value: "Shadcn/UI, Base-UI, Radix UI" },
      { label: "State Management", value: "Zustand (with Local Storage Persistence)" },
      { label: "Authentication", value: "Supabase Auth (Magic Links & Password)" },
      { label: "AI & Processing", value: "OpenAI API, Groq (Audio Transcription), Tesseract.js (Client-side OCR), PDF.js (Client-side Document Parsing)" }
    ],
    coreFeatures: [
      "Multimodal Intake: Paste raw text, or drag-and-drop PDFs, Images, and Audio/Video files directly into the Dashboard for immediate processing.",
      "Instant Summarization: Automatically extract concise summaries, core concepts, and subject tags from uploaded materials.",
      "Interactive Quiz Generation: Automatically generate Multiple Choice and Short Answer quizzes based strictly on the uploaded content to test retention.",
      "Weakness Tracking: Quiz results highlight \"Weak Topics\" allowing users to focus their review on concepts they got wrong.",
      "Study Folders & Kits: Save generated study kits (Notes + Summary + Quiz) into subject-specific folders for organized long-term review.",
      "AI Chat Assistant: A built-in contextual AI tutor to answer questions about the current study material.",
      "Usage Quotas & Analytics: Track AI generations and storage usage locally on an elegant Dashboard with visual progression bars and gamified streaks.",
      "Accessible UI: Global High Contrast mode toggle, Light/Dark system themes, and highly responsive modern design utilizing \"Alchemist Chic\" aesthetics."
    ],
    techStack: ['Next.js', 'React', 'TailwindCSS', 'Supabase']
  },
  {
    id: 15,
    title: 'SNAKE INTERACTION',
    tags: ['Snake Fluid', 'Interaction Design', 'Micro-UX'],
    video: '/works/snake.mp4',
    size: 'wide',
    description: '[Placeholder text] Fluid, cursor-following generative snake patterns built for high-performance rendering.',
    techStack: ['WebGL', 'GLSL Shaders', 'Three.js']
  },
];

// ─── Context Drawer Component ──────────────────────────────────────────────
const ContextDrawer = ({ item, onClose, theme }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(drawerRef.current, 
      { x: '100%', opacity: 0 }, 
      { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, [item]);

  const handleClose = () => {
    gsap.to(drawerRef.current, {
      x: '100%', opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: onClose
    });
  };

  if (!item) return null;

  return ReactDOM.createPortal(
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 199,
          opacity: 1,
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={handleClose}
      />
      <div 
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: '400px',
          backgroundColor: 'rgba(252, 250, 242, 0.95)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(0,0,0,0.05)',
          zIndex: 200,
          padding: '40px 32px',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        <button 
          onClick={handleClose}
          aria-label="Close dialog"
          style={{
            alignSelf: 'flex-end', background: 'none', border: 'none',
            fontSize: '24px', cursor: 'pointer', color: '#0d0d0d',
            padding: '8px'
          }}
        >
          ✕
        </button>

      <h3 style={{ 
        fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 900,
        color: '#0d0d0d', marginBottom: '16px', letterSpacing: '-0.02em', marginTop: '24px'
      }}>
        {item.title}
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {item.techStack?.map(tech => (
          <span key={tech} style={{
            background: 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: '4px',
            fontSize: '11px', fontFamily: 'var(--font-body)', fontWeight: 600, color: '#0d0d0d'
          }}>
            {tech}
          </span>
        ))}
      </div>

      <div style={{ flex: 1, paddingBottom: '40px' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', opacity: 0.5, textTransform: 'uppercase' }}>
          The Concept
        </h4>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#0d0d0d', lineHeight: 1.6, opacity: 0.8, marginBottom: '24px' }}>
          {item.description}
        </p>

        {item.whoItsFor && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', opacity: 0.5, textTransform: 'uppercase' }}>
              Who It's For
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#0d0d0d', lineHeight: 1.6, opacity: 0.8 }}>
              {item.whoItsFor}
            </p>
          </div>
        )}

        {item.problem && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', opacity: 0.5, textTransform: 'uppercase' }}>
              Problem
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#0d0d0d', lineHeight: 1.6, opacity: 0.8 }}>
              {item.problem}
            </p>
          </div>
        )}

        {item.goal && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', opacity: 0.5, textTransform: 'uppercase' }}>
              Goal
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#0d0d0d', lineHeight: 1.6, opacity: 0.8 }}>
              {item.goal}
            </p>
          </div>
        )}

        {item.techStackCategories && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0d0d0d', marginBottom: '12px', opacity: 0.5, textTransform: 'uppercase' }}>
              Tools & Technology Stack
            </h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {item.techStackCategories.map(cat => (
                <li key={cat.label} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0d0d0d', lineHeight: 1.5, opacity: 0.8 }}>
                  <span style={{ fontWeight: 700 }}>{cat.label}:</span> {cat.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.coreFeatures && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#0d0d0d', marginBottom: '12px', opacity: 0.5, textTransform: 'uppercase' }}>
              Core Features
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {item.coreFeatures.map((feature, idx) => {
                const parts = feature.split(':');
                if (parts.length > 1) {
                  return (
                    <li key={idx} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0d0d0d', lineHeight: 1.5, opacity: 0.8 }}>
                      <span style={{ fontWeight: 700 }}>{parts[0]}:</span>{parts.slice(1).join(':')}
                    </li>
                  );
                }
                return (
                  <li key={idx} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#0d0d0d', lineHeight: 1.5, opacity: 0.8 }}>
                    {feature}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      </div>
    </>,
    document.body
  );
};

function BentoCard({ item, theme, setCursorActive, disableScrollTrigger, onOpenDrawer }) {
  const cardRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (disableScrollTrigger) {
      gsap.set(cardRef.current, { y: 0, opacity: 1 });
      return;
    }
    gsap.fromTo(cardRef.current,
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [disableScrollTrigger]);

  const handleMouseEnter = () => {
    setHovered(true);
    setCursorActive(true);
    
    gsap.to(cardRef.current, {
      y: -3,
      scale: 1.005,
      duration: 0.3,
      ease: 'power2.out',
      borderColor: theme?.text || '#0d0d0d',
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setCursorActive(false);
    
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
      borderColor: 'rgba(13, 13, 13, 0.08)',
    });
  };

  const handleCardClick = () => {
    if (item.link) {
      window.open(item.link, '_blank');
    } else {
      if (onOpenDrawer) onOpenDrawer(item);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`modern-bento-card bento-${item.size} ${item.isInteractivePool ? 'interactive-pool-card' : ''} ${item.isIframe ? 'bento-iframe-card' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        borderColor: 'rgba(13, 13, 13, 0.08)',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Dark overlay that fades in on hover to decrease transparency/dim the card */}
      {!item.isInteractivePool && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            zIndex: 40,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
            borderRadius: '16px'
          }}
        />
      )}

      {/* Visual Hover Cue */}
      {!item.isInteractivePool && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#0d0d0d', // Changed to black
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '100px',
            fontFamily: 'var(--font-heading)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            pointerEvents: 'none',
            zIndex: 50,
            opacity: hovered ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >
          VIEW PROJECT
        </div>
      )}

      {/* Background Media, Binary Shark Pool, or Embedded Iframe */}
      {item.isInteractivePool ? (
        <BinarySharkPool />
      ) : item.isIframe ? (
        <div className="bento-media-wrap bento-iframe-wrap">
          <iframe
            src={item.iframeSrc}
            frameBorder="0"
            allowFullScreen
            title={item.title}
            className="bento-media-asset bento-media-iframe"
          />
        </div>
      ) : (
        <div className="bento-media-wrap" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {item.video ? (
            <video
              src={item.video}
              autoPlay
              muted
              loop
              playsInline
              className="bento-media-asset"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <img src={item.image || item.img || item.thumb} alt={item.title} className="bento-media-asset" loading="lazy" style={{ objectFit: 'cover' }} />
          )}
        </div>
      )}

      {/* Content wrapper removed per user request */}
    </div>
  );
}

export default function ExperimentsGrid({ theme, disableScrollTrigger }) {
  const sectionRef = useRef();
  const headingRef = useRef();
  const cursorRef  = useRef();
  const [cursorActive, setCursorActive] = useState(false);
  const [activeExperiment, setActiveExperiment] = useState(null);

  useEffect(() => {
    if (disableScrollTrigger) return;
    const ctx = gsap.context(() => {
      // Heading word reveal
      gsap.fromTo('.experiments-title-word',
        { y: '100%', rotateX: -25, opacity: 0 },
        {
          y: '0%', rotateX: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    // Follow mouse quickSetters for custom cursor
    const xSetter = gsap.quickSetter(cursorRef.current, "x", "px");
    const ySetter = gsap.quickSetter(cursorRef.current, "y", "px");

    const onMouseMove = (e) => {
      if (cursorRef.current) {
        const bounds = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        xSetter(x);
        ySetter(y);
      }
    };

    const section = sectionRef.current;
    section.addEventListener('mousemove', onMouseMove);

    return () => {
      ctx.revert();
      section.removeEventListener('mousemove', onMouseMove);
    };
  }, [disableScrollTrigger]);

  return (
    <section 
      ref={sectionRef} 
      className="experiments-section-modern" 
      style={{ 
        backgroundColor: '#FFFFFF',
        padding: disableScrollTrigger ? '20px 0 0 0' : undefined 
      }}
    >
      {/* Minimal Rectangular Custom Cursor (disabled in playground) */}
      {!disableScrollTrigger && (
        <div
          ref={cursorRef}
          className={`bento-custom-cursor ${cursorActive ? 'active' : ''}`}
          style={{
            backgroundColor: theme?.text || '#0d0d0d',
            color: '#FFFFFF',
            border: `2px solid ${theme?.text || '#0d0d0d'}`,
          }}
        >
          <span className="cursor-text">VIEW CASE STUDY</span>
        </div>
      )}

      <div className="experiments-inner">
        {/* Header Section (disabled in playground since playground already has header) */}
        {!disableScrollTrigger && (
          <div ref={headingRef} className="experiments-title-box">

            <h2 className="experiments-title-main" style={{ color: theme?.text || '#0d0d0d' }}>
              <span className="experiments-title-line">
                <span className="experiments-title-word">EXPERIMENTS</span>
              </span>
            </h2>
            <p className="experiments-title-descr" style={{ color: 'rgba(13, 13, 13, 0.6)' }}>
              A playful collection of design explorations, prototypes, and digital toys designed to feel intuitive and fun.
            </p>
          </div>
        )}

        {/* Horizontal Bento Grid Layout */}
        <div className="modern-bento-grid">
          {EXPERIMENTS.map((item) => (
            <BentoCard 
              key={item.id} 
              item={item} 
              theme={theme} 
              setCursorActive={setCursorActive} 
              disableScrollTrigger={disableScrollTrigger} 
              onOpenDrawer={(experiment) => setActiveExperiment(experiment)}
            />
          ))}
        </div>
      </div>
      
      {/* Context Drawer for Explanations */}
      {activeExperiment && (
        <ContextDrawer 
          item={activeExperiment} 
          theme={theme} 
          onClose={() => setActiveExperiment(null)} 
        />
      )}
    </section>
  );
}
