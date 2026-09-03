const fs = require('fs');
let code = fs.readFileSync('/tmp/App_old.jsx', 'utf8');
code = code.replace("import CustomCursor from './components/CustomCursor';", "import CustomCursor from './components/CustomCursor';\nimport HeroVideo from './components/HeroVideo';");
const endOfHero = "        {isPreloaderDone && isHoveringCharacter && (";
code = code.replace(endOfHero, "        {/* ── Interactive Video Background ── */}\n        <HeroVideo videoSrc=\"/orco.mp4\" />\n\n" + endOfHero);
fs.writeFileSync('src/App.jsx', code);
