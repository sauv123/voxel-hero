import React, { useRef, useEffect } from 'react';

export default function VoxelDS() {
  const wrapRef = useRef();
  const vy = useRef(0);
  const vx = useRef(0);
  const py = useRef(0);
  const px = useRef(0);

  useEffect(() => {
    const GRAVITY  = 0.55;
    const BOUNCE   = 0.38;
    const FRICTION = 0.87;
    const SETTLE   = 0.4;
    const MAX_X    = 36;

    let raf;
    const loop = () => {
      vy.current += GRAVITY;
      py.current += vy.current;
      px.current += vx.current;

      if (py.current >= 0) {
        py.current = 0;
        if (Math.abs(vy.current) > SETTLE) {
          vy.current *= -BOUNCE;
        } else {
          vy.current = 0;
        }
        vx.current *= FRICTION;
      }

      if (px.current >  MAX_X) { px.current =  MAX_X; vx.current *= -BOUNCE; }
      if (px.current < -MAX_X) { px.current = -MAX_X; vx.current *= -BOUNCE; }

      if (wrapRef.current) {
        const rot = px.current * 0.22;
        wrapRef.current.style.transform =
          `translate(${px.current}px, ${py.current}px) rotate(${rot}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const kick = (e) => {
    e.stopPropagation();
    vy.current = -15;
    vx.current = (Math.random() - 0.5) * 6;
  };

  return (
    <div ref={wrapRef} className="vds-wrap" onClick={kick} title="Click me!">
      {/* ── Top housing ── */}
      <div className="vds-top">
        <div className="vds-camera" />
        <div className="vds-screen-top" />
        <div className="vds-speaker-row">
          <span /><span /><span /><span /><span />
        </div>
      </div>

      {/* ── Hinge ── */}
      <div className="vds-hinge">
        <div className="vds-hinge-left" />
        <div className="vds-hinge-right" />
      </div>

      {/* ── Bottom housing ── */}
      <div className="vds-bottom">
        <div className="vds-screen-bot" />

        {/* D-pad */}
        <div className="vds-dpad">
          <div className="vds-dp-h" />
          <div className="vds-dp-v" />
          <div className="vds-dp-dot" />
        </div>

        {/* ABXY */}
        <div className="vds-abxy">
          <div className="vds-btn vds-x" />
          <div className="vds-btn-row">
            <div className="vds-btn vds-y" />
            <div className="vds-btn vds-a" />
          </div>
          <div className="vds-btn vds-b" />
        </div>

        {/* Start / Select */}
        <div className="vds-mid-btns">
          <div className="vds-mid-btn" />
          <div className="vds-mid-btn" />
        </div>
      </div>
    </div>
  );
}
