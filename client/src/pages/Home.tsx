import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthModal } from '@/components/AuthModal';
import { PermissionModal } from '@/components/PermissionModal';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Map } from '@/components/Map';
import { Sidebar } from '@/components/Sidebar';
import { MobileSidebar } from '@/components/MobileSidebar';
import { MobileBottomSheet } from '@/components/MobileBottomSheet';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { User } from '@shared/schema';

export default function Home() {
  const { 
    user, 
    isAuthenticated, 
    isLocationPermissionGranted,
    isLoading,
    isMobileSidebarOpen,
    isBottomSheetOpen
  } = useApp();
  const [showMap, setShowMap] = useState(false);

  // Fetch nearby users if authenticated and location permission granted
  const { data: nearbyUsers = [] } = useQuery<User[]>({
    queryKey: [user?.telegramId ? `/api/users/${user.telegramId}/nearby` : null],
    enabled: !!user && isLocationPermissionGranted,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Determine what to show based on authentication and location permission state
  useEffect(() => {
    if (isAuthenticated && isLocationPermissionGranted) {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  }, [isAuthenticated, isLocationPermissionGranted]);

  // Show loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Authentication Modal - show if not authenticated */}
      {!isAuthenticated && <AuthModal />}
      
      {/* Location Permission Modal - show if authenticated but no location permission */}
      {isAuthenticated && !isLocationPermissionGranted && <PermissionModal />}
      
      {/* Main Content - show if authenticated and location permission granted */}
      {showMap && (
        <div className="flex h-full w-full">
          <Sidebar />
          
          <div 
            className={`relative ${
              isMobileSidebarOpen ? 'md:ml-[350px]' : 'ml-0'
            } flex-grow transition-all duration-300`}
          >
            <Header />
            <Map nearbyUsers={nearbyUsers} />
            <MobileNavigation />
          </div>
          
          <MobileSidebar />
          <MobileBottomSheet />
        </div>
      )}
    </div>
  );
}
