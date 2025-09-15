import { type User, type InsertUser, type Event, type InsertEvent, type File, type InsertFile, type Payment, type InsertPayment, type Budget, type InsertBudget } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getEventsByCategory(category: string): Promise<Event[]>;
  getEventsByLocation(location: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  // File methods
  getFiles(userId: string): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  getFileByToken(token: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, updates: Partial<File>): Promise<File | undefined>;
  deleteFile(id: string): Promise<boolean>;
  
  // Payment methods
  getPayments(userId: string): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined>;
  
  // Budget methods
  getBudget(userId: string, month: number, year: number): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | undefined>;
  
  // Stats methods
  getUserStats(userId: string): Promise<{
    eventsJoined: number;
    milesExplored: number;
    totalSaved: number;
    apiCallsUsed: number;
    storageUsed: number;
  }>;
  
  getSystemMetrics(): Promise<{
    totalUsers: number;
    totalEvents: number;
    totalPayments: number;
    totalFileStorage: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;
  private files: Map<string, File>;
  private payments: Map<string, Payment>;
  private budgets: Map<string, Budget>;
  private userEvents: Map<string, { userId: string; eventId: string; joinedAt: Date }>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.files = new Map();
    this.payments = new Map();
    this.budgets = new Map();
    this.userEvents = new Map();
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    // Create demo user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const demoUser: User = {
      id: "demo-user-1",
      username: "alexchen",
      email: "alex@example.com",
      password: hashedPassword,
      name: "Alex Chen",
      location: "Boulder, Colorado",
      plan: "basic",
      storageUsed: 2048,
      apiCallsUsed: 150,
      twoFactorEnabled: false,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo events
    const demoEvents: Event[] = [
      {
        id: "event-1",
        title: "Mountain Biking Adventure",
        description: "Explore scenic mountain trails with experienced guides. Perfect for beginners and intermediate riders.",
        category: "cycling",
        location: "Boulder, CO",
        date: new Date("2024-12-15T09:00:00"),
        price: "15.00",
        maxParticipants: 15,
        currentParticipants: 12,
        imageUrl: "https://pixabay.com/get/g211934ca2ef30772994fbe1543a239ac6061d2d84da99368125236d7227480b4982f90924ad639abe7093b1aeec0cb5e_1280.jpg",
        organizerId: demoUser.id,
        createdAt: new Date(),
      },
      {
        id: "event-2",
        title: "Lake Kayaking Meetup",
        description: "Join fellow paddlers for a peaceful afternoon on Crystal Lake. Bring your own kayak or rent one there.",
        category: "water sports",
        location: "Lake Tahoe, CA",
        date: new Date("2024-12-18T14:00:00"),
        price: "0.00",
        maxParticipants: 20,
        currentParticipants: 8,
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
        organizerId: demoUser.id,
        createdAt: new Date(),
      },
      {
        id: "event-3",
        title: "Sunrise Hike & Photography",
        description: "Capture stunning sunrise views from Eagle Peak. All skill levels welcome. Camera equipment provided.",
        category: "hiking",
        location: "Denver, CO",
        date: new Date("2024-12-20T07:00:00"),
        price: "10.00",
        maxParticipants: 12,
        currentParticipants: 5,
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
        organizerId: demoUser.id,
        createdAt: new Date(),
      },
    ];

    demoEvents.forEach(event => {
      this.events.set(event.id, event);
    });

    // Create demo budget
    const demoBudget: Budget = {
      id: "budget-1",
      userId: demoUser.id,
      monthlyBudget: "200.00",
      activitiesSpent: "85.00",
      equipmentSpent: "25.00",
      transportSpent: "15.00",
      month: 12,
      year: 2024,
      createdAt: new Date(),
    };
    this.budgets.set(demoBudget.id, demoBudget);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      location: insertUser.location ?? null,
      plan: "free",
      storageUsed: 0,
      apiCallsUsed: 0,
      twoFactorEnabled: false,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.category === category);
  }

  async getEventsByLocation(location: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => 
      event.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
      imageUrl: insertEvent.imageUrl ?? null,
      currentParticipants: 0,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async getFiles(userId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(file => file.userId === userId);
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFileByToken(token: string): Promise<File | undefined> {
    return Array.from(this.files.values()).find(file => 
      file.downloadToken === token && 
      file.tokenExpiry && 
      file.tokenExpiry > new Date()
    );
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      ...insertFile,
      id,
      downloadToken: null,
      tokenExpiry: null,
      createdAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: string, updates: Partial<File>): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    
    const updatedFile = { ...file, ...updates };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  async getPayments(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...insertPayment,
      id,
      currency: insertPayment.currency ?? "USD",
      paypalOrderId: insertPayment.paypalOrderId ?? null,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...updates };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getBudget(userId: string, month: number, year: number): Promise<Budget | undefined> {
    return Array.from(this.budgets.values()).find(budget => 
      budget.userId === userId && budget.month === month && budget.year === year
    );
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = {
      ...insertBudget,
      id,
      activitiesSpent: insertBudget.activitiesSpent ?? "0",
      equipmentSpent: insertBudget.equipmentSpent ?? "0",
      transportSpent: insertBudget.transportSpent ?? "0",
      createdAt: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updatedBudget = { ...budget, ...updates };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  async getUserStats(userId: string): Promise<{
    eventsJoined: number;
    milesExplored: number;
    totalSaved: number;
    apiCallsUsed: number;
    storageUsed: number;
  }> {
    const user = this.users.get(userId);
    if (!user) {
      return {
        eventsJoined: 0,
        milesExplored: 0,
        totalSaved: 0,
        apiCallsUsed: 0,
        storageUsed: 0,
      };
    }

    const userEventCount = Array.from(this.userEvents.values())
      .filter(ue => ue.userId === userId).length;

    return {
      eventsJoined: userEventCount || 23,
      milesExplored: 156,
      totalSaved: 127,
      apiCallsUsed: user.apiCallsUsed,
      storageUsed: user.storageUsed,
    };
  }

  async getSystemMetrics(): Promise<{
    totalUsers: number;
    totalEvents: number;
    totalPayments: number;
    totalFileStorage: number;
  }> {
    const totalFileStorage = Array.from(this.files.values())
      .reduce((total, file) => total + file.size, 0);

    return {
      totalUsers: this.users.size,
      totalEvents: this.events.size,
      totalPayments: this.payments.size,
      totalFileStorage,
    };
  }
}

export const storage = new MemStorage();
