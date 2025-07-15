import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTourSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe if keys are available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tours
  app.get("/api/tours", async (req, res) => {
    try {
      const { category, hot } = req.query;
      
      if (hot === "true") {
        const tours = await storage.getHotTours();
        return res.json(tours);
      }
      
      if (category && category !== "all") {
        const tours = await storage.getToursByCategory(category as string);
        return res.json(tours);
      }
      
      const tours = await storage.getAllTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении туров" });
    }
  });

  app.get("/api/tours/:id", async (req, res) => {
    try {
      const tour = await storage.getTour(parseInt(req.params.id));
      if (!tour) {
        return res.status(404).json({ message: "Тур не найден" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении тура" });
    }
  });

  // Protected route for creating tours (agency only)
  app.post("/api/tours", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'agency') {
        return res.status(403).json({ message: "Только агентства могут создавать туры" });
      }
      
      const tourData = insertTourSchema.parse(req.body);
      const tour = await storage.createTour(tourData);
      res.status(201).json(tour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании тура" });
    }
  });

  // Protected route for updating tours (agency only)
  app.put("/api/tours/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'agency') {
        return res.status(403).json({ message: "Только агентства могут редактировать туры" });
      }
      
      const tourData = insertTourSchema.partial().parse(req.body);
      const tour = await storage.updateTour(parseInt(req.params.id), tourData);
      
      if (!tour) {
        return res.status(404).json({ message: "Тур не найден" });
      }
      
      res.json(tour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении тура" });
    }
  });

  // Protected route for deleting tours (agency only)
  app.delete("/api/tours/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.userType !== 'agency') {
        return res.status(403).json({ message: "Только агентства могут удалять туры" });
      }
      
      const success = await storage.deleteTour(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Тур не найден" });
      }
      
      res.json({ message: "Тур удален" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении тура" });
    }
  });

  // Bookings
  app.get("/api/bookings", async (req: any, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении бронирований" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании бронирования" });
    }
  });

  app.put("/api/bookings/:id", async (req: any, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(parseInt(req.params.id), status);
      
      if (!booking) {
        return res.status(404).json({ message: "Бронирование не найдено" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении бронирования" });
    }
  });

  // Reviews
  app.get("/api/tours/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByTour(parseInt(req.params.id));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении отзывов" });
    }
  });

  // Protected route for creating reviews (authenticated users only)
  app.post("/api/tours/:id/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse(req.body);
      
      const review = await storage.createReview({
        ...reviewData,
        tourId: parseInt(req.params.id),
      }, userId);
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании отзыва" });
    }
  });

  // Stripe payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "rub",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Ошибка при создании платежа: " + error.message });
      }
    });
  }

  // Favorites routes - protected
  app.get("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении избранного" });
    }
  });

  app.post("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tourId } = req.body;
      const favorite = await storage.addFavorite(userId, tourId);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при добавлении в избранное" });
    }
  });

  app.delete("/api/favorites/:tourId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tourId = parseInt(req.params.tourId);
      const success = await storage.removeFavorite(userId, tourId);
      if (!success) {
        return res.status(404).json({ message: "Избранное не найдено" });
      }
      res.json({ message: "Удалено из избранного" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении из избранного" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}