import fs from 'fs';
import path from 'path';

// Core portfolio content to be injected for SEO
const seoContent = `
<noscript>
  <h1>Sauveer Sinha - Product Designer</h1>
  <p>I am a Product Designer with a focus on UI/UX, interaction design, and creating brutalist, modern web experiences.</p>
  
  <h2>Work & Projects</h2>
  <ul>
    <li>Krizia: A modern web experience. Case Study.</li>
    <li>IkeaxPeanuts: A collaborative project showcase. Case Study.</li>
    <li>Bips: Product Designer, 2024 - Present</li>
    <li>BambooHR: UX Designer, 2023 - 2024</li>
  </ul>
  
  <h2>Skills</h2>
  <p>UX Design, UI Design, Figma, React, Framer Motion, GSAP, Tailwind CSS, 3D/Spline</p>
  
  <h2>Contact</h2>
  <p>Email: sauveersinha@gmail.com</p>
  <p>LinkedIn, Twitter/X, Dribbble</p>
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
