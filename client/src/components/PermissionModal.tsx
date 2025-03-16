import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { MapPin } from 'lucide-react';

export function PermissionModal() {
  const { requestLocationPermission } = useApp();
  
  const handleAllowLocation = async () => {
    await requestLocationPermission();
  };
  
  const handleDenyLocation = () => {
    // Currently we just show a browser dialog again later
    // In a real app, we might want to handle this differently
    alert("Location access is required to use this app");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mx-auto mb-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Location Access Required</h2>
          <p className="text-neutral-600 mb-6 text-center">
            We need your location to show people nearby. Your location will only be shared when you're using the app.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleAllowLocation} 
              className="w-full py-6 bg-[#28A745] hover:bg-[#28A745]/90"
            >
              Allow Location Access
            </Button>
            <Button 
              onClick={handleDenyLocation} 
              variant="outline" 
              className="w-full py-6"
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
