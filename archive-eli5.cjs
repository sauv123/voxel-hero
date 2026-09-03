const fs = require('fs');
let code = fs.readFileSync('src/cms/projects.js', 'utf8');

const eli5Block = `{
    id: "03",
    name: "ELI5",
    title: "ELI5",
    slug: "eli5",
    tags: ["UX DESIGN", "INTERACTION & UX SYSTEMS"],
    role: "UX Researcher & Designer",
    bgColor: "#000000",
    textColor: "#FFFFFF",
    img: "/works/media__1777587436505.webp",
    cta: "Transforms complexity into visual clarity instantly.",
    cursorCta: "See the visual clarity process",
    link: "/casestudies/eli5/index.html"
  }`;

code = code.replace(eli5Block, `/* ${eli5Block} */`);
fs.writeFileSync('src/cms/projects.js', code);
