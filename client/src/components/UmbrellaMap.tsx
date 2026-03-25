import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CAMPUS_CENTER, MAP_ZOOM_LEVEL } from "@shared/umbrella-locations";
import type { DeviceData } from "@/lib/types";

interface UmbrellaMapProps {
  devices: DeviceData[];
  isLoading?: boolean;
}

/**
 * Umbrella Map Component
 * Displays all umbrellas on a Google Map with color-coded status
 */
export function UmbrellaMap({ devices, isLoading = false }: UmbrellaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  // Color coding for umbrella states
  const getMarkerColor = (device: DeviceData): string => {
    if (device.safetyMode === "ON") return "#EF4444"; // Red - Safety mode
    if (device.windSpeed > 20) return "#F97316"; // Orange - High wind
    if (device.temperature > 38) return "#FBBF24"; // Amber - High temp
    if (device.umbrellaState === "OPEN") return "#06B6D4"; // Cyan - Open
    return "#94A3B8"; // Gray - Closed
  };

  const getMarkerTitle = (device: DeviceData): string => {
    const state = device.umbrellaState === "OPEN" ? "🔓 OPEN" : "🔒 CLOSED";
    return `${device.deviceId} - ${state} - ${device.temperature}°C`;
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map
    const map = new google.maps.Map(mapRef.current, {
      zoom: MAP_ZOOM_LEVEL,
      center: {
        lat: CAMPUS_CENTER.latitude,
        lng: CAMPUS_CENTER.longitude,
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
      ],
    });

    mapInstanceRef.current = map;
  }, []);

  // Update markers when devices change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const currentMarkers = markersRef.current;

    // Update existing markers and create new ones
    devices.forEach((device) => {
      if (!device.latitude || !device.longitude) return;

      const markerId = device.deviceId;
      const color = getMarkerColor(device);
      const title = getMarkerTitle(device);

      // Check if marker exists
      if (currentMarkers.has(markerId)) {
        const marker = currentMarkers.get(markerId)!;
        // Update marker appearance
        marker.setTitle(title);
        // Update icon color
        marker.setIcon(createMarkerIcon(color));
      } else {
        // Create new marker
        const marker = new google.maps.Marker({
          position: {
            lat: device.latitude,
            lng: device.longitude,
          },
          map: map,
          title: title,
          icon: createMarkerIcon(color),
          animation: google.maps.Animation.DROP,
        });

        // Add click listener to show info window
        const infoWindow = new google.maps.InfoWindow({
          content: createInfoWindowContent(device),
        });

        marker.addListener("click", () => {
          // Close all other info windows
          document.querySelectorAll(".gm-style-iw").forEach((el) => {
            const parent = el.parentElement;
            if (parent) {
              parent.style.display = "none";
            }
          });
          infoWindow.open(map, marker);
        });

        currentMarkers.set(markerId, marker);
      }
    });

    // Remove markers for devices that no longer exist
    const deviceIds = new Set(devices.map((d) => d.deviceId));
    currentMarkers.forEach((marker, markerId) => {
      if (!deviceIds.has(markerId)) {
        marker.setMap(null);
        currentMarkers.delete(markerId);
      }
    });
  }, [devices]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">
          📍 Umbrella Locations Map
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Real-time device locations with status indicators
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-96 bg-slate-100 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">Loading map...</p>
          </div>
        ) : (
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border border-slate-200"
          />
        )}

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
            <span className="text-xs text-slate-600">Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span className="text-xs text-slate-600">Closed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400"></div>
            <span className="text-xs text-slate-600">Hot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-400"></div>
            <span className="text-xs text-slate-600">Windy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-400"></div>
            <span className="text-xs text-slate-600">Safety</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Create custom marker icon
 */
function createMarkerIcon(color: string): any {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: color,
    fillOpacity: 0.8,
    strokeColor: "#fff",
    strokeWeight: 2,
  };
}

/**
 * Create info window content
 */
function createInfoWindowContent(device: any): string {
  const stateEmoji = device.umbrellaState === "OPEN" ? "🔓" : "🔒";
  const mistEmoji = device.mistStatus === "ON" ? "💨" : "❌";
  const safetyEmoji = device.safetyMode === "ON" ? "🛡️" : "✅";

  return `
    <div style="font-family: Arial; font-size: 12px; padding: 8px; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">
        ${device.deviceId.toUpperCase()}
      </h3>
      <p style="margin: 4px 0;"><strong>Zone:</strong> ${device.zone}</p>
      <p style="margin: 4px 0;"><strong>State:</strong> ${stateEmoji} ${device.umbrellaState}</p>
      <p style="margin: 4px 0;"><strong>Temperature:</strong> ${device.temperature}°C</p>
      <p style="margin: 4px 0;"><strong>Wind Speed:</strong> ${device.windSpeed} m/s</p>
      <p style="margin: 4px 0;"><strong>Sunlight:</strong> ${device.sunlight}%</p>
      <p style="margin: 4px 0;"><strong>Mist System:</strong> ${mistEmoji} ${device.mistStatus}</p>
      <p style="margin: 4px 0;"><strong>Safety Mode:</strong> ${safetyEmoji} ${device.safetyMode}</p>
      <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">
        ${device.decisionReason}
      </p>
    </div>
  `;
}
