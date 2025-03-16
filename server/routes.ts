import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, updateLocationSchema, updatePrivacySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Telegram authentication verification
  app.post("/api/auth/telegram", async (req: Request, res: Response) => {
    try {
      // Validate user data from Telegram
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      let user = await storage.getUserByTelegramId(userData.telegramId);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await storage.createUser(userData);
      } else {
        // Update last active time
        await storage.updateLastActive(userData.telegramId);
      }
      
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Authentication failed" });
      }
    }
  });
  
  // Get user profile
  app.get("/api/users/:telegramId", async (req: Request, res: Response) => {
    try {
      const { telegramId } = req.params;
      const user = await storage.getUserByTelegramId(telegramId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });
  
  // Update user location
  app.post("/api/users/:telegramId/location", async (req: Request, res: Response) => {
    try {
      const { telegramId } = req.params;
      const locationData = updateLocationSchema.parse(req.body);
      
      const updatedUser = await storage.updateUserLocation(telegramId, locationData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update location" });
      }
    }
  });
  
  // Update privacy settings
  app.post("/api/users/:telegramId/privacy", async (req: Request, res: Response) => {
    try {
      const { telegramId } = req.params;
      const privacyData = updatePrivacySchema.parse(req.body);
      
      const updatedUser = await storage.updateUserPrivacy(telegramId, privacyData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update privacy settings" });
      }
    }
  });
  
  // Get nearby users
  app.get("/api/users/:telegramId/nearby", async (req: Request, res: Response) => {
    try {
      const { telegramId } = req.params;
      
      // Check if user exists
      const user = await storage.getUserByTelegramId(telegramId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update last active time
      await storage.updateLastActive(telegramId);
      
      // Get nearby users
      const nearbyUsers = await storage.getNearbyUsers(telegramId);
      
      res.status(200).json(nearbyUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby users" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
