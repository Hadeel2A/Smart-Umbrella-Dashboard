/**
 * Smart Umbrella Locations
 * GPS coordinates for each umbrella on campus
 * 
 * Campus coordinates (example - adjust to your actual campus):
 * Center: 59.3293° N, 18.0686° E (Stockholm area)
 */

export interface UmbrellaLocation {
  deviceId: string;
  zone: string;
  latitude: number;
  longitude: number;
  mode: "normal" | "hot" | "windy" | "rainy" | "sunny";
}

export const UMBRELLA_LOCATIONS: Record<string, UmbrellaLocation> = {
  "umbrella-01": {
    deviceId: "umbrella-01",
    zone: "North Gate Walkway",
    latitude: 59.3310,
    longitude: 18.0710,
    mode: "normal",
  },
  "umbrella-02": {
    deviceId: "umbrella-02",
    zone: "Student Plaza",
    latitude: 59.3305,
    longitude: 18.0695,
    mode: "hot",
  },
  "umbrella-03": {
    deviceId: "umbrella-03",
    zone: "Main Pedestrian Path",
    latitude: 59.3298,
    longitude: 18.0688,
    mode: "windy",
  },
  "umbrella-04": {
    deviceId: "umbrella-04",
    zone: "South Entrance",
    latitude: 59.3285,
    longitude: 18.0680,
    mode: "rainy",
  },
  "umbrella-05": {
    deviceId: "umbrella-05",
    zone: "Library Walkway",
    latitude: 59.3295,
    longitude: 18.0705,
    mode: "sunny",
  },
  "umbrella-06": {
    deviceId: "umbrella-06",
    zone: "Campus Courtyard",
    latitude: 59.3300,
    longitude: 18.0690,
    mode: "normal",
  },
  "umbrella-07": {
    deviceId: "umbrella-07",
    zone: "Bus Stop Area",
    latitude: 59.3315,
    longitude: 18.0700,
    mode: "hot",
  },
  "umbrella-08": {
    deviceId: "umbrella-08",
    zone: "Parking Walkway",
    latitude: 59.3290,
    longitude: 18.0675,
    mode: "windy",
  },
  "umbrella-09": {
    deviceId: "umbrella-09",
    zone: "Central Plaza",
    latitude: 59.3300,
    longitude: 18.0685,
    mode: "sunny",
  },
  "umbrella-10": {
    deviceId: "umbrella-10",
    zone: "West Gate",
    latitude: 59.3308,
    longitude: 18.0665,
    mode: "rainy",
  },
};

/**
 * Get location by device ID
 */
export function getUmbrellaLocation(deviceId: string): UmbrellaLocation | undefined {
  return UMBRELLA_LOCATIONS[deviceId];
}

/**
 * Get all umbrella locations
 */
export function getAllUmbrellaLocations(): UmbrellaLocation[] {
  return Object.values(UMBRELLA_LOCATIONS);
}

/**
 * Campus center coordinates (for map center)
 */
export const CAMPUS_CENTER = {
  latitude: 59.3300,
  longitude: 18.0690,
};

/**
 * Map zoom level for campus view
 */
export const MAP_ZOOM_LEVEL = 16;
