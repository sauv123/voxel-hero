const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldHeadline = `<h1 className="hero-title" style={{ fontFamily: "var(--font-body)", color: theme.text, textTransform: 'none' }}>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="I help people" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="understand & trust AI" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="through" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.06em', color: theme.brand, display: 'block', margin: '0.15rem 0' }}>
              <SplitChars text="thoughtful design." />
            </span>
          </h1>`;

const newHeadline = `<h1 className="hero-title" style={{ fontFamily: "var(--font-body)", color: theme.text, textTransform: 'none' }}>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="Designing" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="human-centered interfaces" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 400, opacity: 0.8, display: 'block' }}>
              <SplitChars text="for next-gen" />
            </span>
            <span className="line-wrap" style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.06em', color: theme.brand, display: 'block', margin: '0.15rem 0' }}>
              <SplitChars text="AI products." />
            </span>
          </h1>`;

code = code.replace(oldHeadline, newHeadline);
fs.writeFileSync('src/App.jsx', code);
