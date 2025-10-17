import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const responses = pgTable("responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  businessName: text("business_name").notNull(),
  privacyConsent: text("privacy_consent").notNull(),
  intention: text("intention").notNull(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  taxId: text("tax_id").notNull(),
  infoSource: text("info_source").array().notNull(),
  referral: text("referral"),
  notInterestedReason: text("not_interested_reason"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  submittedAt: true,
});

export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;
