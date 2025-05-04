import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Schemes table
export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  ministry: text("ministry").notNull(),
  eligibilityCriteria: jsonb("eligibility_criteria").notNull(),
  benefits: text("benefits").notNull(),
  applicationUrl: text("application_url"),
  applicationFormPath: text("application_form_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSchemeSchema = createInsertSchema(schemes);
export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemes.$inferSelect;

// User profile table
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  socialCategory: text("social_category").notNull(),
  annualIncome: integer("annual_income").notNull(),
  occupation: text("occupation").notNull(),
  state: text("state").notNull(),
  district: text("district"),
  residence: text("residence").notNull(),
  bplCard: boolean("bpl_card").default(false).notNull(),
  mgnregaCard: boolean("mgnrega_card").default(false).notNull(),
  kisanCreditCard: boolean("kisan_credit_card").default(false).notNull(),
  disabilityCertificate: boolean("disability_certificate").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles);
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Schemes categories
export const schemeCategories = pgTable("scheme_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
});

export const insertSchemeCategorySchema = createInsertSchema(schemeCategories);
export type InsertSchemeCategory = z.infer<typeof insertSchemeCategorySchema>;
export type SchemeCategory = typeof schemeCategories.$inferSelect;

// Saved schemes table (for users who want to save schemes they're interested in)
export const savedSchemes = pgTable("saved_schemes", {
  id: serial("id").primaryKey(),
  userProfileId: integer("user_profile_id").notNull(),
  schemeId: integer("scheme_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const insertSavedSchemeSchema = createInsertSchema(savedSchemes);
export type InsertSavedScheme = z.infer<typeof insertSavedSchemeSchema>;
export type SavedScheme = typeof savedSchemes.$inferSelect;

// Relations
export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  savedSchemes: many(savedSchemes)
}));

export const schemesRelations = relations(schemes, ({ many }) => ({
  savedSchemes: many(savedSchemes)
}));

export const savedSchemesRelations = relations(savedSchemes, ({ one }) => ({
  userProfile: one(userProfiles, { fields: [savedSchemes.userProfileId], references: [userProfiles.id] }),
  scheme: one(schemes, { fields: [savedSchemes.schemeId], references: [schemes.id] })
}));

// Validation schemas
export const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.coerce.number().min(0, "Age must be non-negative").max(120, "Age must be less than 120"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  socialCategory: z.enum(["general", "obc", "sc", "st", "ews"], {
    required_error: "Please select a social category",
  }),
  annualIncome: z.coerce.number().min(0, "Annual income must be non-negative"),
  occupation: z.enum(["student", "farmer", "business", "salaried", "unemployed", "retired", "homemaker", "other"], {
    required_error: "Please select an occupation",
  }),
  state: z.string({
    required_error: "Please select a state",
  }),
  district: z.string().optional(),
  residence: z.enum(["rural", "urban", "tribal"], {
    required_error: "Please select a residence type",
  }),
  bplCard: z.boolean().default(false),
  mgnregaCard: z.boolean().default(false),
  kisanCreditCard: z.boolean().default(false),
  disabilityCertificate: z.boolean().default(false),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
