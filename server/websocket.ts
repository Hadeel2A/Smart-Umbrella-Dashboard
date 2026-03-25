/**
 * WebSocket Server for Real-Time Device Updates
 * 
 * Provides live streaming of device data to connected clients
 * Automatically broadcasts updates every 30 seconds or when data changes
 */

import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket } from "socket.io";
import { fetchDevicesFromDynamoDB, calculateDeviceStats, generateAlerts } from "./dynamodb";

let io: Server | null = null;
let updateInterval: NodeJS.Timeout | null = null;
let lastDeviceHash: string = "";

/**
 * Initialize WebSocket server
 */
export function initializeWebSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Send initial data to new client
    socket.on("request_data", async () => {
      try {
        const devices = await fetchDevicesFromDynamoDB();
        const stats = await calculateDeviceStats();
        const alerts = await generateAlerts();

        socket.emit("devices_update", {
          devices,
          stats,
          alerts,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("[WebSocket] Error sending initial data:", error);
        socket.emit("error", "Failed to fetch device data");
      }
    });

    socket.on("disconnect", () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  // Start broadcasting updates every 30 seconds
  startBroadcasting();

  return io;
}

/**
 * Start broadcasting device updates to all connected clients
 */
function startBroadcasting() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(async () => {
    if (!io) return;

    try {
      const devices = await fetchDevicesFromDynamoDB();
      const stats = await calculateDeviceStats();
      const alerts = await generateAlerts();

      // Create hash of current data to detect changes
      const currentHash = JSON.stringify(devices).substring(0, 50);

      // Only broadcast if data has changed or every 60 seconds
      if (currentHash !== lastDeviceHash || Math.random() > 0.5) {
        lastDeviceHash = currentHash;

        io.emit("devices_update", {
          devices,
          stats,
          alerts,
          timestamp: new Date().toISOString(),
        });

        console.log(`[WebSocket] Broadcasting update to ${io.engine.clientsCount} clients`);
      }
    } catch (error) {
      console.error("[WebSocket] Error broadcasting updates:", error);
      io.emit("error", "Failed to fetch device data");
    }
  }, 30000); // Update every 30 seconds
}

/**
 * Stop broadcasting
 */
export function stopBroadcasting() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

/**
 * Get WebSocket server instance
 */
export function getWebSocketServer(): Server | null {
  return io;
}

/**
 * Broadcast custom event to all clients
 */
export function broadcastEvent(event: string, data: any) {
  if (io) {
    io.emit(event, data);
  }
}
