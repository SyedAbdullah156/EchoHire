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

    // Graceful shutdown logic
    const gracefulShutdown = (signal: string) => {
        console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
        server.close(() => {
            console.log('✅ Server closed. Exiting process.');
            process.exit(0);
        });
        
        // Force exit after 3 seconds if cleanup hangs
        setTimeout(() => {
            console.error('⚠️ Could not close connections in time, forceful shutdown');
            process.exit(1);
        }, 3000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

startServer();