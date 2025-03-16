import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Try to load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Authenticate with Telegram data
  const authMutation = useMutation({
    mutationFn: async (telegramUserData: any) => {
      const userData = {
        telegramId: telegramUserData.id.toString(),
        username: telegramUserData.username || "user" + telegramUserData.id,
        firstName: telegramUserData.first_name,
        lastName: telegramUserData.last_name || null,
        photoUrl: telegramUserData.photo_url || null
      };

      const response = await apiRequest("POST", "/api/auth/telegram", userData);
      return response.json();
    },
    onSuccess: (userData: User) => {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
    },
    onError: (error: Error) => {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update privacy settings
  const privacyMutation = useMutation({
    mutationFn: async (privacyData: { isVisible: boolean, distance: number }) => {
      if (!user) throw new Error("User not authenticated");
      
      const response = await apiRequest("POST", `/api/users/${user.telegramId}/privacy`, {
        isLocationVisible: privacyData.isVisible,
        visibilityDistance: privacyData.distance
      });
      
      return response.json();
    },
    onSuccess: (updatedUser: User) => {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast({ 
        title: "Privacy settings updated", 
        description: "Your privacy settings have been updated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update privacy settings",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Log out user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    queryClient.clear();
  };

  return {
    user,
    isLoading: authMutation.isPending || privacyMutation.isPending,
    isAuthenticated,
    authenticate: authMutation.mutate,
    logout,
    updatePrivacySettings: async (isVisible: boolean, distance: number) => {
      return privacyMutation.mutateAsync({ isVisible, distance });
    }
  };
}
