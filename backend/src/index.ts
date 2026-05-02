import http from "http";
import app from "./app";
import { connectDB } from "./config/db.config";
import { initWebSocket } from "./config/socket.config";

const PORT = process.env.PORT || 5050;

const startServer = async () => {
    await connectDB();

    const server = http.createServer(app);
    
    // Initialize WebSocket
    initWebSocket(server);

    server.on('error', (e: any) => {
        if (e.code === 'EADDRINUSE') {
            console.error(`❌ Error: Port ${PORT} is already in use. Please kill the process or use a different port.`);
            process.exit(1);
        } else {
            console.error('❌ Server Error:', e);
        }
    });

    server.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🔌 WebSocket Server initialized`);
    });
};

startServer();