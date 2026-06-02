import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FluidUnjumble.css';

gsap.registerPlugin(ScrollTrigger);

export default function FluidUnjumble({ theme }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 2.5,
          anticipatePin: 1
        }
      });

      const paragraphs = [".p1", ".p2", ".p3", ".p4", ".p5"];
      const timeStep = 0.8; 

      paragraphs.forEach((paraSelector, index) => {
        const startTime = index * timeStep;
        const words = document.querySelectorAll(`${paraSelector} .fu-word`);

        words.forEach((word) => {
          const offsetX = word.getAttribute("data-x");
          if (offsetX && offsetX !== "0") {
            mainTl.from(word, {
              x: `${offsetX}px`,
              ease: "expo.out",
              duration: 2.5
            }, startTime);
          }
        });
      });

      // Emoji pop animations
      mainTl.from(".pop-emoji", {
        scale: 0,
        rotation: -45,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        stagger: 0.5
      }, 1);

      // ELEGANT DEVICE FLOAT
      mainTl.fromTo(".fu-device-mobile", 
        { y: 30 },
        { y: -20, opacity: 1, duration: 5.0, ease: "none" }, 
        0
      );

      mainTl.fromTo(".fu-device-desktop", 
        { y: 50 },
        { y: -30, duration: 5.0, ease: "none" }, 
        0
      );

      // VIDEO SCRUBBING
      const videos = document.querySelectorAll(".scrub-video");
      videos.forEach((video) => {
        video.load();
        let checkMeta = setInterval(() => {
          if (video.readyState >= 2) {
            clearInterval(checkMeta);
            gsap.to(video, {
              currentTime: video.duration || 1,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=3500",
                scrub: 0.1 
              }
            });
          }
        }, 100);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="story-container" ref={containerRef} style={{ color: "#080808" }}>
      <div className="fu-grid-layout">
        
        <div className="fu-left-col">
          
          <div className="fu-text-paragraph p1">
            <span className="fu-word" data-x="-70">I'm</span>
            <span className="fu-word" data-x="-60">interested</span>
            <span className="fu-word" data-x="-20">in</span>
            <span className="fu-word stationary" data-x="0">how</span>
            <span className="fu-word" data-x="10">people</span>
            <span className="fu-word fu-highlight fu-highlight-blue" data-x="50">make</span>
            <span className="fu-word fu-highlight fu-highlight-blue" data-x="60">sense<span className="pop-emoji" style={{display: 'inline-block', marginLeft: '8px'}}>💡</span></span>
          </div>
          
          <div className="fu-text-paragraph p2">
            <span className="fu-word" data-x="-80">of</span>
            <span className="fu-word" data-x="-30">technology</span>
            <span className="fu-word stationary" data-x="0">especially</span>
            <span className="fu-word" data-x="15">when</span>
            <span className="fu-word" data-x="40">it</span>
            <span className="fu-word" data-x="75">becomes</span>
          </div>

          <div className="fu-text-paragraph p3">
            <span className="fu-word fu-highlight" data-x="-75">complex,</span>
            <span className="fu-word fu-highlight" data-x="-20">invisible,<span className="pop-emoji" style={{display: 'inline-block', marginLeft: '8px'}}>👁️</span></span>
            <span className="fu-word stationary" data-x="0">or</span>
            <span className="fu-word fu-highlight" data-x="60">intelligent.<span className="pop-emoji" style={{display: 'inline-block', marginLeft: '8px'}}>🧠</span></span>
          </div>

          <div className="fu-text-paragraph p4" style={{marginTop: "2vw", fontWeight: 600}}>
            <span className="fu-word" data-x="-60">My</span>
            <span className="fu-word" data-x="-50">work</span>
            <span className="fu-word stationary" data-x="0">focuses</span>
            <span className="fu-word" data-x="30">on</span>
            <span className="fu-word" data-x="80">making</span>
          </div>

          <div className="fu-text-paragraph p5">
            <span className="fu-word" data-x="-70">those</span>
            <span className="fu-word" data-x="-40">experiences</span>
            <span className="fu-word stationary" data-x="0">feel</span>
            <span className="fu-word fu-highlight fu-highlight-red" data-x="15">clear,</span>
            <span className="fu-word fu-highlight fu-highlight-red" data-x="25">thoughtful,</span>
            <span className="fu-word fu-highlight fu-highlight-red" data-x="70">human.<span className="pop-emoji" style={{display: 'inline-block', marginLeft: '8px'}}>🤝</span></span>
          </div>

        </div>

        <div className="fu-right-col">
          <div className="fu-device fu-device-mobile">
            <video className="scrub-video" preload="auto" muted playsInline src="/1.mp4"></video>
          </div>
          
          <div className="fu-device fu-device-desktop">
            <video className="scrub-video" preload="auto" muted playsInline src="/2.mp4"></video>
          </div>
        </div>

      </div>
    </section>
  );
}
