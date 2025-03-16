import { users, type User, type InsertUser, type UpdateLocation, type UpdatePrivacy } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLocation(telegramId: string, location: UpdateLocation): Promise<User | undefined>;
  updateUserPrivacy(telegramId: string, privacy: UpdatePrivacy): Promise<User | undefined>;
  getNearbyUsers(telegramId: string): Promise<User[]>;
  updateLastActive(telegramId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      lastActive: new Date(),
      isLocationVisible: true,
      visibilityDistance: 1.0 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLocation(telegramId: string, location: UpdateLocation): Promise<User | undefined> {
    const user = await this.getUserByTelegramId(telegramId);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      latitude: location.latitude,
      longitude: location.longitude,
      lastActive: new Date()
    };

    this.users.set(user.id, updatedUser);
    return updatedUser;
  }

  async updateUserPrivacy(telegramId: string, privacy: UpdatePrivacy): Promise<User | undefined> {
    const user = await this.getUserByTelegramId(telegramId);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...privacy,
      lastActive: new Date()
    };

    this.users.set(user.id, updatedUser);
    return updatedUser;
  }

  async getNearbyUsers(telegramId: string): Promise<User[]> {
    const currentUser = await this.getUserByTelegramId(telegramId);
    if (!currentUser || !currentUser.latitude || !currentUser.longitude) {
      return [];
    }

    // Get only users who have shared their location and are within the visibility distance
    return Array.from(this.users.values()).filter(user => {
      if (!user.isLocationVisible || telegramId === user.telegramId) return false;
      if (!user.latitude || !user.longitude) return false;

      // Calculate distance using the Haversine formula
      const distance = this.calculateDistance(
        currentUser.latitude, 
        currentUser.longitude, 
        user.latitude, 
        user.longitude
      );

      // Filter based on both users' visibility settings (use the smaller of the two)
      const maxDistance = Math.min(
        currentUser.visibilityDistance || 1.0,
        user.visibilityDistance || 1.0
      );

      return distance <= maxDistance;
    });
  }

  async updateLastActive(telegramId: string): Promise<void> {
    const user = await this.getUserByTelegramId(telegramId);
    if (!user) return;

    const updatedUser: User = {
      ...user,
      lastActive: new Date()
    };

    this.users.set(user.id, updatedUser);
  }

  // Helper method to calculate distance between two coordinates in kilometers
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export const storage = new MemStorage();
