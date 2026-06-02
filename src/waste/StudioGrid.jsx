import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GRID_ITEMS = [
  {
    id: '01',
    title: 'Lumière Beauty',
    desc: 'Complete brand identity and digital experience for a premium French house.',
    tags: ['Identity', 'E-Commerce'],
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=600&fit=crop&crop=face',
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: '02',
    title: 'Aether Wellness',
    desc: 'Digital platform design for a modern retreat brand.',
    tags: ['UI/UX', 'Motion'],
    img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: '03',
    title: 'Velvet Edit',
    desc: 'Editorial photography and print direction.',
    tags: ['Photo', 'Print'],
    img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop&crop=face',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: '04',
    title: 'Nova Skincare',
    desc: 'Packaging design and launch campaign visuals.',
    tags: ['Packaging', '3D'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face',
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: '05',
    title: 'Silk & Stone',
    desc: 'Fashion lookbook and e-commerce platform.',
    tags: ['Fashion', 'Dev'],
    img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop&crop=face',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: '06',
    title: 'Forma Studio',
    desc: 'Brand refresh and visual guidelines.',
    tags: ['Branding'],
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: '07',
    title: 'Aura Labs',
    desc: 'Product visualization and retail environment design.',
    tags: ['Retail', 'CGI'],
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=400&h=400&fit=crop',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: '08',
    title: 'Mara Wellness',
    desc: 'Holistic brand system and app interface.',
    tags: ['App'],
    img: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: '09',
    title: 'Pure Elements',
    desc: 'Eco-luxury packaging and web experience.',
    tags: ['Eco'],
    img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: '10',
    title: 'Ritual Co.',
    desc: 'Brand launch and social campaign direction.',
    tags: ['Social'],
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1c549d32?w=400&h=400&fit=crop',
    colSpan: 1,
    rowSpan: 1,
  },
];

export default function StudioGrid() {
  const sectionRef = useRef();
  const itemsRef = useRef([]);

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);
    if (!items.length) return;

    // Entrance animation triggered by scroll within the gallery overlay
    const scroller = document.querySelector('.gallery-overlay');

    gsap.fromTo(
      items,
      { opacity: 0, y: 28, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        stagger: 0.045,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Per-item hover timelines
    items.forEach((item) => {
      const overlay = item.querySelector('.sg-overlay');
      const num     = item.querySelector('.sg-num');
      const title   = item.querySelector('.sg-title');
      const desc    = item.querySelector('.sg-desc');
      const tags    = item.querySelectorAll('.sg-tag');

      const tl = gsap.timeline({ paused: true });

      tl.to(overlay, { opacity: 1, duration: 0.32, ease: 'power2.out' }, 0);
      tl.from([num, title, desc], { y: 12, opacity: 0, duration: 0.38, stagger: 0.05, ease: 'power3.out' }, 0.06);
      tl.from(tags, { y: 8, opacity: 0, scale: 0.9, duration: 0.24, stagger: 0.04, ease: 'back.out(1.4)' }, 0.16);

      item.addEventListener('mouseenter', () => {
        tl.play();
        // Recede siblings
        gsap.to(
          items.filter((i) => i !== item),
          { opacity: 0.38, scale: 0.975, filter: 'blur(2px) brightness(0.85)', duration: 0.4, ease: 'power3.out' }
        );
      });

      item.addEventListener('mouseleave', () => {
        tl.reverse();
        gsap.to(items, { opacity: 1, scale: 1, filter: 'none', duration: 0.4, ease: 'power3.out' });
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="sg-section">
      {/* Section header */}
      <div className="sg-header">
        <div className="sg-header-left">
          <span className="sg-eyebrow">Selected Work</span>
          <h2 className="sg-heading">MORE PROJECTS</h2>
        </div>
        <span className="sg-year">2024 — 2026</span>
      </div>

      {/* Grid */}
      <div className="sg-grid">
        {GRID_ITEMS.map((item, i) => (
          <article
            key={item.id}
            ref={(el) => (itemsRef.current[i] = el)}
            className="sg-item"
            style={{
              gridColumn: `span ${item.colSpan}`,
              gridRow: `span ${item.rowSpan}`,
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="sg-img"
              loading="lazy"
            />

            <div className="sg-overlay">
              <span className="sg-num">{item.id}</span>
              <h3 className="sg-title">{item.title}</h3>
              <p className="sg-desc">{item.desc}</p>
              <div className="sg-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="sg-tag">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
