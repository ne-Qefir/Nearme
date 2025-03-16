import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Search } from 'lucide-react';

export function Header() {
  const { user, toggleMobileSidebar } = useApp();
  
  const userInitials = user ? 
    `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}` 
    : 'U';

  return (
    <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-90 p-4 z-20 md:hidden flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={toggleMobileSidebar} 
          className="mr-3 hover:bg-gray-100 p-1 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">NearMe</h1>
      </div>
      <div className="flex items-center">
        <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center mr-3">
          <Search className="h-4 w-4" />
        </button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.photoUrl || undefined} alt={user?.firstName || "User"} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
