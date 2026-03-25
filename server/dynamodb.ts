/**
 * DynamoDB Integration Helper
 * 
 * Connects to AWS DynamoDB and fetches real device data
 * Table: UmbrellaDebug
 * Region: eu-north-1
 */

import { z } from "zod";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getUmbrellaLocation } from "../shared/umbrella-locations";

// Device data schema
export const DeviceDataSchema = z.object({
  deviceId: z.string(),
  temperature: z.number(),
  windSpeed: z.number(),
  sunlight: z.number(),
  umbrellaState: z.enum(["OPEN", "CLOSED"]),
  mistStatus: z.enum(["ON", "OFF"]),
  safetyMode: z.enum(["ON", "OFF"]),
  zone: z.string().optional(),
  mode: z.string().optional(),
  rain: z.number().optional(),
  shadeAngle: z.number().optional(),
  decisionReason: z.string().optional(),
  timestamp: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type DeviceData = z.infer<typeof DeviceDataSchema>;

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

/**
 * Fetch all devices from DynamoDB
 * Scans the UmbrellaDebug table and returns all device data
 */
export async function fetchDevicesFromDynamoDB(): Promise<DeviceData[]> {
  try {
    const tableName = process.env.DYNAMODB_TABLE || "UmbrellaDebug";

    const command = new ScanCommand({
      TableName: tableName,
    });

    const response = await docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      console.warn(`[DynamoDB] No items found in table ${tableName}`);
      return [];
    }

    // Transform DynamoDB items to DeviceData format
    const devices: DeviceData[] = response.Items.map((item: any) => {
      // Extract payload if it exists, otherwise use item directly
      const payload = item.payload || item;
      const deviceId = item.deviceId || payload.deviceId || "unknown";
      
      // Get location from shared locations file
      const location = getUmbrellaLocation(deviceId);

      return {
        deviceId: deviceId,
        temperature: payload.temperature || 0,
        windSpeed: payload.windSpeed || 0,
        sunlight: payload.sunlight || 0,
        umbrellaState: payload.umbrellaState || "CLOSED",
        mistStatus: payload.mistStatus || "OFF",
        safetyMode: payload.safetyMode || "OFF",
        zone: payload.zone || item.zone || "Unknown Zone",
        mode: payload.mode || item.mode || "normal",
        rain: payload.rain || 0,
        shadeAngle: payload.shadeAngle || 0,
        decisionReason: payload.decisionReason || "No decision",
        timestamp: item.timestamp || new Date().toISOString(),
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    });

    console.log(`[DynamoDB] Successfully fetched ${devices.length} devices`);
    return devices;
  } catch (error) {
    console.error("[DynamoDB] Error fetching devices:", error);
    throw new Error(`Failed to fetch devices from DynamoDB: ${error}`);
  }
}

/**
 * Get a specific device by ID
 */
export async function getDeviceById(deviceId: string): Promise<DeviceData | null> {
  try {
    const devices = await fetchDevicesFromDynamoDB();
    const device = devices.find((d) => d.deviceId === deviceId);
    return device || null;
  } catch (error) {
    console.error(`[DynamoDB] Error fetching device ${deviceId}:`, error);
    throw error;
  }
}

/**
 * Calculate device statistics from real data
 */
export async function calculateDeviceStats() {
  try {
    const devices = await fetchDevicesFromDynamoDB();

    if (devices.length === 0) {
      return {
        totalDevices: 0,
        activeDevices: 0,
        coolingActive: 0,
        safetyTriggered: 0,
        avgTemp: 0,
        avgWind: "0.0",
        avgSunlight: 0,
        rainyZones: 0,
      };
    }

    const stats = {
      totalDevices: devices.length,
      activeDevices: devices.filter((d) => d.umbrellaState === "OPEN").length,
      coolingActive: devices.filter((d) => d.mistStatus === "ON").length,
      safetyTriggered: devices.filter((d) => d.safetyMode === "ON").length,
      avgTemp: Math.round(
        devices.reduce((sum, d) => sum + d.temperature, 0) / devices.length
      ),
      avgWind: (
        devices.reduce((sum, d) => sum + d.windSpeed, 0) / devices.length
      ).toFixed(1),
      avgSunlight: Math.round(
        devices.reduce((sum, d) => sum + d.sunlight, 0) / devices.length
      ),
      rainyZones: devices.filter((d) => d.rain === 1).length,
    };

    console.log("[DynamoDB] Statistics calculated:", stats);
    return stats;
  } catch (error) {
    console.error("[DynamoDB] Error calculating stats:", error);
    throw new Error(`Failed to calculate device statistics: ${error}`);
  }
}

/**
 * Get alerts based on device conditions
 */
export async function generateAlerts() {
  try {
    const devices = await fetchDevicesFromDynamoDB();
    const alerts: Array<{
      id: string;
      type: "critical" | "warning" | "info";
      title: string;
      message: string;
      device: string;
      zone: string;
      timestamp: string;
    }> = [];

    devices.forEach((device) => {
      // Critical: High temperature
      if (device.temperature > 38) {
        alerts.push({
          id: `temp-${device.deviceId}`,
          type: "critical",
          title: "🔥 High Temperature Alert",
          message: `Temperature at ${device.temperature}°C exceeds safe threshold. Mist cooling ${device.mistStatus === "ON" ? "activated" : "recommended"}.`,
          device: device.deviceId,
          zone: device.zone || "Unknown",
          timestamp: new Date().toISOString(),
        });
      }

      // Critical: Excessive wind
      if (device.windSpeed > 20) {
        alerts.push({
          id: `wind-${device.deviceId}`,
          type: "critical",
          title: "💨 Excessive Wind Speed",
          message: `Wind speed at ${device.windSpeed} m/s. Safety mode ${device.safetyMode === "ON" ? "activated" : "recommended"}.`,
          device: device.deviceId,
          zone: device.zone || "Unknown",
          timestamp: new Date().toISOString(),
        });
      }

      // Warning: Safety mode active
      if (device.safetyMode === "ON") {
        alerts.push({
          id: `safety-${device.deviceId}`,
          type: "warning",
          title: "🛡️ Safety Mode Active",
          message: "Device operating in protected mode due to adverse conditions.",
          device: device.deviceId,
          zone: device.zone || "Unknown",
          timestamp: new Date().toISOString(),
        });
      }

      // Info: Rain detected
      if (device.rain === 1) {
        alerts.push({
          id: `rain-${device.deviceId}`,
          type: "info",
          title: "🌧️ Rain Detected",
          message: `Rain detected at ${device.zone}. Umbrella ${device.umbrellaState === "OPEN" ? "deployed" : "closed"}.`,
          device: device.deviceId,
          zone: device.zone || "Unknown",
          timestamp: new Date().toISOString(),
        });
      }

      // Info: High sunlight
      if (device.sunlight > 85) {
        alerts.push({
          id: `sun-${device.deviceId}`,
          type: "info",
          title: "☀️ High Sunlight Detected",
          message: `Sunlight at ${device.sunlight}%. Sun-tracking activated at ${device.shadeAngle}° angle.`,
          device: device.deviceId,
          zone: device.zone || "Unknown",
          timestamp: new Date().toISOString(),
        });
      }
    });

    // If no alerts, add system healthy message
    if (alerts.length === 0) {
      alerts.push({
        id: "system-ok",
        type: "info",
        title: "✅ System Healthy",
        message: "All devices operating within nominal parameters.",
        device: "SYSTEM",
        zone: "All Zones",
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`[DynamoDB] Generated ${alerts.length} alerts`);
    return alerts;
  } catch (error) {
    console.error("[DynamoDB] Error generating alerts:", error);
    throw new Error(`Failed to generate alerts: ${error}`);
  }
}
