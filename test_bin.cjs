const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./backend/node_modules/y-websocket/package.json'));
console.log(pkg.bin);
