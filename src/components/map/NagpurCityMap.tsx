import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { Junction, RiskLevel } from '../../types';
import { 
  searchNagpurLocation, 
  calculateOSRMRoute, 
  fetchNagpurWeather, 
  NagpurWeatherData, 
  NAGPUR_METRO_ORANGE_LINE, 
  NAGPUR_METRO_AQUA_LINE 
} from '../../services/openSourceMapApi';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Layers, 
  Navigation, 
  Flame, 
  Sparkles,
  Search,
  CloudRain,
  Sun,
  Locate,
  Route as RouteIcon,
  Compass,
  Zap,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

interface NagpurCityMapProps {
  heightClass?: string;
  showAllControls?: boolean;
  onSelectJunction?: (junction: Junction) => void;
}

type TileProvider = 'carto-voyager' | 'osm-standard' | 'carto-dark' | 'satellite';

export const NagpurCityMap: React.FC<NagpurCityMapProps> = ({
  heightClass = 'h-[580px]',
  showAllControls = true,
  onSelectJunction,
}) => {
  const { 
    junctions, 
    officers, 
    citizenReports, 
    selectedJunctionId, 
    setSelectedJunctionId,
    setActiveView,
    aiProposals
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const officersLayerRef = useRef<L.LayerGroup | null>(null);
  const incidentsLayerRef = useRef<L.LayerGroup | null>(null);
  const metroLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // States
  const [tileProvider, setTileProvider] = useState<TileProvider>('carto-voyager');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showOfficers, setShowOfficers] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showMetro, setShowMetro] = useState<boolean>(true);
  const [weather, setWeather] = useState<NagpurWeatherData | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeRouteInfo, setActiveRouteInfo] = useState<{ distanceKm: number; durationMins: number; from: string; to: string } | null>(null);

  const selectedJunction = junctions.find(j => j.id === selectedJunctionId) || null;

  // Fetch real Nagpur weather from Open-Meteo
  useEffect(() => {
    fetchNagpurWeather().then(data => {
      if (data) setWeather(data);
    });
  }, []);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return '#B8332C';
      case 'High': return '#E56B2F';
      case 'Moderate': return '#C58A2A';
      case 'Low': return '#2E6B4A';
      default: return '#5E625F';
    }
  };

  const getRiskBg = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'bg-[#B8332C] text-white';
      case 'High': return 'bg-[#E56B2F] text-white';
      case 'Moderate': return 'bg-[#C58A2A] text-white';
      case 'Low': return 'bg-[#2E6B4A] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Helper to get tile URL
  const getTileConfig = (provider: TileProvider) => {
    switch (provider) {
      case 'osm-standard':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          maxZoom: 19,
        };
      case 'carto-dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Open GIS Imagery',
          maxZoom: 18,
        };
      case 'carto-voyager':
      default:
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Nagpur Center [21.1458, 79.0882] (Sitabuldi / Zero Mile)
    const map = L.map(mapContainerRef.current, {
      center: [21.1458, 79.0882],
      zoom: 13,
      zoomControl: false, // will add custom position
      attributionControl: false,
    });

    // Add zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer
    const tileConfig = getTileConfig(tileProvider);
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Create Layer Groups
    heatLayerRef.current = L.layerGroup().addTo(map);
    metroLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    incidentsLayerRef.current = L.layerGroup().addTo(map);
    officersLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when tileProvider changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileConfig = getTileConfig(tileProvider);
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(mapInstanceRef.current);
  }, [tileProvider]);

  // Render Nagpur Metro Lines (Open Infrastructure Overlay)
  useEffect(() => {
    if (!metroLayerRef.current) return;
    metroLayerRef.current.clearLayers();

    if (!showMetro) return;

    // Orange Line 1
    const orangePolyline = L.polyline(NAGPUR_METRO_ORANGE_LINE, {
      color: '#E56B2F',
      weight: 4,
      dashArray: '8, 5',
      opacity: 0.85,
    });
    orangePolyline.bindTooltip('Nagpur Metro Line 1 (Orange Line: Automotive Sq ↔ MIHAN)', {
      sticky: true,
      className: 'text-xs font-bold text-[#E56B2F] bg-white border border-[#E56B2F] px-2 py-1 rounded shadow-sm',
    });
    metroLayerRef.current.addLayer(orangePolyline);

    // Aqua Line 2
    const aquaPolyline = L.polyline(NAGPUR_METRO_AQUA_LINE, {
      color: '#148899',
      weight: 4,
      dashArray: '8, 5',
      opacity: 0.85,
    });
    aquaPolyline.bindTooltip('Nagpur Metro Line 2 (Aqua Line: Prajapati Nagar ↔ Lokmanya Nagar)', {
      sticky: true,
      className: 'text-xs font-bold text-[#148899] bg-white border border-[#148899] px-2 py-1 rounded shadow-sm',
    });
    metroLayerRef.current.addLayer(aquaPolyline);
  }, [showMetro]);

  // Render Heatmap Circles
  useEffect(() => {
    if (!heatLayerRef.current) return;
    heatLayerRef.current.clearLayers();

    if (!showHeatmap) return;

    junctions.forEach(j => {
      const radius = Math.max(350, (j.currentRisk / 100) * 800);
      const color = getRiskColor(j.riskLevel);

      const circle = L.circle([j.coordinates.lat, j.coordinates.lng], {
        radius,
        color: color,
        fillColor: color,
        fillOpacity: j.riskLevel === 'Critical' ? 0.35 : 0.22,
        weight: 0,
      });
      heatLayerRef.current?.addLayer(circle);
    });
  }, [junctions, showHeatmap]);

  // Render Junction Markers with dynamic OpenStreetMap badges
  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    junctions.forEach(j => {
      const isSelected = selectedJunctionId === j.id;
      const riskColor = getRiskColor(j.riskLevel);
      const isCritical = j.riskLevel === 'Critical';
      const isDark = tileProvider === 'carto-dark';

      // Custom HTML Marker icon
      const customIcon = L.divIcon({
        className: 'custom-junction-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        html: `
          <div class="relative flex items-center justify-center w-10 h-10 cursor-pointer group">
            ${isCritical ? `<span class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style="background-color: ${riskColor};"></span>` : ''}
            ${isSelected ? `<span class="absolute inline-flex h-12 w-12 rounded-full border-2 border-dashed border-[#E56B2F] animate-spin"></span>` : ''}
            <div class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-md transition-transform duration-200 group-hover:scale-110" style="background-color: ${riskColor}; border-color: ${isSelected ? '#FFFFFF' : '#FAF8F4'};">
              <span class="text-white text-[10px] font-extrabold">${j.currentRisk}</span>
            </div>
            <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20 pointer-events-none">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold shadow-xs border transition-colors ${
                isSelected 
                  ? 'bg-[#142C54] text-white border-[#E56B2F]' 
                  : isDark
                    ? 'bg-[#142C54]/90 text-white border-[#334863]'
                    : 'bg-white/95 text-[#142C54] border-[#DCDCD6]'
              }">
                ${j.name.replace(' Junction', '').replace(' (Chhatrapati Sq)', '')}
              </span>
            </div>
          </div>
        `,
      });

      const marker = L.marker([j.coordinates.lat, j.coordinates.lng], { icon: customIcon });
      
      marker.on('click', () => {
        setSelectedJunctionId(j.id);
        if (onSelectJunction) onSelectJunction(j);
      });

      // Interactive Leaflet Popup
      const popupHtml = `
        <div class="p-3 select-none text-xs font-sans">
          <div class="flex items-center justify-between gap-2 pb-2 border-b border-gray-200 mb-2">
            <div>
              <strong class="text-sm font-bold text-[#142C54] block">${j.name}</strong>
              <span class="text-[10px] text-gray-500">${j.marathiName} • ${j.zone} Zone</span>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-extrabold text-white" style="background-color: ${riskColor};">
              ${j.riskLevel} (${j.currentRisk}/100)
            </span>
          </div>
          <p class="text-[11px] text-gray-600 mb-2">${j.primaryRoad}</p>
          <div class="grid grid-cols-2 gap-1.5 mb-2 bg-[#FAF8F4] p-2 rounded border border-gray-200">
            <div>
              <span class="text-[10px] text-gray-500 block uppercase font-semibold">Staffing</span>
              <span class="font-bold text-[#142C54] text-xs">${j.presentOfficers} / ${j.requiredOfficers} Officers</span>
            </div>
            <div>
              <span class="text-[10px] text-gray-500 block uppercase font-semibold">Flow Vol</span>
              <span class="font-bold text-[#142C54] text-xs">${j.trafficVolumeHourly}/hr</span>
            </div>
          </div>
          <div class="text-[10px] text-gray-500">
            <strong>Key Factor:</strong> ${j.riskFactors[0]?.name || 'Standard Traffic'}
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml, { closeButton: false, minWidth: 220 });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [junctions, selectedJunctionId, tileProvider]);

  // Render Officer Markers
  useEffect(() => {
    if (!officersLayerRef.current) return;
    officersLayerRef.current.clearLayers();

    if (!showOfficers) return;

    officers
      .filter(o => o.currentStatus !== 'Off Duty')
      .forEach(off => {
        // Approximate position offset near their assigned junction
        const junc = junctions.find(j => j.id === off.assignedJunctionId);
        if (!junc) return;

        const offsetLat = (Math.sin(off.badgeNumber.charCodeAt(3) || 1) * 0.002);
        const offsetLng = (Math.cos(off.badgeNumber.charCodeAt(3) || 1) * 0.002);

        const icon = L.divIcon({
          className: 'officer-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          html: `
            <div class="w-7 h-7 rounded-full bg-[#142C54] border-2 border-white text-white flex items-center justify-center shadow-md text-xs cursor-pointer hover:scale-110 transition-transform">
              👮
            </div>
          `,
        });

        const marker = L.marker([junc.coordinates.lat + offsetLat, junc.coordinates.lng + offsetLng], { icon });
        marker.bindTooltip(`Officer ${off.name} (${off.badgeNumber}) — ${off.currentStatus}`, {
          sticky: true,
          className: 'text-xs font-semibold bg-[#142C54] text-white px-2 py-1 rounded shadow-sm',
        });
        officersLayerRef.current?.addLayer(marker);
      });
  }, [officers, junctions, showOfficers]);

  // Render Citizen Incident Markers
  useEffect(() => {
    if (!incidentsLayerRef.current) return;
    incidentsLayerRef.current.clearLayers();

    if (!showIncidents) return;

    citizenReports
      .filter(r => r.status !== 'Resolved' && r.status !== 'Rejected')
      .forEach((rep, idx) => {
        const icon = L.divIcon({
          className: 'incident-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          html: `
            <div class="relative w-7 h-7 rounded-full bg-[#B8332C] border-2 border-white text-white flex items-center justify-center shadow-md animate-bounce">
              <span class="text-xs">⚠️</span>
            </div>
          `,
        });

        const marker = L.marker([rep.coordinates.lat, rep.coordinates.lng], { icon });
        marker.bindPopup(`
          <div class="p-2.5 text-xs">
            <strong class="text-[#B8332C] block font-bold text-sm">${rep.type}</strong>
            <p class="text-gray-700 mt-1">${rep.description}</p>
            <div class="mt-2 pt-1 border-t border-gray-200 text-[10px] text-gray-500 flex justify-between">
              <span>Ref: ${rep.referenceId}</span>
              <span class="font-bold text-[#E56B2F]">${rep.status}</span>
            </div>
          </div>
        `, { closeButton: false });
        incidentsLayerRef.current?.addLayer(marker);
      });
  }, [citizenReports, showIncidents]);

  // Handle Nominatim Location Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchNagpurLocation(searchQuery);
    setSearchResults(results);
    setIsSearching(false);

    if (results.length > 0 && mapInstanceRef.current) {
      const first = results[0];
      mapInstanceRef.current.flyTo([first.lat, first.lng], 15, { duration: 1.5 });
    }
  };

  const handleSelectSearchResult = (res: { name: string; lat: number; lng: number }) => {
    setSearchResults([]);
    setSearchQuery(res.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([res.lat, res.lng], 15, { duration: 1.5 });
    }
  };

  // Calculate and Draw OSRM Tactical Driving Route
  const handleDrawTacticalRoute = async (destinationJunction: Junction) => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    // Route from reserve HQ (Zero Mile) or an origin junction to destination
    const origin = junctions.find(j => j.id === 'junc-zero-mile') || junctions[0];
    const startCoord = { lat: origin.coordinates.lat, lng: origin.coordinates.lng };
    const endCoord = { lat: destinationJunction.coordinates.lat, lng: destinationJunction.coordinates.lng };

    const routeData = await calculateOSRMRoute(startCoord, endCoord);
    if (routeData) {
      const polyline = L.polyline(routeData.coordinates, {
        color: '#E56B2F',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Pulsating dashed line on top for high-tech tactical visual
      const dashedPolyline = L.polyline(routeData.coordinates, {
        color: '#FFFFFF',
        weight: 3,
        dashArray: '8, 12',
        opacity: 0.9,
      });

      routeLayerRef.current.addLayer(polyline);
      routeLayerRef.current.addLayer(dashedPolyline);

      setActiveRouteInfo({
        distanceKm: routeData.distanceKm,
        durationMins: routeData.durationMins,
        from: origin.name,
        to: destinationJunction.name,
      });

      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  };

  const handleClearRoute = () => {
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
    setActiveRouteInfo(null);
  };

  const handleCenterNagpur = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([21.1458, 79.0882], 13, { duration: 1.2 });
    }
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-[#DCDCD6] bg-[#FAF8F4] flex flex-col select-none shadow-sm`}>
      {/* Top Map Toolbar: Open Source Tile Selectors & Layer Toggles */}
      {showAllControls && (
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 max-w-[calc(100%-24px)]">
          {/* Tile Provider Selector */}
          <div className="flex bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#DCDCD6] shadow-sm">
            <button
              id="tile-carto-btn"
              onClick={() => setTileProvider('carto-voyager')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                tileProvider === 'carto-voyager'
                  ? 'bg-[#142C54] text-white shadow-xs'
                  : 'text-[#5E625F] hover:text-[#142C54]'
              }`}
            >
              Vector
            </button>
            <button
              id="tile-osm-btn"
              onClick={() => setTileProvider('osm-standard')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                tileProvider === 'osm-standard'
                  ? 'bg-[#142C54] text-white shadow-xs'
                  : 'text-[#5E625F] hover:text-[#142C54]'
              }`}
            >
              Classic
            </button>
            <button
              id="tile-dark-btn"
              onClick={() => setTileProvider('carto-dark')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                tileProvider === 'carto-dark'
                  ? 'bg-[#142C54] text-white shadow-xs'
                  : 'text-[#5E625F] hover:text-[#142C54]'
              }`}
            >
              Tactical Dark
            </button>
            <button
              id="tile-sat-btn"
              onClick={() => setTileProvider('satellite')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                tileProvider === 'satellite'
                  ? 'bg-[#142C54] text-white shadow-xs'
                  : 'text-[#5E625F] hover:text-[#142C54]'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Layer Filter Toggles */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#DCDCD6] shadow-sm">
            <button
              id="toggle-heatmap-btn"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                showHeatmap
                  ? 'bg-[#E56B2F]/10 border-[#E56B2F] text-[#B94A1F]'
                  : 'bg-transparent border-transparent text-[#5E625F] hover:bg-[#FAF8F4]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Heatmap</span>
            </button>

            <button
              id="toggle-metro-btn"
              onClick={() => setShowMetro(!showMetro)}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                showMetro
                  ? 'bg-[#148899]/10 border-[#148899] text-[#148899]'
                  : 'bg-transparent border-transparent text-[#5E625F] hover:bg-[#FAF8F4]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Metro Grid</span>
            </button>

            <button
              id="toggle-officers-btn"
              onClick={() => setShowOfficers(!showOfficers)}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                showOfficers
                  ? 'bg-[#142C54]/10 border-[#142C54] text-[#142C54]'
                  : 'bg-transparent border-transparent text-[#5E625F] hover:bg-[#FAF8F4]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Patrols</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Right: Open Source API Status Badges & Weather */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        {weather && (
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DCDCD6] shadow-sm flex items-center gap-2 text-xs font-bold text-[#142C54]">
            {weather.isRainy ? (
              <CloudRain className="w-4 h-4 text-[#B8332C] animate-pulse" />
            ) : (
              <Sun className="w-4 h-4 text-[#E56B2F]" />
            )}
            <span>Nagpur: {weather.temperature}°C</span>
            <span className="text-[10px] font-medium text-[#5E625F] hidden md:inline">({weather.condition})</span>
          </div>
        )}

        <button
          id="btn-recenter-nagpur"
          onClick={handleCenterNagpur}
          title="Recenter Map to Nagpur Zero Mile"
          className="bg-white/95 backdrop-blur-md p-2 rounded-xl border border-[#DCDCD6] shadow-sm text-[#142C54] hover:text-[#E56B2F] hover:bg-[#FAF8F4] transition-colors"
        >
          <Locate className="w-4 h-4" />
        </button>
      </div>

      {/* OpenStreetMap Nominatim Live Geocoding Search Bar */}
      <div className="absolute top-16 left-3 z-[1000] w-72 max-w-[calc(100%-24px)]">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search Nagpur Chowk / Landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-2 text-xs bg-white/95 backdrop-blur-md rounded-xl border border-[#DCDCD6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#E56B2F] text-[#142C54] placeholder-[#5E625F]"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#5E625F]" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="absolute right-2.5 top-2.5 text-[#5E625F] hover:text-[#142C54]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>

        {/* Nominatim Search Autocomplete Results */}
        {searchResults.length > 0 && (
          <div className="mt-1 bg-white rounded-xl border border-[#DCDCD6] shadow-lg overflow-hidden max-h-48 overflow-y-auto">
            {searchResults.map((res, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectSearchResult(res)}
                className="w-full px-3 py-2 text-left text-xs text-[#142C54] hover:bg-[#FAF8F4] border-b border-[#DCDCD6]/60 last:border-none flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E56B2F] shrink-0" />
                <span className="truncate">{res.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real Active OSRM Tactical Route Overlay Card */}
      {activeRouteInfo && (
        <div className="absolute top-28 left-3 z-[1000] bg-[#142C54] text-white p-3 rounded-xl border border-[#E56B2F] shadow-lg text-xs space-y-1.5 max-w-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1">
            <span className="font-extrabold text-[#F4D8C7] flex items-center gap-1.5">
              <RouteIcon className="w-3.5 h-3.5 text-[#E56B2F]" />
              Tactical Route
            </span>
            <button onClick={handleClearRoute} className="text-white/70 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="text-[11px] space-y-0.5">
            <p className="text-white/80">From: <strong className="text-white">{activeRouteInfo.from}</strong></p>
            <p className="text-white/80">To: <strong className="text-white">{activeRouteInfo.to}</strong></p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[11px]">
            <span className="font-mono font-bold text-[#E56B2F]">{activeRouteInfo.distanceKm} km transit</span>
            <span className="bg-[#2E6B4A] px-2 py-0.5 rounded font-bold">ETA: ~{activeRouteInfo.durationMins} mins</span>
          </div>
        </div>
      )}

      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full flex-1 h-full" />

      {/* Bottom Map Legend & Open Source Attribution Footer */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-2 border-t border-[#DCDCD6] flex flex-wrap items-center justify-between gap-3 text-xs z-[1000]">
        {/* Risk Legend */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#5E625F] uppercase text-[10px] tracking-wider">Live Risk:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4A]" />
            <span className="text-[#252525] font-medium text-[11px]">Low (0-44)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C58A2A]" />
            <span className="text-[#252525] font-medium text-[11px]">Moderate (45-69)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E56B2F]" />
            <span className="text-[#252525] font-medium text-[11px]">High (70-84)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8332C] animate-pulse" />
            <span className="text-[#B8332C] font-bold text-[11px]">Critical (85-100)</span>
          </div>
        </div>

        {/* Open Source Tech Attribution Tag */}
        <div className="flex items-center gap-2 text-[10px] text-[#5E625F]">
        </div>
      </div>

      {/* Selected Location Full Detail Popover Drawer */}
      {selectedJunction && (
        <div className="absolute bottom-12 right-3 z-[1000] w-80 max-w-[calc(100vw-24px)] bg-white/98 backdrop-blur-md rounded-2xl border border-[#DCDCD6] shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 border-b border-[#DCDCD6] pb-2.5 mb-3">
            <div>
              <h3 className="font-extrabold text-[#142C54] text-sm leading-tight">{selectedJunction.name}</h3>
              <p className="text-[11px] text-[#5E625F]">{selectedJunction.marathiName} • {selectedJunction.zone} Zone</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold shrink-0 ${getRiskBg(selectedJunction.riskLevel)}`}>
              {selectedJunction.riskLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-[#FAF8F4] p-2 rounded-xl border border-[#DCDCD6]/60">
              <span className="text-[10px] uppercase font-bold text-[#5E625F] block">Multi-Factor Risk</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold" style={{ color: getRiskColor(selectedJunction.riskLevel) }}>
                  {selectedJunction.currentRisk}
                </span>
                <span className="text-[10px] text-[#5E625F]">/ 100</span>
              </div>
            </div>

            <div className="bg-[#FAF8F4] p-2 rounded-xl border border-[#DCDCD6]/60">
              <span className="text-[10px] uppercase font-bold text-[#5E625F] block">Police Coverage</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-extrabold ${selectedJunction.presentOfficers < selectedJunction.requiredOfficers ? 'text-[#B8332C]' : 'text-[#2E6B4A]'}`}>
                  {selectedJunction.presentOfficers} / {selectedJunction.requiredOfficers}
                </span>
                <span className="text-[10px] text-[#5E625F]">
                  ({Math.round((selectedJunction.presentOfficers / selectedJunction.requiredOfficers) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Top Contributing Factors */}
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E625F] block mb-1.5">
              Contributing Risk Factors:
            </span>
            <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
              {selectedJunction.riskFactors.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] bg-[#FAF8F4] px-2 py-1 rounded-lg">
                  <span className="text-[#252525] truncate mr-2">{f.name}</span>
                  <span className="font-bold text-[#E56B2F] shrink-0">+{f.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#DCDCD6]">
            <button
              id="map-drawer-route-btn"
              onClick={() => handleDrawTacticalRoute(selectedJunction)}
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-[#142C54] hover:bg-[#1f3f72] text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <RouteIcon className="w-3.5 h-3.5 text-[#E56B2F]" />
              <span>Route</span>
            </button>

            <button
              id="map-drawer-close-btn"
              onClick={() => setSelectedJunctionId(null)}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-[#FAF8F4] hover:bg-[#DCDCD6]/50 text-[#5E625F] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
