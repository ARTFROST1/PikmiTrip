import { Express, Request, Response, NextFunction } from "express";
import { supabase, supabaseAdmin } from "./supabase";
import { storage } from "./storage";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function setupSupabaseAuth(app: Express) {
  // Middleware to validate Supabase JWT tokens
  const authenticateSupabase = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        req.user = null;
        return next();
      }

      // Get or create user in our database
      let dbUser = await storage.getUserByEmail(user.email!);
      
      if (!dbUser) {
        // Create user in our database
        dbUser = await storage.createUser({
          id: user.id,
          email: user.email!,
          firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
          lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          profileImageUrl: user.user_metadata?.avatar_url || '',
          authProvider: user.app_metadata?.provider || 'email',
          googleId: user.app_metadata?.provider === 'google' ? user.user_metadata?.provider_id : undefined,
          userType: 'traveler', // Default to traveler
        });
      }

      req.user = dbUser;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      req.user = null;
      next();
    }
  };

  // Apply authentication middleware to all routes but skip some public routes
  app.use((req, res, next) => {
    // Skip auth for public routes
    const publicRoutes = ['/api/tours', '/api/auth/register', '/api/auth/login', '/api/auth/google', '/api/auth/google/callback', '/api/placeholder'];
    const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));
    
    if (isPublicRoute) {
      req.user = null;
      return next();
    }
    
    // Apply authentication for protected routes
    authenticateSupabase(req, res, next);
  });

  // Registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, userType } = req.body;

      if (!supabase) {
        return res.status(500).json({ message: "Supabase not configured" });
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType || 'traveler'
          }
        }
      });

      if (authError) {
        return res.status(400).json({ message: authError.message });
      }

      // Create user in our database
      const dbUser = await storage.createUser({
        id: authData.user!.id,
        email,
        firstName,
        lastName,
        userType: userType || 'traveler',
        authProvider: 'email',
      });

      res.status(201).json({
        user: dbUser,
        session: authData.session
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!supabase) {
        return res.status(500).json({ message: "Supabase not configured" });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({
        user: data.user,
        session: data.session
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Google OAuth login
  app.get("/api/auth/google", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ message: "Supabase not configured" });
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.REPLIT_DOMAINS
            ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/api/auth/google/callback`
            : "https://7c6573ea-0a38-45e2-926e-de6bdf1eedb5-00-3qa170cgl6eju.riker.replit.dev/api/auth/google/callback"
        }
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.redirect(data.url);
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.status(500).json({ message: "Google OAuth failed" });
    }
  });

  // Google OAuth callback
  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const { code } = req.query;

      if (!code) {
        return res.redirect('/auth?error=google');
      }

      // Handle the OAuth callback - Supabase will handle the token exchange
      res.redirect('/');
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('/auth?error=google');
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ message: "Supabase not configured" });
      }

      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        await supabase.auth.signOut();
      }

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  // Protected route middleware (removed - let individual routes handle their own auth)
  // Routes will handle their own authentication using the isAuthenticated middleware
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};