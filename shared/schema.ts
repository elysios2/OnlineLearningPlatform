import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username"),
  password: text("password"),
  authProvider: text("auth_provider").default("email"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  authProvider: true,
  isPremium: true,
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // In cents
  isPremium: boolean("is_premium").default(false),
  imageUrl: text("image_url"),
  fileUrl: text("file_url"), // Encrypted for premium courses
  encryptionKey: text("encryption_key"), // For premium courses
  duration: integer("duration"), // In minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  price: true,
  isPremium: true,
  imageUrl: true,
  fileUrl: true,
  encryptionKey: true,
  duration: true,
});

// User Courses (for tracking enrollment and progress)
export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  progress: integer("progress").default(0), // Percentage
  purchased: boolean("purchased").default(false),
  purchaseDate: timestamp("purchase_date"),
  lastAccessed: timestamp("last_accessed"),
});

export const insertUserCourseSchema = createInsertSchema(userCourses).pick({
  userId: true,
  courseId: true,
  progress: true,
  purchased: true,
  purchaseDate: true,
  lastAccessed: true,
});

// Reading Test Results
export const readingTests = pgTable("reading_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  wordsPerMinute: integer("words_per_minute").notNull(),
  comprehensionScore: integer("comprehension_score").notNull(), // Percentage
  dateCompleted: timestamp("date_completed").defaultNow(),
  questions: jsonb("questions"), // Store questions and answers
  recommendations: text("recommendations"),
});

export const insertReadingTestSchema = createInsertSchema(readingTests).pick({
  userId: true,
  wordsPerMinute: true,
  comprehensionScore: true,
  questions: true,
  recommendations: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type UserCourse = typeof userCourses.$inferSelect;
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;

export type ReadingTest = typeof readingTests.$inferSelect;
export type InsertReadingTest = z.infer<typeof insertReadingTestSchema>;
