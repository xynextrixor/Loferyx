# Yjs Signaling Server for Retro Machines Gala

This is a minimal y-websocket signaling server designed for real-time code collaboration via WebSockets for the Retro Machines Gala platform.

## Local Development

1. \`npm install\`
2. \`npm start\`
The server will run on \`http://localhost:1234\`.

## Environment Variable (`.env`)
In your main React frontend application, set the \`VITE_WEBSOCKET_URL\` to point to this server.
Example:
\`VITE_WEBSOCKET_URL=ws://localhost:1234\`

## Deployment to Render / Heroku
The provided \`Dockerfile\` can be deployed to any container hosting platforms. 
Since this uses WebSockets, ensure that your hosting provider routes WebSocket traffic effectively (WSS).

For free-tier deployments:
- **Render.com**: Create a new "Web Service" from your GitHub repository pointing to this \`backend/\` folder and use the Docker environment setting.
- **Google Cloud Run**: Use \`gcloud run deploy --source .\`. It supports WebSocket connections natively!
- **Heroku**: Standard \`) Procfile or Docker-based deployments supported.

## Integration Note
If you deploy this, it will be securely accessible via wss://Your-Domain.com.
Remember to update \`VITE_WEBSOCKET_URL=wss://Your-Domain.com\` on your frontend!
