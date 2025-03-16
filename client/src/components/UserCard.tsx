import { User } from '@shared/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const userInitials = `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`;
  const isActive = new Date(user.lastActive).getTime() > Date.now() - 5 * 60 * 1000; // Active in last 5 minutes
  
  // Calculate distance in meters (this would normally come from the API)
  const distanceText = user.latitude && user.longitude ? 
    `${Math.round(user.visibilityDistance! * 1000)}m away` : 
    'Unknown distance';
  
  // Format last active time
  const lastActiveText = isActive ? 
    'Active now' : 
    `${formatDistanceToNow(new Date(user.lastActive))} ago`;

  return (
    <div 
      className="bg-white hover:bg-gray-100 rounded-lg p-3 mb-3 cursor-pointer transition-all flex items-center"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.photoUrl || undefined} alt={user.firstName} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${isActive ? 'bg-green-500' : 'bg-gray-300'} rounded-full border-2 border-white`}></div>
      </div>
      <div className="ml-3">
        <h4 className="font-medium">{user.firstName} {user.lastName || ''}</h4>
        <p className="text-sm text-gray-600">{distanceText} • {lastActiveText}</p>
      </div>
    </div>
  );
}
