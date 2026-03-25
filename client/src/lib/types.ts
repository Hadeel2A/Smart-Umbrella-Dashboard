/**
 * Shared types for client-side usage
 */

export interface DeviceData {
  deviceId: string;
  temperature: number;
  windSpeed: number;
  sunlight: number;
  umbrellaState: "OPEN" | "CLOSED";
  mistStatus: "ON" | "OFF";
  safetyMode: "ON" | "OFF";
  zone?: string;
  mode?: string;
  rain?: number;
  shadeAngle?: number;
  decisionReason?: string;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeviceStats {
  totalDevices: number;
  activeDevices: number;
  coolingActive: number;
  safetyTriggered: number;
  avgTemp: number;
  avgWind: string;
  avgSunlight: number;
  rainyZones?: number;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  device: string;
  zone: string;
  timestamp: string;
}

export interface DevicesUpdate {
  devices: DeviceData[];
  stats: DeviceStats;
  alerts: Alert[];
  timestamp: string;
}
