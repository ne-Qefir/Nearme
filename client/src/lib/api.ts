import { apiRequest } from "@/lib/queryClient";
import { User, UpdateLocation, UpdatePrivacy } from "@shared/schema";

// Update user location
export async function updateUserLocation(
  telegramId: string,
  location: UpdateLocation
): Promise<User> {
  const response = await apiRequest(
    "POST",
    `/api/users/${telegramId}/location`,
    location
  );
  return response.json();
}

// Update user privacy settings
export async function updateUserPrivacy(
  telegramId: string,
  privacy: UpdatePrivacy
): Promise<User> {
  const response = await apiRequest(
    "POST",
    `/api/users/${telegramId}/privacy`,
    privacy
  );
  return response.json();
}

// Get nearby users
export async function getNearbyUsers(telegramId: string): Promise<User[]> {
  const response = await apiRequest("GET", `/api/users/${telegramId}/nearby`);
  return response.json();
}

// Get user profile
export async function getUserProfile(telegramId: string): Promise<User> {
  const response = await apiRequest("GET", `/api/users/${telegramId}`);
  return response.json();
}
