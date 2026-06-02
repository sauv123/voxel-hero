const fs = require('fs');
const path = require('path');

function replaceFonts(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceFonts(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Replace JSX syntax
            content = content.replace(/"'Space Grotesk', sans-serif"/g, '"var(--font-heading)"');
            content = content.replace(/"'Space Mono', monospace"/g, '"var(--font-body)"');
            
            // Replace CSS/Plain syntax
            content = content.replace(/'Space Grotesk', sans-serif/g, 'var(--font-heading)');
            content = content.replace(/'Space Mono', monospace/g, 'var(--font-body)');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated: ' + fullPath);
            }
        }
    }
}
replaceFonts('./src');
