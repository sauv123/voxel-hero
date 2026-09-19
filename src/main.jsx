import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import gsap from 'gsap';

// Global accessibility for motion sensitivity
let mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.globalTimeline.timeScale(1000); // Instantly finish all animations
});

import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
