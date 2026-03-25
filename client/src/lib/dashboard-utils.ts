/**
 * Dashboard Utilities
 * Helper functions for data processing, formatting, and calculations
 */

export interface DeviceData {
  deviceId: string;
  temperature: number;
  windSpeed: number;
  sunlight: number;
  umbrellaState: "OPEN" | "CLOSED";
  mistStatus: "ON" | "OFF";
  safetyMode: "ON" | "OFF";
  timestamp?: string;
}

export interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  coolingActive: number;
  safetyTriggered: number;
  avgTemp: number;
  avgWind: string;
  avgSunlight: number;
  criticalAlerts: number;
  warningAlerts: number;
}

/**
 * Calculate dashboard statistics from device data
 */
export function calculateStats(devices: DeviceData[]): DashboardStats {
  if (devices.length === 0) {
    return {
      totalDevices: 0,
      activeDevices: 0,
      coolingActive: 0,
      safetyTriggered: 0,
      avgTemp: 0,
      avgWind: "0.0",
      avgSunlight: 0,
      criticalAlerts: 0,
      warningAlerts: 0,
    };
  }

  const activeDevices = devices.filter((d) => d.umbrellaState === "OPEN").length;
  const coolingActive = devices.filter((d) => d.mistStatus === "ON").length;
  const safetyTriggered = devices.filter((d) => d.safetyMode === "ON").length;

  const avgTemp = Math.round(
    devices.reduce((sum, d) => sum + d.temperature, 0) / devices.length
  );
  const avgWind = (
    devices.reduce((sum, d) => sum + d.windSpeed, 0) / devices.length
  ).toFixed(1);
  const avgSunlight = Math.round(
    devices.reduce((sum, d) => sum + d.sunlight, 0) / devices.length
  );

  const criticalAlerts = devices.filter(
    (d) => d.temperature > 38 || d.windSpeed > 15
  ).length;
  const warningAlerts = devices.filter((d) => d.safetyMode === "ON").length;

  return {
    totalDevices: devices.length,
    activeDevices,
    coolingActive,
    safetyTriggered,
    avgTemp,
    avgWind,
    avgSunlight,
    criticalAlerts,
    warningAlerts,
  };
}

/**
 * Generate mock time-series data for charts
 */
export function generateTimeSeriesData(count: number = 12) {
  return Array.from({ length: count }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    temperature: Math.round(18 + Math.random() * 28),
    windSpeed: Math.round(Math.random() * 20 * 10) / 10,
    sunlight: Math.round(Math.random() * 100),
    humidity: Math.round(40 + Math.random() * 50),
  }));
}

/**
 * Generate mock device data
 */
export function generateMockDevices(count: number = 3): DeviceData[] {
  const devices: DeviceData[] = [];
  for (let i = 1; i <= count; i++) {
    devices.push({
      deviceId: `umbrella-${String(i).padStart(2, "0")}`,
      temperature: Math.round(15 + Math.random() * 35),
      windSpeed: Math.round(Math.random() * 25 * 10) / 10,
      sunlight: Math.round(Math.random() * 100),
      umbrellaState: Math.random() > 0.4 ? "OPEN" : "CLOSED",
      mistStatus: Math.random() > 0.6 ? "ON" : "OFF",
      safetyMode: Math.random() > 0.75 ? "ON" : "OFF",
      timestamp: new Date().toISOString(),
    });
  }
  return devices;
}

/**
 * Format temperature with color coding
 */
export function formatTemperature(temp: number): {
  value: string;
  severity: "safe" | "warning" | "critical";
} {
  return {
    value: `${temp}°C`,
    severity: temp > 38 ? "critical" : temp > 30 ? "warning" : "safe",
  };
}

/**
 * Format wind speed with severity
 */
export function formatWindSpeed(speed: number): {
  value: string;
  severity: "safe" | "warning" | "critical";
} {
  return {
    value: `${speed} m/s`,
    severity: speed > 15 ? "critical" : speed > 10 ? "warning" : "safe",
  };
}

/**
 * Get alert color based on type
 */
export function getAlertColor(
  type: "critical" | "warning" | "info"
): string {
  switch (type) {
    case "critical":
      return "border-l-red-500 bg-red-50";
    case "warning":
      return "border-l-yellow-500 bg-yellow-50";
    default:
      return "border-l-green-500 bg-green-50";
  }
}

/**
 * Get alert icon color based on type
 */
export function getAlertIconColor(
  type: "critical" | "warning" | "info"
): string {
  switch (type) {
    case "critical":
      return "text-red-600";
    case "warning":
      return "text-yellow-600";
    default:
      return "text-green-600";
  }
}

/**
 * Get device status badge color
 */
export function getDeviceStatusColor(
  state: "OPEN" | "CLOSED"
): "blue" | "slate" {
  return state === "OPEN" ? "blue" : "slate";
}

/**
 * Calculate deployment percentage
 */
export function calculateDeploymentPercentage(
  deployed: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((deployed / total) * 100);
}

/**
 * Format timestamp to readable format
 */
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Get trend direction based on values
 */
export function getTrendDirection(
  current: number,
  previous: number
): "up" | "down" | "stable" {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "stable";
}

/**
 * Calculate trend percentage
 */
export function calculateTrendPercentage(
  current: number,
  previous: number
): string {
  if (previous === 0) return "0%";
  const percentage = Math.abs(((current - previous) / previous) * 100);
  return `${percentage.toFixed(1)}%`;
}
