import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { UserCard } from './UserCard';

export function Sidebar() {
  const { user, nearbyUsers, selectUser, updatePrivacySettings } = useApp();
  const [isLocationVisible, setIsLocationVisible] = useState(user?.isLocationVisible ?? true);
  const [visibilityDistance, setVisibilityDistance] = useState(
    user?.visibilityDistance?.toString() || "1"
  );

  const userInitials = user ? 
    `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}` 
    : 'U';

  const handleLocationVisibilityChange = async (checked: boolean) => {
    setIsLocationVisible(checked);
    
    if (user) {
      await updatePrivacySettings(checked, parseFloat(visibilityDistance));
    }
  };

  const handleDistanceChange = async (value: string) => {
    setVisibilityDistance(value);
    
    if (user) {
      await updatePrivacySettings(isLocationVisible, parseFloat(value));
    }
  };

  return (
    <div className="hidden md:block bg-white w-[350px] h-full overflow-y-auto shadow-lg z-30">
      <div className="p-4 border-b border-gray-200">
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={user?.photoUrl || undefined} 
              alt={user?.firstName || "User"}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{user?.firstName} {user?.lastName || ''}</h3>
            <p className="text-sm text-gray-600">@{user?.username}</p>
          </div>
          <div className="ml-auto">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Nearby Users */}
      <div className="p-4">
        <h3 className="font-medium mb-3">People Nearby</h3>
        
        {nearbyUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No one nearby at the moment</p>
        ) : (
          nearbyUsers.map(nearbyUser => (
            <UserCard 
              key={nearbyUser.telegramId}
              user={nearbyUser}
              onClick={() => selectUser(nearbyUser)}
            />
          ))
        )}
        
        <div className="mt-6">
          <h3 className="font-medium mb-3">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-location">Share My Location</Label>
                <p className="text-sm text-gray-600">Allow others to see you on the map</p>
              </div>
              <Switch 
                id="share-location" 
                checked={isLocationVisible}
                onCheckedChange={handleLocationVisibilityChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visibility-distance">Visibility Distance</Label>
                <p className="text-sm text-gray-600">
                  Show people within {visibilityDistance} km
                </p>
              </div>
              <Select 
                value={visibilityDistance} 
                onValueChange={handleDistanceChange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5 km</SelectItem>
                  <SelectItem value="1">1 km</SelectItem>
                  <SelectItem value="2">2 km</SelectItem>
                  <SelectItem value="5">5 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
