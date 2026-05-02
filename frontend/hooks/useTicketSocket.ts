"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Message = {
  id: string;
  senderId: string;
  senderRole: "candidate" | "recruiter" | "admin";
  content: string;
  timestamp: string;
  ticketId: string;
};

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function useTicketSocket(ticketId?: string, role: string = "candidate") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticketList, setTicketList] = useState<any[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    setStatus("connecting");
    
    // Connect to the backend WebSocket server
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5050";
    const wsUrl = API_BASE.replace("http", "ws");
    
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setStatus("connected");
        console.log("WebSocket Connected");
        socket.send(JSON.stringify({ 
          type: "join_room", 
          ticketId, 
          payload: { role } 
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.payload]);
        } else if (data.type === "history") {
          setMessages(data.payload);
        } else if (data.type === "ticket_list") {
          setTicketList(data.payload);
        } else if (data.type === "ticket_update") {
          setTicketList((prev) => {
            const index = prev.findIndex(t => t.id === data.payload.id);
            if (index !== -1) {
              const newList = [...prev];
              newList[index] = data.payload;
              return newList;
            }
            return [data.payload, ...prev];
          });
        }
      };

      socket.onclose = () => {
        setStatus("disconnected");
        console.log("WebSocket Disconnected. Retrying in 5s...");
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      socket.onerror = () => {
        setStatus("error");
      };
    } catch (err) {
      setStatus("error");
      reconnectTimeoutRef.current = setTimeout(connect, 5000);
    }
  }, [ticketId]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback((content: string, senderId: string, senderRole: Message["senderRole"], extra: any = {}) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) return false;

    const newMessage = {
      type: "send_message",
      payload: {
        ticketId,
        content,
        senderId,
        senderRole,
        timestamp: new Date().toISOString(),
        ...extra
      }
    };

    socketRef.current.send(JSON.stringify(newMessage));
    return true;
  }, [ticketId]);

  return { messages, ticketList, status, sendMessage };
}
