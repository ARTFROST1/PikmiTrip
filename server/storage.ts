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
  type UpsertUser,
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
  // Users (for Replit Auth and Google OAuth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        userType: userData.userType || "traveler",
        stripeCustomerId: userData.stripeCustomerId || null,
        stripeSubscriptionId: userData.stripeSubscriptionId || null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
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

// Import db after interface definition to avoid circular imports
import { db } from "./db";

// Create a MemStorage class for development
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tours: Map<number, Tour> = new Map();
  private bookings: Map<number, Booking> = new Map();
  private reviews: Map<number, Review> = new Map();
  private favorites: Map<string, Favorite> = new Map();
  private currentTourId: number = 1;
  private currentBookingId: number = 1;
  private currentReviewId: number = 1;
  private currentFavoriteId: number = 1;

  constructor() {
    this.initializeSampleTours();
  }

  private initializeSampleTours() {
    const sampleTours: any[] = [
      {
        id: 1,
        title: "Поездка в Сочи",
        description: "Отличный отдых на черноморском побережье",
        location: "Сочи, Россия",
        duration: "3 дня",
        price: 15000,
        maxPeople: 20,
        imageUrl: "/api/placeholder/400/300",
        rating: 4.8,
        category: "nature",
        tags: ["beach", "mountains", "resort"],
        isHot: true,
        createdAt: new Date()
      },
      {
        id: 2,
        title: "Экскурсия по Санкт-Петербургу",
        description: "Культурная программа в северной столице",
        location: "Санкт-Петербург, Россия",
        duration: "2 дня",
        price: 12000,
        maxPeople: 15,
        imageUrl: "/api/placeholder/400/300",
        rating: 4.9,
        category: "culture",
        tags: ["museums", "architecture", "culture"],
        isHot: false,
        createdAt: new Date()
      }
    ];

    sampleTours.forEach(tour => {
      this.tours.set(tour.id, tour);
      this.currentTourId = Math.max(this.currentTourId, tour.id + 1);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const usersArray = Array.from(this.users.values());
    return usersArray.find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const usersArray = Array.from(this.users.values());
    return usersArray.find(user => user.googleId === googleId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: insertUser.id || `user_${Date.now()}`,
      email: insertUser.email,
      password: insertUser.password || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      userType: insertUser.userType || "traveler",
      authProvider: insertUser.authProvider || "local",
      googleId: insertUser.googleId || null,
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    if (existingUser) {
      const updatedUser = { ...existingUser, ...userData, updatedAt: new Date() };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      const newUser: User = {
        id: userData.id,
        email: userData.email || "",
        password: null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        userType: "traveler",
        authProvider: "replit",
        googleId: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }

  async updateUser(id: string, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userUpdate, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Tour operations
  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async getAllTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getToursByCategory(category: string): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => 
      tour.category === category
    );
  }

  async getHotTours(): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.isHot);
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const tour: any = {
      id: this.currentTourId++,
      ...insertTour,
      createdAt: new Date()
    };
    this.tours.set(tour.id, tour);
    return tour;
  }

  async updateTour(id: number, tourUpdate: Partial<InsertTour>): Promise<Tour | undefined> {
    const tour = this.tours.get(id);
    if (!tour) return undefined;

    const updatedTour = { ...tour, ...tourUpdate, updatedAt: new Date() };
    this.tours.set(id, updatedTour);
    return updatedTour;
  }

  async deleteTour(id: number): Promise<boolean> {
    return this.tours.delete(id);
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByTour(tourId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.tourId === tourId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const booking: any = {
      id: this.currentBookingId++,
      ...insertBooking,
      createdAt: new Date()
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = { ...booking, status, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByTour(tourId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.tourId === tourId);
  }

  async createReview(insertReview: InsertReview, userId: string): Promise<Review> {
    const review: any = {
      id: this.currentReviewId++,
      ...insertReview,
      userId,
      createdAt: new Date()
    };
    this.reviews.set(review.id, review);
    
    // Update tour rating
    await this.updateTourRating(insertReview.tourId);
    
    return review;
  }

  async updateTourRating(tourId: number): Promise<void> {
    const reviews = await this.getReviewsByTour(tourId);
    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const tour = this.tours.get(tourId);
    if (tour) {
      tour.rating = Math.round(avgRating * 10) / 10;
      this.tours.set(tourId, tour);
    }
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(favorite => favorite.userId === userId);
  }

  async addFavorite(userId: string, tourId: number): Promise<Favorite> {
    const favorite: any = {
      id: this.currentFavoriteId++,
      userId,
      tourId,
      createdAt: new Date()
    };
    this.favorites.set(`${userId}_${tourId}`, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, tourId: number): Promise<boolean> {
    return this.favorites.delete(`${userId}_${tourId}`);
  }

  async isFavorite(userId: string, tourId: number): Promise<boolean> {
    return this.favorites.has(`${userId}_${tourId}`);
  }
}

// Choose storage implementation based on environment
export const storage = db ? new DatabaseStorage() : new MemStorage();