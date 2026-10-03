/**
 * Calculate distance between two GPS coordinates using Haversine formula (in kilometers)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance in a human readable Uzbek format
 */
export function formatDistance(distanceKm: number | undefined): string {
  if (distanceKm === undefined || isNaN(distanceKm)) return '';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Format currency in Uzbek So'm
 */
export function formatCurrency(amount: number): string {
  if (!amount && amount !== 0) return "0 so'm";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
}

/**
 * Get device GPS coordinates via browser Geolocation API
 */
export async function getCurrentGpsPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Brauzeringizda Geolocation qo'llab-quvvatlanmaydi"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Live OpenStreetMap Nominatim reverse geocoding (100% free, real street & city lookup)
 */
export async function reverseGeocodeOsm(lat: number, lng: number): Promise<{
  displayName: string;
  city: string;
  district: string;
  road: string;
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=uz,ru,en`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'IshTop-Marketplace-Uzbekistan/1.0'
        }
      }
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    const addr = data.address || {};

    const city = addr.city || addr.town || addr.county || addr.state || "Navoiy shahri";
    const district = addr.suburb || addr.neighbourhood || addr.quarter || addr.district || "Markaz";
    const road = addr.road || addr.street || "";

    return {
      displayName: data.display_name || `${city}, ${district}`,
      city,
      district,
      road
    };
  } catch (e) {
    console.warn("Reverse geocode fallback:", e);
    return {
      displayName: "Aniqlangan joylashuv",
      city: "Navoiy shahri",
      district: "Markaz",
      road: ""
    };
  }
}
