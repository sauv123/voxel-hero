const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Remove HeroVideo from before BrutalistCube
const heroVideoTag = '      {/* ── Interactive Video Background ── */}\n      <HeroVideo videoSrc="/orco.mp4" />\n\n';
code = code.replace(heroVideoTag, '');

// Inject HeroVideo back into hero-container
const endOfHero = "        {isPreloaderDone && isHoveringCharacter && (";
code = code.replace(endOfHero, "        {/* ── Interactive Video Background ── */}\n        <HeroVideo videoSrc=\"/orco.mp4\" />\n\n" + endOfHero);

fs.writeFileSync('src/App.jsx', code);
