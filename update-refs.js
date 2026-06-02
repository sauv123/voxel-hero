import fs from 'fs';
import path from 'path';

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Allow spaces in filename
            content = content.replace(/(['"`])(\/?[\w\-\.\/\s]+)\.(png|jpg|jpeg|PNG)\1/g, "$1$2.webp$1");
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated references in:', fullPath);
            }
        }
    }
}

processDir('./src');
