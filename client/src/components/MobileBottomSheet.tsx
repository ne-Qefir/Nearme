import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function MobileBottomSheet() {
  const { selectedUser, isBottomSheetOpen, toggleBottomSheet } = useApp();
  
  if (!selectedUser) return null;
  
  const userInitials = `${selectedUser.firstName.charAt(0)}${selectedUser.lastName ? selectedUser.lastName.charAt(0) : ''}`;
  const isActive = new Date(selectedUser.lastActive).getTime() > Date.now() - 5 * 60 * 1000;
  
  // Calculate distance in meters (this would normally come from the API)
  const distanceText = selectedUser.latitude && selectedUser.longitude ? 
    `${Math.round(selectedUser.visibilityDistance! * 1000)}m away` : 
    'Unknown distance';
  
  // Format last active time
  const lastActiveText = isActive ? 
    'Active now' : 
    `${formatDistanceToNow(new Date(selectedUser.lastActive))} ago`;
  
  // Handle Telegram chat link
  const handleOpenTelegramChat = () => {
    const telegramUsername = selectedUser.username.startsWith('@') ? 
      selectedUser.username.substring(1) : 
      selectedUser.username;
    
    window.open(`https://t.me/${telegramUsername}`, '_blank');
  };

  return (
    <div 
      className={`fixed md:hidden inset-x-0 bottom-0 bg-white shadow-lg rounded-t-xl z-40 transform transition-transform duration-300 ease-in-out ${
        isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div 
        className="w-16 h-1 bg-gray-300 rounded-full mx-auto my-3"
        onClick={() => toggleBottomSheet(false)}
      ></div>
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={selectedUser.photoUrl || undefined} 
              alt={selectedUser.firstName} 
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h3 className="text-lg font-semibold">
              {selectedUser.firstName} {selectedUser.lastName || ''}
            </h3>
            <p className="text-sm text-gray-600">@{selectedUser.username}</p>
            <p className="text-sm font-medium text-green-600">{distanceText}</p>
          </div>
          <button 
            onClick={handleOpenTelegramChat}
            className="ml-auto bg-primary hover:bg-primary/90 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm font-medium">{lastActiveText}</p>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
              <MapPin className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm font-medium">
                {Math.round((selectedUser.visibilityDistance || 1) * 1000)} meters away
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleOpenTelegramChat}
            className="w-full py-6"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
