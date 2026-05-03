import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

type WSMessage = {
  type: "join_room" | "send_message";
  ticketId?: string;
  payload?: any;
};

// Store active tickets in memory (for production, move to DB/Redis)
const activeTickets = new Map<string, any>();

export const initWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });
  const rooms = new Map<string, Set<WebSocket>>();
  const admins = new Set<WebSocket>();
  const allClients = new Set<WebSocket>();

  const broadcastToAdmins = (type: string, payload: any) => {
    const message = JSON.stringify({ type, payload });
    admins.forEach(admin => {
      if (admin.readyState === WebSocket.OPEN) {
        admin.send(message);
      }
    });
  };

  (global as any).sendWSNotification = (payload: any) => {
    const message = JSON.stringify({ type: "notification", payload });
    allClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  wss.on("connection", (ws) => {
    console.log("New WebSocket Connection");
    allClients.add(ws);
    let currentTicketId: string | null = null;
    let is_admin = false;

    ws.on("message", (data) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());

        switch (message.type) {
          case "join_room":
            if (message.payload?.role === "admin") {
              is_admin = true;
              admins.add(ws);
              // Send all active tickets to the admin
              ws.send(JSON.stringify({ 
                type: "ticket_list", 
                payload: Array.from(activeTickets.values()) 
              }));
              console.log("Admin joined support channel");
            }

            if (message.ticketId) {
              if (currentTicketId && rooms.has(currentTicketId)) {
                rooms.get(currentTicketId)?.delete(ws);
              }
              currentTicketId = message.ticketId;
              if (!rooms.has(currentTicketId)) {
                rooms.set(currentTicketId, new Set());
              }
              rooms.get(currentTicketId)?.add(ws);
              console.log(`User joined ticket room: ${currentTicketId}`);
            }
            break;

          case "send_message":
            if (currentTicketId && message.payload) {
              const msgPayload = {
                ...message.payload,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
              };

              // Update ticket record
              if (!is_admin) {
                activeTickets.set(currentTicketId, {
                  id: currentTicketId,
                  userName: message.payload.userName || "Anonymous",
                  userRole: message.payload.senderRole,
                  subject: message.payload.subject || "Support Request",
                  lastMessage: message.payload.content,
                  timestamp: msgPayload.timestamp,
                  status: "awaiting"
                });
                broadcastToAdmins("ticket_update", activeTickets.get(currentTicketId));
              }

              const broadcastMessage = JSON.stringify({
                type: "message",
                payload: msgPayload
              });

              rooms.get(currentTicketId)?.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(broadcastMessage);
                }
              });
            }
            break;
        }
      } catch (err) {
        console.error("WebSocket Error:", err);
      }
    });

    ws.on("close", () => {
      if (currentTicketId && rooms.has(currentTicketId)) {
        rooms.get(currentTicketId)?.delete(ws);
      }
      if (is_admin) {
        admins.delete(ws);
      }
      allClients.delete(ws);
    });
  });

  return wss;
};
