import { eq, and } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  tours,
  bookings,
  reviews,
  favorites,
  type User,
  type InsertUser,
  type Tour,
  type InsertTour,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Favorite,
  type InsertFavorite
} from "@shared/schema";

export interface IStorage {
  // Users (for multiple auth providers) - using string IDs for Replit Auth compatibility
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Tours
  getTour(id: number): Promise<Tour | undefined>;
  getAllTours(): Promise<Tour[]>;
  getToursByCategory(category: string): Promise<Tour[]>;
  getHotTours(): Promise<Tour[]>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined>;
  deleteTour(id: number): Promise<boolean>;
  
  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByTour(tourId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByTour(tourId: number): Promise<Review[]>;
  createReview(review: InsertReview, userId: string): Promise<Review>;
  updateTourRating(tourId: number): Promise<void>;
  
  // Favorites
  getUserFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, tourId: number): Promise<Favorite>;
  removeFavorite(userId: string, tourId: number): Promise<boolean>;
  isFavorite(userId: string, tourId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations - using string IDs for Replit Auth compatibility
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...userUpdate, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Tour operations
  async getTour(id: number): Promise<Tour | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    return tour;
  }

  async getAllTours(): Promise<Tour[]> {
    return await db.select().from(tours);
  }

  async getToursByCategory(category: string): Promise<Tour[]> {
    return await db.select().from(tours).where(eq(tours.category, category));
  }

  async getHotTours(): Promise<Tour[]> {
    return await db.select().from(tours).where(eq(tours.isHot, true));
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const [tour] = await db.insert(tours).values([insertTour]).returning();
    return tour;
  }

  async updateTour(id: number, tourUpdate: Partial<InsertTour>): Promise<Tour | undefined> {
    const [tour] = await db
      .update(tours)
      .set(tourUpdate)
      .where(eq(tours.id, id))
      .returning();
    return tour;
  }

  async deleteTour(id: number): Promise<boolean> {
    const result = await db.delete(tours).where(eq(tours.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBookingsByTour(tourId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.tourId, tourId));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByTour(tourId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.tourId, tourId));
  }

  async createReview(insertReview: InsertReview, userId: string): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values({ ...insertReview, userId })
      .returning();
    
    // Update tour rating
    await this.updateTourRating(insertReview.tourId);
    
    return review;
  }

  async updateTourRating(tourId: number): Promise<void> {
    const tourReviews = await this.getReviewsByTour(tourId);
    if (tourReviews.length > 0) {
      const averageRating = tourReviews.reduce((sum, review) => sum + review.rating, 0) / tourReviews.length;
      await db
        .update(tours)
        .set({ rating: Math.round(averageRating * 10) }) // Store as integer * 10
        .where(eq(tours.id, tourId));
    }
  }

  // Favorite operations
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async addFavorite(userId: string, tourId: number): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({ userId, tourId })
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, tourId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.tourId, tourId)));
    return (result.rowCount || 0) > 0;
  }

  async isFavorite(userId: string, tourId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.tourId, tourId)));
    return !!favorite;
  }
}

export const storage = new DatabaseStorage();