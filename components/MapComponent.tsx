
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Search, Loader2, MapPin, Navigation, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface MapComponentProps {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  center?: [number, number];
  markers?: { lat: number; lng: number; label?: string; iconType?: 'store' | 'customer' }[];
  polyline?: [number, number][]; // New prop for routing
  readOnly?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  onLocationSelect, 
  center = [15.3694, 44.1910], 
  markers = [],
  polyline = [],
  readOnly = false 
}) => {
  const { lang } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const staticMarkersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [currentAddress, setCurrentAddress] = useState('');

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentAddress(addr);
      return addr;
    } catch (e) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const updateMarker = useCallback(async (lat: number, lng: number, shouldTriggerSelect = true) => {
    if (!mapRef.current) return;
    
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], {
        draggable: !readOnly,
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).addTo(mapRef.current);

      if (!readOnly) {
        markerRef.current.on('dragend', async (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          const addr = await reverseGeocode(position.lat, position.lng);
          onLocationSelect?.(position.lat, position.lng, addr);
        });
      }
    }

    if (shouldTriggerSelect) {
      const addr = await reverseGeocode(lat, lng);
      onLocationSelect?.(lat, lng, addr);
    }
  }, [readOnly, onLocationSelect]);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: false
    }).setView(center, 15);

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    if (!readOnly) {
      mapRef.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        updateMarker(lat, lng);
      });
      updateMarker(center[0], center[1], false);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update view/polyline/markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old static markers
    staticMarkersRef.current.forEach(m => mapRef.current?.removeLayer(m));
    staticMarkersRef.current = [];

    // Draw Polyline
    if (polylineRef.current) mapRef.current.removeLayer(polylineRef.current);
    if (polyline && polyline.length > 0) {
      polylineRef.current = L.polyline(polyline, { color: '#f97316', weight: 4, opacity: 0.8, dashArray: '10, 10' }).addTo(mapRef.current);
      mapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50] });
    }

    // Add static markers
    markers.forEach(m => {
      const color = m.iconType === 'store' ? 'blue' : 'red';
      const icon = L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(mapRef.current!);
      if (m.label) marker.bindPopup(m.label);
      staticMarkersRef.current.push(marker);
    });

  }, [markers, polyline]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.setView([latitude, longitude], 17);
        updateMarker(latitude, longitude);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert(lang === 'ar' ? 'تعذر الوصول إلى موقعك' : 'Could not access your location');
      }
    );
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setSuggestions(data);
      } catch (e) {}
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    mapRef.current?.setView([lat, lng], 17);
    updateMarker(lat, lng);
    setSearchQuery(item.display_name);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full h-full group">
      {!readOnly && (
        <div className="absolute top-4 left-4 right-4 z-[1000] space-y-2">
          <div className="relative shadow-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={lang === 'ar' ? 'ابحث عن موقعك...' : 'Search for your location...'}
              className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 outline-none text-sm shadow-xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(item)}
                    className="w-full text-left p-4 hover:bg-orange-50 text-sm border-b last:border-0 border-gray-50 flex items-start gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span className="truncate">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentAddress && (
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white flex items-start gap-2">
              <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight py-0.5">
                {currentAddress}
              </p>
            </div>
          )}
        </div>
      )}

      {!readOnly && (
        <button
          onClick={handleLocateMe}
          className="absolute bottom-6 right-6 z-[1000] bg-white text-orange-600 p-4 rounded-2xl shadow-2xl hover:bg-orange-50 transition-all border border-gray-100 flex items-center gap-2 font-bold text-sm"
        >
          {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
          {lang === 'ar' ? 'موقعي الحالي' : 'Locate Me'}
        </button>
      )}
      
      <div 
        ref={containerRef} 
        className="rounded-3xl overflow-hidden shadow-inner border-4 border-white h-full" 
      />
    </div>
  );
};

export default MapComponent;
