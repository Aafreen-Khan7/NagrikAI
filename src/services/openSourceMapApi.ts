/**
 * Open Source Map APIs for Nagpur City
 * 
 * 1. OpenStreetMap (OSM) Tiles & Nominatim Geocoding API
 * 2. OSRM (Open Source Routing Machine) API for tactical driving routes
 * 3. Open-Meteo API for real-time Nagpur road weather conditions
 * 4. Nagpur Metro & Corridor GeoJSON Open Infrastructure Lines
 */

export interface GeocodingResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

export interface RouteResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][]; // [lng, lat]
    };
    distance: number; // meters
    duration: number; // seconds
  }>;
}

export interface NagpurWeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  condition: string;
  isRainy: boolean;
}

// 1. OpenStreetMap Nominatim Open Geocoding API
export async function searchNagpurLocation(query: string): Promise<{ name: string; lat: number; lng: number }[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const encoded = encodeURIComponent(`${query.trim()}, Nagpur, Maharashtra, India`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5&bounded=1&viewbox=78.90,21.28,79.28,21.00`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    if (!res.ok) return [];
    const data: GeocodingResult[] = await res.json();
    return data.map(item => ({
      name: item.display_name.split(',')[0] || item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (err) {
    console.warn('Nominatim Geocoding error:', err);
    return [];
  }
}

// 2. OSRM (Open Source Routing Machine) Open API
export async function calculateOSRMRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<{ coordinates: [number, number][]; distanceKm: number; durationMins: number } | null> {
  try {
    // OSRM expects {start_lng},{start_lat};{end_lng},{end_lat}
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: RouteResponse = await res.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // OSRM coordinates are [lng, lat], convert to [lat, lng] for Leaflet
      const latLngs: [number, number][] = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      return {
        coordinates: latLngs,
        distanceKm: Math.round((route.distance / 1000) * 10) / 10,
        durationMins: Math.max(1, Math.round(route.duration / 60)),
      };
    }
    return null;
  } catch (err) {
    console.warn('OSRM Routing error:', err);
    return null;
  }
}

// 3. Open-Meteo Open Weather API for Nagpur
export async function fetchNagpurWeather(): Promise<NagpurWeatherData | null> {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=21.1458&longitude=79.0882&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m';
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current;
    
    const isRainy = (current.precipitation || 0) > 0.2 || (current.rain || 0) > 0.2;
    let condition = 'Clear & Dry';
    if (isRainy) condition = 'Rain Slick Alert';
    else if (current.relative_humidity_2m > 80) condition = 'Humid & Overcast';
    else if (current.temperature_2m > 36) condition = 'High Heat Wave';

    return {
      temperature: Math.round(current.temperature_2m || 29),
      humidity: Math.round(current.relative_humidity_2m || 65),
      precipitation: current.precipitation || 0,
      rain: current.rain || 0,
      windSpeed: Math.round(current.wind_speed_10m || 12),
      condition,
      isRainy,
    };
  } catch (err) {
    console.warn('Open-Meteo Weather error:', err);
    return {
      temperature: 30,
      humidity: 62,
      precipitation: 0,
      rain: 0,
      windSpeed: 10,
      condition: 'Normal Transit Conditions',
      isRainy: false,
    };
  }
}

// 4. Nagpur Open Infrastructure Transit Corridors GeoJSON Data
export const NAGPUR_METRO_ORANGE_LINE: [number, number][] = [
  [21.1980, 79.1120], // Automotive Sq
  [21.1830, 79.1020], // Nari Road
  [21.1710, 79.0910], // Kadbi Chowk
  [21.1625, 79.0825], // GaddiGodam / Sadar
  [21.1550, 79.0820], // Kasturchand Park
  [21.1495, 79.0815], // Zero Mile Freedom Park
  [21.1458, 79.0882], // Sitabuldi Interchange
  [21.1390, 79.0820], // Congress Nagar
  [21.1270, 79.0760], // Rahate Colony
  [21.1190, 79.0720], // Ajni Square
  [21.1120, 79.0665], // Chhatrapati Sq (Wardha Rd)
  [21.1030, 79.0620], // Jaiprakash Nagar
  [21.0920, 79.0560], // Ujjwal Nagar
  [21.0820, 79.0510], // Airport
  [21.0560, 79.0430], // MIHAN / Khapri
];

export const NAGPUR_METRO_AQUA_LINE: [number, number][] = [
  [21.1350, 79.0120], // Lokmanya Nagar
  [21.1370, 79.0280], // Bansi Nagar
  [21.1380, 79.0430], // Vasudev Nagar
  [21.1390, 79.0585], // Dharampeth / Shankar Nagar
  [21.1420, 79.0710], // Institution of Engineers
  [21.1458, 79.0882], // Sitabuldi Interchange
  [21.1480, 79.0990], // Cotton Market / Railway Station
  [21.1470, 79.1120], // Agrasen Chowk
  [21.1440, 79.1240], // Telephone Exchange Square
  [21.1430, 79.1450], // Prajapati Nagar
];
