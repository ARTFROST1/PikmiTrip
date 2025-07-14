import { users, tours, bookings, type User, type InsertUser, type Tour, type InsertTour, type Booking, type InsertBooking } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tours: Map<number, Tour>;
  private bookings: Map<number, Booking>;
  private currentUserId: number;
  private currentTourId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.tours = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentTourId = 1;
    this.currentBookingId = 1;
    
    // Initialize with sample tours
    this.initializeSampleTours();
  }

  private initializeSampleTours() {
    const sampleTours: InsertTour[] = [
      {
        title: "Карельские озера",
        description: "Прозрачные озера, девственные леса и свежий воздух. Идеальное место для восстановления сил и единения с природой.",
        location: "Петрозаводск",
        duration: "2 дня",
        price: 12500,
        maxPeople: 4,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        rating: 48,
        category: "nature",
        tags: ["природа", "озера", "карелия"],
        isHot: true,
      },
      {
        title: "Алтайские горы",
        description: "Величественные горы, альпийские луга и кристальные реки. Настоящее приключение для любителей активного отдыха.",
        location: "Горно-Алтайск",
        duration: "3 дня",
        price: 18900,
        maxPeople: 2,
        imageUrl: "https://images.unsplash.com/photo-1464822759844-d150b9f4c1a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        rating: 49,
        category: "mountains",
        tags: ["горы", "алтай", "активный отдых"],
        isHot: false,
      },
      {
        title: "Куршская коса",
        description: "Уникальный природный заповедник между морем и заливом. Песчаные дюны, сосновые леса и безграничное небо.",
        location: "Калининград",
        duration: "2 дня",
        price: 15200,
        maxPeople: 3,
        imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        rating: 47,
        category: "coastal",
        tags: ["море", "пляж", "дюны"],
        isHot: false,
      },
      {
        title: "Золотое кольцо",
        description: "Погружение в историю России. Древние храмы, золотые купола и дух старых русских городов.",
        location: "Владимир",
        duration: "2 дня",
        price: 11800,
        maxPeople: 4,
        imageUrl: "https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        rating: 46,
        category: "cultural",
        tags: ["культура", "история", "храмы"],
        isHot: false,
      },
      {
        title: "Камчатка",
        description: "Край вулканов, гейзеров и дикой природы. Настоящее приключение для смелых путешественников.",
        location: "Петропавловск-Камчатский",
        duration: "4 дня",
        price: 35900,
        maxPeople: 2,
        imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        rating: 49,
        category: "adventure",
        tags: ["вулканы", "гейзеры", "экстрим"],
        isHot: false,
      },
      {
        title: "Байкал",
        description: "Самое глубокое озеро мира. Прозрачная вода, целебный воздух и невероятные рассветы.",
        location: "Иркутск",
        duration: "3 дня",
        price: 22400,
        maxPeople: 2,
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        rating: 48,
        category: "nature",
        tags: ["озеро", "байкал", "природа"],
        isHot: false,
      },
    ];

    sampleTours.forEach(tour => {
      this.createTour(tour);
    });
  }

  // Users
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
}

export const storage = new MemStorage();
