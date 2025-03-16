import { pgTable, text, serial, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  photoUrl: text("photo_url"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  lastActive: timestamp("last_active").defaultNow(),
  isLocationVisible: boolean("is_location_visible").default(true),
  visibilityDistance: doublePrecision("visibility_distance").default(1.0),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastActive: true
});

export const updateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number()
});

export const updatePrivacySchema = z.object({
  isLocationVisible: z.boolean().optional(),
  visibilityDistance: z.number().optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpdateLocation = z.infer<typeof updateLocationSchema>;
export type UpdatePrivacy = z.infer<typeof updatePrivacySchema>;
