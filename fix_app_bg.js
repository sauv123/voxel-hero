const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(
  'start: "bottom 90%",\n        end: "bottom 10%",',
  'start: "top top",\n        end: "bottom center",'
);

fs.writeFileSync('src/App.jsx', code);
