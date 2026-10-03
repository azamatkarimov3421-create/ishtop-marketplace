import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useStore } from '../../lib/store';
import { SpecialistProfile, Job } from '../../types';
import { Star, MapPin, Car, CheckCircle2, X } from 'lucide-react';
import { formatDistance, formatCurrency } from '../../lib/geo';

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
  const { selectedCity, serviceRadiusKm, specialists, jobs } = useStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'ustalar' | 'ishlar'>('all');
  const [selectedSpec, setSelectedSpec] = useState<SpecialistProfile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCity.lat, selectedCity.lng],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView([selectedCity.lat, selectedCity.lng], 12);
    }

    const map = mapInstanceRef.current;

    // Draw user location & radius circle
    if (circleRef.current) {
      circleRef.current.remove();
    }

    const circleRadiusMeters = (serviceRadiusKm === 999 ? 100 : serviceRadiusKm) * 1000;
    circleRef.current = L.circle([selectedCity.lat, selectedCity.lng], {
      radius: circleRadiusMeters,
      color: '#2563eb',
      fillColor: '#3b82f6',
      fillOpacity: 0.12,
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

  }, [selectedCity, serviceRadiusKm, specialists, jobs, activeFilter]);

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
