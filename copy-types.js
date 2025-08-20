// copy-types.js
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, 'index.d.ts'); // o 'src/index.d.ts' si lo tienes ahí
const dest = path.resolve(__dirname, 'dist/gsap-vue.d.ts');

fs.copyFileSync(src, dest);
console.log('✅ TypeScript declarations copied to dist');
