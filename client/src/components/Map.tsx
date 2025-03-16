import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '@/context/AppContext';
import { User } from '@shared/schema';
import { MapPin, Plus, Minus, Locate } from 'lucide-react';

interface MapProps {
  nearbyUsers: User[];
}

export function Map({ nearbyUsers }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const { user, selectUser, coords } = useApp();
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialPosition: [number, number] = coords 
      ? [coords.latitude, coords.longitude] 
      : [51.505, -0.09]; // Default position until we get user's location

    mapRef.current = L.map(mapContainerRef.current, {
      center: initialPosition,
      zoom: 15,
      zoomControl: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    setIsMapInitialized(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map center when user coords change
  useEffect(() => {
    if (!mapRef.current || !coords) return;
    
    // Create or update current user marker
    if (user) {
      updateUserMarker(user, [coords.latitude, coords.longitude], true);
    }
    
    // Center map on user location
    mapRef.current.setView([coords.latitude, coords.longitude], mapRef.current.getZoom());
  }, [coords, user]);

  // Update markers for nearby users
  useEffect(() => {
    if (!mapRef.current || !isMapInitialized) return;
    
    // Keep track of current markers to remove stale ones
    const currentMarkerIds = new Set<string>();
    
    // Update markers for all nearby users
    nearbyUsers.forEach(nearbyUser => {
      if (nearbyUser.latitude && nearbyUser.longitude) {
        updateUserMarker(
          nearbyUser, 
          [nearbyUser.latitude, nearbyUser.longitude],
          false
        );
        currentMarkerIds.add(nearbyUser.telegramId);
      }
    });
    
    // Remove markers for users that are no longer nearby
    Object.keys(markersRef.current).forEach(markerId => {
      if (markerId !== user?.telegramId && !currentMarkerIds.has(markerId)) {
        if (markersRef.current[markerId]) {
          markersRef.current[markerId].remove();
          delete markersRef.current[markerId];
        }
      }
    });
  }, [nearbyUsers, isMapInitialized]);

  // Function to create or update a user marker
  const updateUserMarker = (
    markerUser: User, 
    position: [number, number], 
    isCurrentUser: boolean
  ) => {
    if (!mapRef.current) return;

    // Create marker HTML element
    const markerElement = document.createElement('div');
    markerElement.className = `flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white shadow-lg ${isCurrentUser ? 'border-4 border-primary animate-pulse' : ''}`;
    
    // Create avatar image
    const avatarImg = document.createElement('img');
    avatarImg.className = 'w-[40px] h-[40px] rounded-full object-cover';
    avatarImg.src = markerUser.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(markerUser.firstName);
    avatarImg.alt = markerUser.firstName;
    markerElement.appendChild(avatarImg);

    // Create custom icon
    const icon = L.divIcon({
      html: markerElement,
      className: '',
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });

    // Update existing marker or create new one
    if (markersRef.current[markerUser.telegramId]) {
      markersRef.current[markerUser.telegramId].setLatLng(position);
      markersRef.current[markerUser.telegramId].setIcon(icon);
    } else {
      const marker = L.marker(position, { icon }).addTo(mapRef.current);
      
      // Add click handler for nearby user markers
      if (!isCurrentUser) {
        marker.on('click', () => {
          selectUser(markerUser);
        });
      }
      
      markersRef.current[markerUser.telegramId] = marker;
    }
  };

  // Map control handlers
  const handleLocateMe = () => {
    if (!mapRef.current || !coords) return;
    mapRef.current.setView([coords.latitude, coords.longitude], 16);
  };

  const handleZoomIn = () => {
    if (!mapRef.current) return;
    mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    mapRef.current.zoomOut();
  };

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapContainerRef} 
        className="h-full w-full bg-neutral-100"
      />
      
      {/* Map Controls */}
      <div className="absolute bottom-24 right-4 flex flex-col space-y-2 md:bottom-6 z-20">
        <button 
          onClick={handleLocateMe}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <Locate className="h-5 w-5 text-primary" />
        </button>
        <button 
          onClick={handleZoomIn}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
