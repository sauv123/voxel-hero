import fs from 'fs';
import path from 'path';

// Core portfolio content to be injected for SEO
const seoContent = `
<noscript>
  <h1>Sauveer Sinha - Product Designer • Milan, IT</h1>
  <p>Sauveer Sinha is a Product Designer in Milan, IT with 1+ yr experience, designing human-centered interfaces and design systems for next-gen AI products and B2C consumer platforms.</p>
  
  <h2>Selected Case Studies & Work</h2>
  <ul>
    <li>Redesigning Orco: Transforming a heritage Italian food brand into an interactive culinary experience.</li>
    <li>OLO: Turning small hellos into meaningful growth through introverted emotional design.</li>
    <li>/trace: A live generative artwork and data visualization turning Ethereum activity into an interactive sensory experience. Selected for Milano Digital Week 2026.</li>
    <li>Krizia: Rebranding luxury fashion through structure and digital editorial design.</li>
    <li>MICA: Designing belonging through emotionally intelligent co-living housing experiences.</li>
  </ul>
  
  <h2>Core Domains & Skills</h2>
  <p>AI Product Design, Human-Centered AI, B2C Consumer, UX & Interaction Design, Data Viz, Design Systems, Creative Prototyping, GSAP, React, Three.js.</p>
  
  <h2>Contact & Links</h2>
  <p>Email: sauveersinha@gmail.com</p>
  <p>Location: Milan, Italy (Available for European & Global Opportunities)</p>
</noscript>
`;

const indexPath = path.resolve('dist/index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf-8');
  // Inject just before </body>
  html = html.replace('</body>', `${seoContent}\n</body>`);
  fs.writeFileSync(indexPath, html);
  console.log('✅ SEO content successfully injected into dist/index.html');
} catch (error) {
  console.error('Error injecting SEO content:', error);
}
