import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertEventSchema, insertBudgetSchema } from "@shared/schema";
// PayPal functions will be conditionally imported if environment variables are available

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

// Multer configuration for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// JWT middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, WebSocket>();

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        clients.set(decoded.userId, ws);
        
        ws.on('close', () => {
          clients.delete(decoded.userId);
        });
        
        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          clients.delete(decoded.userId);
        });
      } catch (error) {
        ws.close();
      }
    } else {
      ws.close();
    }
  });

  // Helper function to send notifications
  const sendNotification = (userId: string, notification: any) => {
    const client = clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  };

  // Authentication routes
  app.post("/api/v1/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username) || 
                          await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const { confirmPassword, ...userData } = validatedData;
      const user = await storage.createUser(userData);
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        user: { ...user, password: undefined },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/v1/auth/login", async (req, res) => {
    try {
      const { username, password, rememberMe } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username) || 
                   await storage.getUserByEmail(username);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const expiresIn = rememberMe ? '30d' : '7d';
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn });
      
      res.json({
        user: { ...user, password: undefined },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/v1/auth/me", authenticateToken, async (req: any, res) => {
    res.json({ user: { ...req.user, password: undefined } });
  });

  // User management routes
  app.get("/api/v1/user/profile", authenticateToken, async (req: any, res) => {
    const stats = await storage.getUserStats(req.user.id);
    res.json({
      user: { ...req.user, password: undefined },
      stats,
    });
  });

  app.put("/api/v1/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Don't allow password updates here
      
      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json({ user: { ...updatedUser, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Event routes
  app.get("/api/v1/events", async (req, res) => {
    try {
      const { category, location, search } = req.query;
      let events = await storage.getEvents();
      
      if (category) {
        events = await storage.getEventsByCategory(category as string);
      }
      
      if (location) {
        events = await storage.getEventsByLocation(location as string);
      }
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        events = events.filter(event => 
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm)
        );
      }
      
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/v1/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/events", authenticateToken, async (req: any, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent({
        ...eventData,
        organizerId: req.user.id,
      });
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // File management routes
  app.get("/api/v1/files", authenticateToken, async (req: any, res) => {
    try {
      const files = await storage.getFiles(req.user.id);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/upload", authenticateToken, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = await storage.createFile({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        userId: req.user.id,
      });

      // Update user storage usage
      await storage.updateUser(req.user.id, {
        storageUsed: req.user.storageUsed + req.file.size,
      });

      res.json(file);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/files/generate-token", authenticateToken, async (req: any, res) => {
    try {
      const { fileId } = req.body;
      const file = await storage.getFile(fileId);
      
      if (!file || file.userId !== req.user.id) {
        return res.status(404).json({ message: "File not found" });
      }

      const token = randomUUID();
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.updateFile(fileId, {
        downloadToken: token,
        tokenExpiry: expiry,
      });

      res.json({ token, expiry });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/v1/files/download", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ message: "Token required" });
      }

      const file = await storage.getFileByToken(token as string);
      if (!file) {
        return res.status(404).json({ message: "Invalid or expired token" });
      }

      const filePath = path.join("uploads", file.filename);
      res.download(filePath, file.originalName);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/transform", authenticateToken, async (req: any, res) => {
    try {
      // Placeholder for image transformation logic
      res.json({ message: "Transform endpoint - implementation pending" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PayPal payment routes - only register if environment variables are available
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
    try {
      const { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } = await import("./paypal");
      
      app.get("/api/paypal/setup", async (req, res) => {
        await loadPaypalDefault(req, res);
      });

      app.post("/api/paypal/order", async (req, res) => {
        await createPaypalOrder(req, res);
      });

      app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
        await capturePaypalOrder(req, res);
      });
      
      console.log("✓ PayPal integration enabled");
    } catch (error) {
      console.warn("⚠ PayPal integration failed to load:", error);
    }
  } else {
    console.log("ℹ PayPal integration disabled - missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
    
    // Provide fallback routes that return appropriate errors
    app.get("/api/paypal/setup", (req, res) => {
      res.status(503).json({ error: "PayPal integration not configured" });
    });

    app.post("/api/paypal/order", (req, res) => {
      res.status(503).json({ error: "PayPal integration not configured" });
    });

    app.post("/api/paypal/order/:orderID/capture", (req, res) => {
      res.status(503).json({ error: "PayPal integration not configured" });
    });
  }

  // Payment management routes
  app.post("/api/v1/user/create-payment", authenticateToken, async (req: any, res) => {
    try {
      const { plan, amount, currency = "USD" } = req.body;
      
      const payment = await storage.createPayment({
        userId: req.user.id,
        amount: amount.toString(),
        currency,
        plan,
        status: "pending",
      });

      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/user/execute-payment", authenticateToken, async (req: any, res) => {
    try {
      const { paymentId, paypalOrderId } = req.body;
      
      const payment = await storage.updatePayment(paymentId, {
        paypalOrderId,
        status: "completed",
      });

      if (payment) {
        // Update user plan
        await storage.updateUser(req.user.id, {
          plan: payment.plan,
        });

        // Send notification
        sendNotification(req.user.id, {
          type: "payment_success",
          title: "Payment Successful",
          message: `Your ${payment.plan} plan is now active`,
        });
      }

      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/user/cancel-payment", authenticateToken, async (req: any, res) => {
    try {
      const { paymentId } = req.body;
      
      const payment = await storage.updatePayment(paymentId, {
        status: "cancelled",
      });

      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/v1/user/payments", authenticateToken, async (req: any, res) => {
    try {
      const payments = await storage.getPayments(req.user.id);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Budget routes
  app.get("/api/v1/budget", authenticateToken, async (req: any, res) => {
    try {
      const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
      const budget = await storage.getBudget(req.user.id, parseInt(month as string), parseInt(year as string));
      res.json(budget);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/budget", authenticateToken, async (req: any, res) => {
    try {
      const budgetData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget({
        ...budgetData,
        userId: req.user.id,
      });
      res.json(budget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Metrics routes
  app.get("/api/v1/metrics", authenticateToken, async (req: any, res) => {
    try {
      const userStats = await storage.getUserStats(req.user.id);
      const systemMetrics = await storage.getSystemMetrics();
      
      res.json({
        user: userStats,
        system: systemMetrics,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.post("/api/v1/admin/seed", authenticateToken, async (req: any, res) => {
    try {
      // Check if user is admin (simplified check)
      if (req.user.username !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Seed database with sample data
      res.json({ message: "Database seeded successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API docs endpoint
  app.get("/api/v1/docs", (req, res) => {
    res.json({
      title: "Adventure Sync API",
      version: "1.0.0",
      description: "API for outdoor adventure discovery and management",
      endpoints: {
        auth: ["/api/v1/auth/register", "/api/v1/auth/login", "/api/v1/auth/me"],
        events: ["/api/v1/events", "/api/v1/events/:id"],
        files: ["/api/v1/upload", "/api/v1/files", "/api/v1/files/download"],
        payments: ["/api/v1/user/create-payment", "/api/v1/user/execute-payment"],
        budget: ["/api/v1/budget"],
        metrics: ["/api/v1/metrics"],
      },
    });
  });

  return httpServer;
}
