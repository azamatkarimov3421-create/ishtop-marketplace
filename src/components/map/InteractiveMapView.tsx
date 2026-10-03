import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useStore } from '../../lib/store';
import { SpecialistProfile, Job } from '../../types';
import { Star, MapPin, Car, CheckCircle2, X, LocateFixed, Loader2, Compass, Layers, Satellite, Map as MapIcon } from 'lucide-react';
import { formatDistance, formatCurrency, getCurrentGpsPosition, reverseGeocodeOsm } from '../../lib/geo';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyByWewBXjtK8xmFB-LjiKQUzoSTGCpsunU';

interface InteractiveMapViewProps {
  onViewProfile: (spec: SpecialistProfile) => void;
  onContact: (spec: SpecialistProfile) => void;
  onViewJob: (job: Job) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  onViewProfile,
  onContact,
  onViewJob,
}) => {
  const { selectedCity, serviceRadiusKm, specialists, jobs, actions } = useStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'google_streets' | 'google_satellite' | 'osm'>('google_streets');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ustalar' | 'ishlar'>('all');
  const [selectedSpec, setSelectedSpec] = useState<SpecialistProfile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  const applyTileLayer = (map: L.Map, type: 'google_streets' | 'google_satellite' | 'osm') => {
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    let layer: L.TileLayer;
    if (type === 'google_streets') {
      layer = L.tileLayer(
        `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_KEY}`,
        {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 21,
          attribution: '&copy; Google Maps',
        }
      );
    } else if (type === 'google_satellite') {
      layer = L.tileLayer(
        `https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_KEY}`,
        {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 21,
          attribution: '&copy; Google Satellite',
        }
      );
    } else {
      layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });
    }
    layer.addTo(map);
    tileLayerRef.current = layer;
  };

  const handleLocateMe = async () => {
    setIsGpsLoading(true);
    try {
      const pos = await getCurrentGpsPosition();
      const geo = await reverseGeocodeOsm(pos.lat, pos.lng);
      actions.setSelectedCity({
        name: geo.city || "Joriy joylashuv",
        region: geo.district || "O'zbekiston",
        lat: pos.lat,
        lng: pos.lng
      });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([pos.lat, pos.lng], 14, { duration: 1.2 });
      }
      setGpsNotice(`Aniq GPS topildi: ${geo.road ? geo.road + ', ' : ''}${geo.city}`);
      setTimeout(() => setGpsNotice(null), 4000);
    } catch (err: any) {
      alert("GPS koordinata olish uchun brauzerda 'Joylashuvga ruxsat berish' (Allow location) tugmasini bosing.");
    } finally {
      setIsGpsLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCity.lat, selectedCity.lng],
        zoom: 13,
        zoomControl: false,
      });

      applyTileLayer(map, mapType);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Interactive map click: move center anywhere on the map
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const geo = await reverseGeocodeOsm(lat, lng);
        actions.setSelectedCity({
          name: geo.city,
          region: geo.district,
          lat,
          lng
        });
        setGpsNotice(`Yangi markaz: ${geo.road ? geo.road + ', ' : ''}${geo.city}`);
        setTimeout(() => setGpsNotice(null), 3500);
      });
    } else {
      mapInstanceRef.current.setView([selectedCity.lat, selectedCity.lng], 13);
    }

    const map = mapInstanceRef.current;

    // Draw user location & radius circle
    if (circleRef.current) {
      circleRef.current.remove();
    }

    const circleRadiusMeters = (serviceRadiusKm === 999 ? 100 : serviceRadiusKm) * 1000;
    circleRef.current = L.circle([selectedCity.lat, selectedCity.lng], {
      radius: circleRadiusMeters,
      color: mapType === 'google_satellite' ? '#38bdf8' : '#2563eb',
      fillColor: mapType === 'google_satellite' ? '#38bdf8' : '#3b82f6',
      fillOpacity: mapType === 'google_satellite' ? 0.22 : 0.12,
      weight: 2,
      dashArray: '6, 6',
    }).addTo(map);

    // Draw center user marker
    const userIcon = L.divIcon({
      className: 'user-center-marker',
      html: `
        <div style="
          width: 22px; 
          height: 22px; 
          background: #2563eb; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 0 12px rgba(37,99,235,0.6);
        "></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    L.marker([selectedCity.lat, selectedCity.lng], { icon: userIcon }).addTo(map);

    // Clean old markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    // Add Specialist Markers
    if (activeFilter === 'all' || activeFilter === 'ustalar') {
      specialists.forEach((spec) => {
        const specIcon = L.divIcon({
          className: 'spec-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: white;
              border: 3px solid ${spec.isVip ? '#eab308' : '#2563eb'};
              box-shadow: 0 4px 10px rgba(0,0,0,0.25);
              overflow: hidden;
              cursor: pointer;
            ">
              <img src="${spec.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([spec.lat, spec.lng], { icon: specIcon });
        marker.on('click', () => {
          setSelectedJob(null);
          setSelectedSpec(spec);
          map.panTo([spec.lat, spec.lng]);
        });
        marker.addTo(markersLayerRef.current!);
      });
    }

    // Add Job Markers
    if (activeFilter === 'all' || activeFilter === 'ishlar') {
      jobs.forEach((job) => {
        const jobIcon = L.divIcon({
          className: 'job-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 34px;
              height: 34px;
              border-radius: 12px;
              background: #10b981;
              color: white;
              font-weight: bold;
              box-shadow: 0 4px 10px rgba(16,185,129,0.4);
              cursor: pointer;
              font-size: 16px;
            ">
              💼
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([job.lat, job.lng], { icon: jobIcon });
        marker.on('click', () => {
          setSelectedSpec(null);
          setSelectedJob(job);
          map.panTo([job.lat, job.lng]);
        });
        marker.addTo(markersLayerRef.current!);
      });
    }

  }, [selectedCity, serviceRadiusKm, specialists, jobs, activeFilter, mapType]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      applyTileLayer(mapInstanceRef.current, mapType);
    }
  }, [mapType]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] rounded-3xl overflow-hidden shadow-soft border border-slate-200 dark:border-slate-800">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Filter Chips */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex gap-1.5 p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/80 pointer-events-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setActiveFilter('ustalar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'ustalar'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            👷 Ustalar ({specialists.length})
          </button>
          <button
            onClick={() => setActiveFilter('ishlar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'ishlar'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            💼 Ishlar ({jobs.length})
          </button>
        </div>

        {/* Real GPS locate button */}
        <button
          onClick={handleLocateMe}
          disabled={isGpsLoading}
          className="p-2.5 sm:px-3.5 sm:py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md hover:bg-brand-50 dark:hover:bg-slate-800 text-brand-600 dark:text-brand-400 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/80 pointer-events-auto flex items-center gap-1.5 transition-all active:scale-95"
          title="Mening jonli GPS lokatsiyam"
        >
          {isGpsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
          ) : (
            <LocateFixed className="w-4 h-4 text-brand-600" />
          )}
          <span className="text-xs font-extrabold hidden sm:inline">Mening GPS</span>
        </button>
      </div>

      {/* GPS Notice notification */}
      {gpsNotice && (
        <div className="absolute top-16 left-4 right-4 z-20 flex justify-center pointer-events-none animate-slide-down">
          <div className="bg-slate-900/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-slate-700">
            📍 {gpsNotice}
          </div>
        </div>
      )}

      {/* Floating Radius Quick Selector */}
      <div className="absolute top-16 left-4 z-20 pointer-events-auto hidden md:flex flex-col gap-1 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5">Radius</span>
        {[5, 10, 20, 50, 100].map((r) => (
          <button
            key={r}
            onClick={() => actions.setServiceRadiusKm(r)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              serviceRadiusKm === r
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {r} km
          </button>
        ))}
      </div>

      {/* Floating Map Layer Switcher: Google, Satellite, OSM */}
      <div className="absolute top-16 right-4 z-20 pointer-events-auto flex items-center gap-1 p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/80">
        <button
          onClick={() => setMapType('google_streets')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            mapType === 'google_streets'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Google Ko'chalar xaritasi"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-extrabold hidden sm:inline">Google</span>
        </button>

        <button
          onClick={() => setMapType('google_satellite')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            mapType === 'google_satellite'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Google Sun'iy yo'ldosh (Gibrid)"
        >
          <Satellite className="w-3.5 h-3.5" />
          <span className="text-[11px] font-extrabold hidden sm:inline">Yo'ldosh</span>
        </button>

        <button
          onClick={() => setMapType('osm')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            mapType === 'osm'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="OpenStreetMap ochiq xaritasi"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[11px] font-extrabold hidden sm:inline">OSM</span>
        </button>
      </div>

      {/* Specialist Popup Card at bottom */}
      {selectedSpec && (
        <div className="absolute bottom-4 left-4 right-4 z-30 animate-slide-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedSpec.avatar}
                  alt={selectedSpec.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {selectedSpec.name}
                    </h4>
                    {selectedSpec.verification?.identity && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 fill-brand-600 text-white" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">{selectedSpec.profession}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {selectedSpec.rating}
                    </span>
                    <span className="text-slate-400">({selectedSpec.reviewCount})</span>
                    <span className="text-slate-500">• {formatDistance(selectedSpec.distanceKm)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpec(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onContact(selectedSpec)}
                className="py-2.5 px-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700"
              >
                Bog'lanish
              </button>
              <button
                onClick={() => onViewProfile(selectedSpec)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs hover:bg-slate-200"
              >
                Profilni ko'rish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Popup Card at bottom */}
      {selectedJob && (
        <div className="absolute bottom-4 left-4 right-4 z-30 animate-slide-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {selectedJob.category}
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base mt-1">
                  {selectedJob.title}
                </h4>
                <p className="text-xs text-slate-500 font-semibold">{selectedJob.companyName}</p>
                <p className="text-sm font-extrabold text-brand-600 mt-1">
                  {formatCurrency(selectedJob.salaryMin)} - {formatCurrency(selectedJob.salaryMax)}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onViewJob(selectedJob)}
                className="w-full py-2.5 px-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700"
              >
                E'lonni batafsil ko'rish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
