import { users, tours, bookings, reviews, favorites, type User, type UpsertUser, type Tour, type InsertTour, type Booking, type InsertBooking, type Review, type InsertReview, type Favorite, type InsertFavorite } from "@shared/schema";

export interface IStorage {
  // Users (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tours: Map<number, Tour>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private favorites: Map<string, Favorite>;
  private currentTourId: number;
  private currentBookingId: number;
  private currentReviewId: number;
  private currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.tours = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.favorites = new Map();
    this.currentTourId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    this.currentFavoriteId = 1;
    this.initializeSampleTours();
  }

  private initializeSampleTours() {
    const sampleTours = [
      {
        id: this.currentTourId++,
        title: "Новогодняя Москва",
        description: "Волшебная новогодняя атмосфера столицы",
        location: "Москва",
        duration: "2-3 дня",
        price: 15000,
        maxPeople: 20,
        imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
        program: "День 1: Прибытие и экскурсия по центру\nДень 2: Красная площадь и Кремль\nДень 3: Третьяковская галерея",
        rating: 45,
        category: "Новогодние",
        tags: null,
        included: null,
        excluded: null,
        route: null,
        isHot: true,
        agencyId: null,
        createdAt: new Date(),
      },
      {
        id: this.currentTourId++,
        title: "Карелия: озера и водопады",
        description: "Путешествие по красивейшим местам Карелии",
        location: "Карелия",
        duration: "выходные",
        price: 12000,
        maxPeople: 15,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        program: "День 1: Петрозаводск - Кивач\nДень 2: Кижи и деревянные церкви\nДень 3: Рыбалка и отдых",
        rating: 48,
        category: "Природа",
        tags: null,
        included: null,
        excluded: null,
        route: null,
        isHot: true,
        agencyId: null,
        createdAt: new Date(),
      },
      {
        id: this.currentTourId++,
        title: "Золотое кольцо России",
        description: "Классический маршрут по древним городам",
        location: "Владимир, Суздаль",
        duration: "3-4 дня",
        price: 18000,
        maxPeople: 25,
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
        program: "День 1: Владимир - Успенский собор\nДень 2: Суздаль - музей деревянного зодчества\nДень 3: Боголюбово",
        rating: 46,
        category: "История",
        tags: null,
        included: null,
        excluded: null,
        route: null,
        isHot: false,
        agencyId: null,
        createdAt: new Date(),
      }
    ];

    sampleTours.forEach(tour => {
      this.tours.set(tour.id, tour);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      id: userData.id,
      username: userData.username || null,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      userType: userData.userType || "traveler",
      stripeCustomerId: userData.stripeCustomerId || null,
      stripeSubscriptionId: userData.stripeSubscriptionId || null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Tours
  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async getAllTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getToursByCategory(category: string): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.category === category);
  }

  async getHotTours(): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.isHot);
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const tour: Tour = { 
      id: this.currentTourId++,
      ...insertTour,
      rating: 0,
      agencyId: null,
      tags: insertTour.tags || null,
      included: insertTour.included || null,
      excluded: insertTour.excluded || null,
      route: insertTour.route || null,
      isHot: insertTour.isHot || false,
      createdAt: new Date(),
    };
    this.tours.set(tour.id, tour);
    return tour;
  }

  async updateTour(id: number, tourUpdate: Partial<InsertTour>): Promise<Tour | undefined> {
    const tour = this.tours.get(id);
    if (!tour) return undefined;
    
    const updatedTour = { ...tour, ...tourUpdate };
    this.tours.set(id, updatedTour);
    return updatedTour;
  }

  async deleteTour(id: number): Promise<boolean> {
    return this.tours.delete(id);
  }

  // Bookings
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
    const booking: Booking = { 
      id: this.currentBookingId++,
      ...insertBooking,
      userId: null,
      status: "pending",
      notes: insertBooking.notes || null,
      paymentIntentId: null,
      createdAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    booking.status = status;
    this.bookings.set(id, booking);
    return booking;
  }

  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByTour(tourId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.tourId === tourId);
  }

  async createReview(insertReview: InsertReview, userId: string): Promise<Review> {
    const review: Review = { 
      id: this.currentReviewId++,
      ...insertReview,
      userId: userId,
      createdAt: new Date(),
    };
    this.reviews.set(review.id, review);
    
    // Update tour rating
    await this.updateTourRating(insertReview.tourId);
    
    return review;
  }

  async updateTourRating(tourId: number): Promise<void> {
    const reviewList = await this.getReviewsByTour(tourId);
    const tour = this.tours.get(tourId);
    
    if (tour && reviewList.length > 0) {
      const averageRating = reviewList.reduce((sum, review) => sum + review.rating, 0) / reviewList.length;
      tour.rating = Math.round(averageRating * 10); // Store as integer * 10
      this.tours.set(tourId, tour);
    }
  }

  // Favorites
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }

  async addFavorite(userId: string, tourId: number): Promise<Favorite> {
    const favorite: Favorite = {
      id: this.currentFavoriteId++,
      userId: userId,
      tourId: tourId,
      createdAt: new Date(),
    };
    this.favorites.set(`${userId}-${tourId}`, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, tourId: number): Promise<boolean> {
    return this.favorites.delete(`${userId}-${tourId}`);
  }

  async isFavorite(userId: string, tourId: number): Promise<boolean> {
    return this.favorites.has(`${userId}-${tourId}`);
  }
}

// Import database dependencies conditionally
import { db } from './db';
import { eq, and } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // Users (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  // Tours
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
    const [tour] = await db
      .insert(tours)
      .values({
        ...insertTour,
        rating: 0,
        agencyId: null,
        tags: insertTour.tags || null,
        included: insertTour.included || null,
        excluded: insertTour.excluded || null,
        route: insertTour.route || null,
        isHot: insertTour.isHot || false,
      })
      .returning();
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

  // Bookings
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
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        userId: null,
        status: "pending",
        notes: insertBooking.notes || null,
        paymentIntentId: null,
      })
      .returning();
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

  // Reviews
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
      .values({
        ...insertReview,
        userId: userId,
      })
      .returning();
    
    // Update tour rating
    await this.updateTourRating(insertReview.tourId);
    
    return review;
  }

  async updateTourRating(tourId: number): Promise<void> {
    const reviewList = await this.getReviewsByTour(tourId);
    
    if (reviewList.length > 0) {
      const averageRating = reviewList.reduce((sum, review) => sum + review.rating, 0) / reviewList.length;
      await db
        .update(tours)
        .set({ rating: Math.round(averageRating * 10) }) // Store as integer * 10
        .where(eq(tours.id, tourId));
    }
  }

  // Favorites
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async addFavorite(userId: string, tourId: number): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({
        userId: userId,
        tourId: tourId,
      })
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

// Use database storage in production, memory storage for development
export const storage = new DatabaseStorage();