import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with multiple auth providers support
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // null for OAuth users
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: text("user_type").notNull().default("traveler"), // 'traveler' or 'agency'
  authProvider: text("auth_provider").notNull().default("email"), // 'email', 'google'
  googleId: varchar("google_id"), // Google OAuth ID
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  duration: text("duration").notNull(),
  price: integer("price").notNull(),
  maxPeople: integer("max_people").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").notNull().default(0), // Rating * 10 to avoid floats, calculated from reviews
  category: text("category").notNull(),
  tags: text("tags").array(),
  isHot: boolean("is_hot").default(false),
  // Extended tour information
  included: text("included").array(), // What's included in the tour
  excluded: text("excluded").array(), // What's not included
  program: text("program").notNull(), // Tour program/itinerary
  route: text("route"), // JSON string for Yandex Maps route
  agencyId: varchar("agency_id").references(() => users.id), // Reference to agency
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").references(() => tours.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  peopleCount: integer("people_count").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  totalPrice: integer("total_price").notNull(),
  paymentIntentId: varchar("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").references(() => tours.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tourId: integer("tour_id").references(() => tours.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Replit Auth compatible types
export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
  createdAt: true,
  rating: true, // Rating is calculated from reviews
  agencyId: true, // Will be set automatically
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  userId: true, // Will be set automatically
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
  userId: true, // Will be optional for guest bookings
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
  userId: true, // Will be set automatically
});

export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof tours.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
