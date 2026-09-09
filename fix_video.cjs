const fs = require('fs');
let content = fs.readFileSync('src/components/HeroVideo.jsx', 'utf8');

content = content.replace(/onLoadedData=\{\(\) => onVideoReady playsInlineplaysInline onVideoReady\(\)\}/, 'playsInline');
content = content.replace(/playsInlineplaysInline/, 'playsInline');
content = content.replace(/playsInline\n          onLoadedData=\{\(\) => onVideoReady && onVideoReady\(\)\}/g, 'playsInline');
content = content.replace(/playsInline/g, 'playsInline\n          onLoadedData={() => onVideoReady && onVideoReady()}');

// Wait, the safest way is just to rewrite the <video> tag manually since it's short.
content = content.replace(/<video[\s\S]*?\/>/, `<video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => onVideoReady && onVideoReady()}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.9
          }}
        />`);

fs.writeFileSync('src/components/HeroVideo.jsx', content);
