import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

// In-memory user storage (for demo purposes)
// In production, this should be replaced with database queries
interface User {
  id: number;
  username: string;
  password: string; // In production, this should be hashed
  email: string;
  role: "viewer" | "editor" | "admin";
}

// Default admin user for demo
const users: Map<string, User> = new Map();
users.set("admin", {
  id: 1,
  username: "admin",
  password: "admin123", // In production, use bcrypt
  email: "admin@example.com",
  role: "admin",
});

// Passport local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.get(username);
    
    if (!user) {
      return done(null, false, { message: "使用者不存在" });
    }
    
    if (user.password !== password) {
      return done(null, false, { message: "密碼錯誤" });
    }
    
    return done(null, user);
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  const user = Array.from(users.values()).find(u => u.id === id);
  done(null, user || null);
});

// Setup authentication middleware
export function setupAuth(app: Express) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "questionnaire-secret-key-change-in-prod",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "請先登入" });
}

// Role-based authorization middleware
export function requireRole(role: "viewer" | "editor" | "admin") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "請先登入" });
    }
    
    const user = req.user as User;
    const roleHierarchy = { viewer: 0, editor: 1, admin: 2 };
    
    if (roleHierarchy[user.role] >= roleHierarchy[role]) {
      return next();
    }
    
    res.status(403).json({ error: "權限不足" });
  };
}

// User management functions
export function addUser(username: string, password: string, email: string, role: "viewer" | "editor" | "admin" = "viewer"): User {
  if (users.has(username)) {
    throw new Error("使用者名稱已存在");
  }
  
  const id = users.size + 1;
  const user: User = { id, username, password, email, role };
  users.set(username, user);
  return user;
}

export function removeUser(username: string): boolean {
  return users.delete(username);
}

export function updateUserRole(username: string, role: "viewer" | "editor" | "admin"): User | null {
  const user = users.get(username);
  if (!user) return null;
  
  user.role = role;
  return user;
}

export function getAllUsers(): User[] {
  return Array.from(users.values()).map(u => ({
    ...u,
    password: undefined as any, // Don't send password
  }));
}

export function getUserByUsername(username: string): User | null {
  const user = users.get(username);
  return user ? { ...user, password: undefined as any } : null;
}
