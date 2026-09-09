const fs = require('fs');

let content = fs.readFileSync('src/components/Preloader.jsx', 'utf8');

// Update props
content = content.replace(
  'export default function Preloader({ onComplete, onStartReveal }) {',
  'export default function Preloader({ onComplete, onStartReveal, isVideoReady }) {'
);

// Add isVideoReady ref
content = content.replace(
  'const onStartRevealRef = useRef(onStartReveal);',
  'const onStartRevealRef = useRef(onStartReveal);\n  const isVideoReadyRef = useRef(isVideoReady);'
);

content = content.replace(
  'onStartRevealRef.current = onStartReveal;\n  }, [onComplete, onStartReveal]);',
  'onStartRevealRef.current = onStartReveal;\n    isVideoReadyRef.current = isVideoReady;\n  }, [onComplete, onStartReveal, isVideoReady]);'
);

// Remove the old exit animation from the timeline
content = content.replace(
  `    // 4. Clean End Screen Exit
    tl.to(loaderRef.current, {
      yPercent: -100,
      duration: 0.6, 
      ease: "expo.inOut",
      onStart: () => {
        if (onStartRevealRef.current) onStartRevealRef.current();
      }
    }, totalLoopDuration - durationOut - holdTime);`,
  `    // 4. Wait for video, then exit
    tl.call(() => {
      const checkAndExit = () => {
        if (isVideoReadyRef.current || !window.safari) {
           // We add a tiny fallback just in case
           gsap.to(loaderRef.current, {
             yPercent: -100,
             duration: 0.6,
             ease: "expo.inOut",
             onStart: () => {
               if (onStartRevealRef.current) onStartRevealRef.current();
             },
             onComplete: () => {
                completeLoader();
             }
           });
        } else {
           setTimeout(checkAndExit, 100);
        }
      };
      // For safety, force exit after 4s total if video still not ready
      setTimeout(() => { isVideoReadyRef.current = true; }, 4000);
      checkAndExit();
    }, null, totalLoopDuration - durationOut - holdTime);`
);

// Remove the automatic completeLoader from the timeline's onComplete, because our custom call handles it
content = content.replace(
  `    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(safetyTimer);
        completeLoader();
      }
    });`,
  `    const tl = gsap.timeline();`
);

// We need to increase the safetyTimer so it doesn't kill the loader before the video is ready
content = content.replace(
  `    const safetyTimer = setTimeout(() => {
      completeLoader();
    }, 2000);`,
  `    const safetyTimer = setTimeout(() => {
      completeLoader();
    }, 6000);`
);

fs.writeFileSync('src/components/Preloader.jsx', content);
