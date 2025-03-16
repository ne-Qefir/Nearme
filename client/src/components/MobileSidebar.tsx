import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, MapPin, User, MessageSquare, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';

export function MobileSidebar() {
  const { user, isMobileSidebarOpen, toggleMobileSidebar, logout } = useApp();
  
  const userInitials = user ? 
    `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}` 
    : 'U';

  return (
    <div 
      className={`fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">NearMe</h2>
          <button 
            onClick={toggleMobileSidebar}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
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
        </div>
      </div>
      
      <div className="p-4">
        <nav className="space-y-1">
          <a href="#" className="flex items-center py-2 px-3 rounded-md bg-gray-100 text-primary font-medium">
            <MapPin className="h-5 w-5 mr-2" /> People Nearby
          </a>
          <a href="#" className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100">
            <User className="h-5 w-5 mr-2" /> My Profile
          </a>
          <a href="#" className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100">
            <MessageSquare className="h-5 w-5 mr-2" /> Messages
          </a>
          <a href="#" className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100">
            <Bell className="h-5 w-5 mr-2" /> Notifications
          </a>
          <a href="#" className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100">
            <Settings className="h-5 w-5 mr-2" /> Settings
          </a>
          <a href="#" className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 mr-2" /> Help & Support
          </a>
        </nav>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button 
            onClick={logout}
            className="flex items-center py-2 px-3 rounded-md text-red-600 hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="h-5 w-5 mr-2" /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}
