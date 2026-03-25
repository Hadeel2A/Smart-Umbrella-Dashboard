import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { DevicesUpdate, DeviceData, DeviceStats, Alert } from "@/lib/types";

/**
 * Hook for WebSocket connection and real-time device updates
 */
export function useWebSocket() {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [socketRef, setSocketRef] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("[WebSocket] Connected");
      setIsConnected(true);
      // Request initial data
      socket.emit("request_data");
    });

    socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
      setIsConnected(false);
    });

    socket.on("devices_update", (data: DevicesUpdate) => {
      console.log("[WebSocket] Received update:", data);
      setDevices(data.devices);
      setStats(data.stats);
      setAlerts(data.alerts);
      setLastUpdate(data.timestamp);
    });

    socket.on("error", (error: any) => {
      console.error("[WebSocket] Error:", error);
    });

    setSocketRef(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  // Callback to manually request data
  const requestData = useCallback(() => {
    if (socketRef) {
      socketRef.emit("request_data");
    }
  }, [socketRef]);

  return {
    devices,
    stats,
    alerts,
    isConnected,
    lastUpdate,
    requestData,
  };
}
