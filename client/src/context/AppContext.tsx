import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/hooks/useAuth";
import { updateUserLocation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  user: User | null;
  nearbyUsers: User[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isLocationPermissionGranted: boolean;
  locationError: string | null;
  selectedUser: User | null;
  isMobileSidebarOpen: boolean;
  isBottomSheetOpen: boolean;
  authenticate: (telegramUserData: any) => Promise<void>;
  logout: () => void;
  requestLocationPermission: () => Promise<boolean>;
  selectUser: (user: User | null) => void;
  toggleMobileSidebar: () => void;
  toggleBottomSheet: (isOpen?: boolean) => void;
  updatePrivacySettings: (isVisible: boolean, distance: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { toast } = useToast();

  const { 
    user, 
    isLoading: authLoading, 
    isAuthenticated,
    authenticate,
    logout,
    updatePrivacySettings
  } = useAuth();

  const { 
    coords, 
    error: locationError, 
    isGranted: isLocationPermissionGranted,
    requestPermission,
    isLoading: locationLoading
  } = useGeolocation();

  const isLoading = authLoading || locationLoading;

  // Update user location when coordinates change
  useEffect(() => {
    if (isAuthenticated && user && coords && isLocationPermissionGranted) {
      updateUserLocation(user.telegramId, {
        latitude: coords.latitude,
        longitude: coords.longitude
      }).catch(error => {
        toast({
          title: "Error updating location",
          description: error.message,
          variant: "destructive"
        });
      });
    }
  }, [isAuthenticated, user, coords, isLocationPermissionGranted]);

  const requestLocationPermission = async () => {
    return await requestPermission();
  };

  const selectUser = (user: User | null) => {
    setSelectedUser(user);
    if (user) {
      setIsBottomSheetOpen(true);
    } else {
      setIsBottomSheetOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleBottomSheet = (isOpen?: boolean) => {
    setIsBottomSheetOpen(isOpen !== undefined ? isOpen : !isBottomSheetOpen);
  };

  return (
    <AppContext.Provider value={{
      user,
      nearbyUsers,
      isLoading,
      isAuthenticated,
      isLocationPermissionGranted,
      locationError,
      selectedUser,
      isMobileSidebarOpen,
      isBottomSheetOpen,
      authenticate,
      logout,
      requestLocationPermission,
      selectUser,
      toggleMobileSidebar,
      toggleBottomSheet,
      updatePrivacySettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
