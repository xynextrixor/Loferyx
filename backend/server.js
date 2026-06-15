const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const port = process.env.PORT || 1234;

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('y-websocket signaling server is running');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  console.log('New connection to y-websocket server');
  setupWSConnection(conn, req);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`y-websocket signaling server running on port ${port}`);
});
