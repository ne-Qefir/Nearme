import { Map, User, MessageSquare, Settings } from 'lucide-react';

export function MobileNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-30 md:hidden">
      <div className="flex justify-around">
        <button className="flex-1 py-3 text-center text-primary flex flex-col items-center">
          <Map className="h-6 w-6" />
          <span className="text-xs">Map</span>
        </button>
        <button className="flex-1 py-3 text-center text-gray-600 flex flex-col items-center">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>
        <button className="flex-1 py-3 text-center text-gray-600 flex flex-col items-center">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs">Messages</span>
        </button>
        <button className="flex-1 py-3 text-center text-gray-600 flex flex-col items-center">
          <Settings className="h-6 w-6" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
}
