import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTourSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Skip auth setup for now to test basic functionality
  // await setupAuth(app);

  // Temporary auth route without authentication
  app.get('/api/auth/user', async (req: any, res) => {
    // Return null for now - user not authenticated
    res.json(null);
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

  app.post("/api/tours", async (req: any, res) => {
    try {
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

  app.put("/api/tours/:id", async (req: any, res) => {
    try {
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

  app.delete("/api/tours/:id", async (req: any, res) => {
    try {
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

  app.post("/api/tours/:id/reviews", async (req: any, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      const review = await storage.createReview({
        ...reviewData,
        tourId: parseInt(req.params.id),
      }, "anonymous-user");
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании отзыва" });
    }
  });

  // Favorites (temporarily disabled for testing)
  app.get("/api/favorites", async (req: any, res) => {
    res.json([]);
  });

  app.post("/api/favorites", async (req: any, res) => {
    res.json({ message: "Для работы с избранным необходимо войти в систему" });
  });

  app.delete("/api/favorites/:tourId", async (req: any, res) => {
    res.json({ message: "Для работы с избранным необходимо войти в систему" });
  });

  const httpServer = createServer(app);
  return httpServer;
}