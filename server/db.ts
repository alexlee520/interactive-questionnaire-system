import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// User schema for authentication and authorization
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(), // Should be hashed in production
  email: text("email").unique().notNull(),
  role: text("role").default("viewer").notNull(), // viewer, editor, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Database connection (only used if DATABASE_URL is set)
export function getDb() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  
  return drizzle({
    connection: process.env.DATABASE_URL,
    ws: ws,
  });
}

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
