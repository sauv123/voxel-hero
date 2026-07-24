const fs = require('fs');
const file = 'src/components/AboutMe.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/background:\s*"(#fff|#ffffff)"/gi, 'background: "#111111"');
content = content.replace(/background:\s*`(#fff|#ffffff)`/gi, 'background: `#111111`');
content = content.replace(/backgroundColor:\s*"(#fff|#ffffff)"/gi, 'backgroundColor: "#111111"');

content = content.replace(/color:\s*"(#000|#000000)"/gi, 'color: "#ffffff"');
content = content.replace(/color:\s*`(#000|#000000)`/gi, 'color: `#ffffff`');
content = content.replace(/color:\s*'(#000|#000000)'/gi, "color: '#ffffff'");

// For linear-gradients with #000 (usually shadow fades), invert them if they were fading to #000, but wait, the About UI is dark now, so fading to #000 is ACTUALLY correct for a dark theme! 
// Let's keep linear-gradient to #000.

// Update active tabs that were black (#000000) to a lighter color for contrast against #111111 card backgrounds
content = content.replace(/background:\s*activeTab === catKey \? "#000000"/g, 'background: activeTab === catKey ? "#333333"');
content = content.replace(/background:\s*lang === l\.key \? "#000000"/g, 'background: lang === l.key ? "#333333"');

// Replace active/picked states that were black to match the inverted theme
content = content.replace(/color:\s*isLie \? "#000"/g, 'color: isLie ? "#ffffff"');
content = content.replace(/color:\s*\(isPicked && !revealed\) \? "#000"/g, 'color: (isPicked && !revealed) ? "#ffffff"');
content = content.replace(/isPicked \? `2px solid #000`/g, 'isPicked ? `2px solid #ffffff`');

// Update border colors that used black
content = content.replace(/border:\s*"2px solid #000"/gi, 'border: "2px solid #555"');

// Update SVGs that had fill="#000000"
content = content.replace(/fill="#000000"/g, 'fill="#ffffff"');
content = content.replace(/fill="#000"/g, 'fill="#ffffff"');

fs.writeFileSync(file, content);
console.log("Colors updated in AboutMe.jsx");
