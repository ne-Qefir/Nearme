import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if browser supports geolocation
  const isSupported = "geolocation" in navigator;

  // Request permission and get location
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
          },
          (err) => {
            let errorMessage = "Failed to get location";
            
            switch (err.code) {
              case err.PERMISSION_DENIED:
                errorMessage = "You denied the request for geolocation";
                break;
              case err.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable";
                break;
              case err.TIMEOUT:
                errorMessage = "The request to get location timed out";
                break;
            }
            
            reject(new Error(errorMessage));
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
      
      setCoords(position);
      setIsGranted(true);
      setError(null);
      startWatchingPosition();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setIsGranted(false);
      
      toast({
        title: "Location access failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Start watching position for updates
  const startWatchingPosition = () => {
    if (!isSupported) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (err) => {
        console.error("Error watching position:", err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  };

  // Check permission status on mount
  useEffect(() => {
    if (!isSupported) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    // Try to get permission status
    navigator.permissions?.query({ name: 'geolocation' })
      .then(result => {
        if (result.state === 'granted') {
          setIsGranted(true);
          requestPermission();
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        // If permissions API is not available, we'll check on request
        setIsLoading(false);
      });
  }, []);

  return {
    coords,
    error,
    isGranted,
    isSupported,
    isLoading,
    requestPermission
  };
}
