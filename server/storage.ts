import { users, tours, bookings, reviews, type User, type InsertUser, type Tour, type InsertTour, type Booking, type InsertBooking, type Review, type InsertReview } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  
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
  createReview(review: InsertReview): Promise<Review>;
  updateTourRating(tourId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tours: Map<number, Tour>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private currentUserId: number;
  private currentTourId: number;
  private currentBookingId: number;
  private currentReviewId: number;

  constructor() {
    this.users = new Map();
    this.tours = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.currentUserId = 1;
    this.currentTourId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Tours
  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async getAllTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getToursByCategory(category: string): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(
      (tour) => tour.category === category,
    );
  }

  async getHotTours(): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(
      (tour) => tour.isHot,
    );
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const id = this.currentTourId++;
    const tour: Tour = { 
      ...insertTour, 
      id, 
      rating: 40, // Default rating 
      createdAt: new Date(),
      tags: insertTour.tags || null,
      isHot: insertTour.isHot || false
    };
    this.tours.set(id, tour);
    return tour;
  }

  async updateTour(id: number, tourUpdate: Partial<InsertTour>): Promise<Tour | undefined> {
    const existingTour = this.tours.get(id);
    if (!existingTour) return undefined;

    const updatedTour = { ...existingTour, ...tourUpdate };
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
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.tourId === tourId,
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      status: "pending",
      createdAt: new Date(),
      notes: insertBooking.notes || null
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const existingBooking = this.bookings.get(id);
    if (!existingBooking) return undefined;

    const updatedBooking = { ...existingBooking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByTour(tourId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.tourId === tourId,
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    
    // Update tour rating based on reviews
    await this.updateTourRating(insertReview.tourId);
    
    return review;
  }

  async updateTourRating(tourId: number): Promise<void> {
    const reviews = await this.getReviewsByTour(tourId);
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = Math.round((totalRating / reviews.length) * 10); // Convert to 0-50 scale
    
    const tour = this.tours.get(tourId);
    if (tour) {
      tour.rating = avgRating;
      this.tours.set(tourId, tour);
    }
  }
}

export const storage = new MemStorage();
