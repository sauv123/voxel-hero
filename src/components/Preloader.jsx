import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './preloader.css';

export default function Preloader({ onComplete, onStartReveal }) {
  const loaderRef = useRef();
  const greetingRef = useRef();
  const progressLineRef = useRef();
  const counterRef = useRef();

  const onCompleteRef = useRef(onComplete);
  const onStartRevealRef = useRef(onStartReveal);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStartRevealRef.current = onStartReveal;
  }, [onComplete, onStartReveal]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const greetings = ["CIAO", "नमस्ते", "HOLA", "BONJOUR", "HALLO", "KONNICHIWA"];
    const durationIn = 0.16;
    const holdTime = 0.14;
    const durationOut = 0.14;
    
    const singleCycle = durationIn + holdTime + durationOut;
    const totalLoopDuration = greetings.length * singleCycle;

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "auto";
        if (onCompleteRef.current) onCompleteRef.current();
      }
    });

    // 1. Continuous Linear Progress Bar
    tl.to(progressLineRef.current, {
      scaleX: 1,
      duration: totalLoopDuration,
      ease: "none",
      force3D: true
    }, 0);

    // 2. Continuous Linear Percentage Counter
    const counterData = { value: 0 };
    tl.to(counterData, {
      value: 100,
      duration: totalLoopDuration,
      ease: "none",
      onUpdate: () => {
        if (counterRef.current) {
            counterRef.current.innerText = `${String(Math.floor(counterData.value)).padStart(3, '0')}%`;
        }
      }
    }, 0);

    // 3. Clean Sequential Move-Up Text Sequence
    greetings.forEach((word, index) => {
      const startAt = index * singleCycle;

      tl.call(() => {
        if (greetingRef.current) greetingRef.current.innerText = word;
      }, null, startAt);

      tl.fromTo(greetingRef.current, 
        { yPercent: 105 },
        { yPercent: 0, duration: durationIn, ease: "power4.out", force3D: true },
        startAt
      );

      tl.to(greetingRef.current, 
        { yPercent: -105, duration: durationOut, ease: "power4.in", force3D: true },
        startAt + durationIn + holdTime
      );
    });

    // 4. Clean End Screen Exit (overlaps with the last word holding)
    tl.to(loaderRef.current, {
      yPercent: -100,
      duration: 1.2, 
      ease: "expo.inOut",
      onStart: () => {
        if (onStartRevealRef.current) onStartRevealRef.current();
      }
    }, totalLoopDuration - durationOut - holdTime);

    return () => {
        tl.kill();
    };
  }, []);

  return (
    <div id="loader" className="brutal-loader" ref={loaderRef}>
      <div className="greeting-wrapper">
        <div className="kinetic-mask">
          <h1 ref={greetingRef} className="brutal-text"></h1>
        </div>
      </div>
      <div className="counter-wrapper">
        <div ref={progressLineRef} className="progress-line"></div>
        <div ref={counterRef} className="brutal-counter">000%</div>
      </div>
    </div>
  );
}
