import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

// ============================================
// USERS TABLE - Core authentication
// ============================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "advertiser"]).default("user").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 100 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// ADVERTISER PROFILES - Main profile for advertisers
// ============================================
export const advertiserProfiles = mysqlTable("advertiser_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  // Basic Info
  displayName: varchar("displayName", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  category: mysqlEnum("category", ["women", "men", "trans"]).notNull(),
  bio: text("bio"),
  
  // Physical Characteristics
  age: int("age"),
  height: int("height"), // in cm
  weight: int("weight"), // in kg
  eyeColor: varchar("eyeColor", { length: 50 }),
  hairColor: varchar("hairColor", { length: 50 }),
  bodyType: varchar("bodyType", { length: 50 }),
  ethnicity: varchar("ethnicity", { length: 50 }),
  
  // Contact
  whatsapp: varchar("whatsapp", { length: 20 }),
  telegram: varchar("telegram", { length: 100 }),
  
  // Location
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  hasOwnPlace: boolean("hasOwnPlace").default(false),
  doesOutcalls: boolean("doesOutcalls").default(false),
  
  // Pricing
  pricePerHour: decimal("pricePerHour", { precision: 10, scale: 2 }),
  pricePerNight: decimal("pricePerNight", { precision: 10, scale: 2 }),
  acceptsPix: boolean("acceptsPix").default(true),
  acceptsCard: boolean("acceptsCard").default(false),
  acceptsCash: boolean("acceptsCash").default(true),
  
  // Availability
  availableHours: json("availableHours"), // JSON with schedule
  is24Hours: boolean("is24Hours").default(false),
  
  // Verification Status
  documentsVerified: boolean("documentsVerified").default(false),
  ageVerified: boolean("ageVerified").default(false),
  photosVerified: boolean("photosVerified").default(false),
  
  // Plan & Status
  plan: mysqlEnum("plan", ["free", "premium", "vip"]).default("free").notNull(),
  planExpiresAt: timestamp("planExpiresAt"),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false),
  
  // Stats
  viewCount: int("viewCount").default(0),
  contactCount: int("contactCount").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdvertiserProfile = typeof advertiserProfiles.$inferSelect;
export type InsertAdvertiserProfile = typeof advertiserProfiles.$inferInsert;

// ============================================
// PROFILE MEDIA - Photos and Videos
// ============================================
export const profileMedia = mysqlTable("profile_media", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  
  type: mysqlEnum("type", ["photo", "video"]).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  isMain: boolean("isMain").default(false),
  isVerification: boolean("isVerification").default(false), // For verification photos
  sortOrder: int("sortOrder").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProfileMedia = typeof profileMedia.$inferSelect;
export type InsertProfileMedia = typeof profileMedia.$inferInsert;

// ============================================
// SERVICES - Services offered by advertisers
// ============================================
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  category: mysqlEnum("category", ["women", "men", "trans", "all"]).default("all").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// ============================================
// PROFILE SERVICES - Junction table
// ============================================
export const profileServices = mysqlTable("profile_services", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  serviceId: int("serviceId").notNull().references(() => services.id),
});

export type ProfileService = typeof profileServices.$inferSelect;
export type InsertProfileService = typeof profileServices.$inferInsert;

// ============================================
// VERIFICATION REQUESTS - Document verification
// ============================================
export const verificationRequests = mysqlTable("verification_requests", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  
  type: mysqlEnum("type", ["documents", "age", "photos"]).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  
  documentUrl: varchar("documentUrl", { length: 500 }),
  selfieUrl: varchar("selfieUrl", { length: 500 }),
  
  reviewedBy: int("reviewedBy").references(() => users.id),
  reviewedAt: timestamp("reviewedAt"),
  rejectionReason: text("rejectionReason"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type InsertVerificationRequest = typeof verificationRequests.$inferInsert;

// ============================================
// REVIEWS - User reviews for profiles
// ============================================
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  userId: int("userId").references(() => users.id),
  
  authorName: varchar("authorName", { length: 100 }),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  
  isApproved: boolean("isApproved").default(false),
  isVisible: boolean("isVisible").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============================================
// SUBSCRIPTION PLANS - Plan definitions
// ============================================
export const subscriptionPlans = mysqlTable("subscription_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: mysqlEnum("slug", ["free", "premium", "vip"]).notNull().unique(),
  
  priceMonthly: decimal("priceMonthly", { precision: 10, scale: 2 }).notNull(),
  priceQuarterly: decimal("priceQuarterly", { precision: 10, scale: 2 }),
  priceYearly: decimal("priceYearly", { precision: 10, scale: 2 }),
  
  maxPhotos: int("maxPhotos").default(5),
  maxVideos: int("maxVideos").default(0),
  featuredPosition: boolean("featuredPosition").default(false),
  verifiedBadge: boolean("verifiedBadge").default(false),
  prioritySupport: boolean("prioritySupport").default(false),
  analyticsAccess: boolean("analyticsAccess").default(false),
  
  isActive: boolean("isActive").default(true).notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

// ============================================
// PAYMENTS - Payment transactions
// ============================================
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  planId: int("planId").notNull().references(() => subscriptionPlans.id),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  
  paymentMethod: mysqlEnum("paymentMethod", ["pix", "credit_card", "debit_card"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  
  externalId: varchar("externalId", { length: 100 }), // Payment gateway reference
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 100 }),
  stripeInvoiceId: varchar("stripeInvoiceId", { length: 100 }),
  paidAt: timestamp("paidAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ============================================
// CITIES - Brazilian cities for location
// ============================================
export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isPopular: boolean("isPopular").default(false),
});

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

// ============================================
// PROFILE VIEWS - Analytics tracking
// ============================================
export const profileViews = mysqlTable("profile_views", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  viewerIp: varchar("viewerIp", { length: 45 }),
  userAgent: text("userAgent"),
  referrer: varchar("referrer", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProfileView = typeof profileViews.$inferSelect;
export type InsertProfileView = typeof profileViews.$inferInsert;

// ============================================
// FAVORITES - User favorites
// ============================================
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;


// ============================================
// AVAILABILITY SLOTS - Advertiser availability
// ============================================
export const availabilitySlots = mysqlTable("availability_slots", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  
  dayOfWeek: int("dayOfWeek").notNull(), // 0 = Sunday, 6 = Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM format
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM format
  
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = typeof availabilitySlots.$inferInsert;

// ============================================
// BLOCKED DATES - Dates when advertiser is unavailable
// ============================================
export const blockedDates = mysqlTable("blocked_dates", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  
  date: timestamp("date").notNull(),
  reason: varchar("reason", { length: 200 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlockedDate = typeof blockedDates.$inferSelect;
export type InsertBlockedDate = typeof blockedDates.$inferInsert;

// ============================================
// APPOINTMENTS - Booking appointments
// ============================================
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => advertiserProfiles.id),
  userId: int("userId").references(() => users.id),
  
  // Client info (for non-registered users)
  clientName: varchar("clientName", { length: 100 }),
  clientPhone: varchar("clientPhone", { length: 20 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  
  // Appointment details
  appointmentDate: timestamp("appointmentDate").notNull(),
  duration: int("duration").notNull(), // in minutes (60, 120, etc.)
  serviceType: varchar("serviceType", { length: 100 }), // Type of service requested
  
  // Location
  locationType: mysqlEnum("locationType", ["advertiser_place", "client_place", "hotel"]).default("advertiser_place").notNull(),
  locationAddress: text("locationAddress"),
  
  // Pricing
  estimatedPrice: decimal("estimatedPrice", { precision: 10, scale: 2 }),
  
  // Status
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed", "no_show"]).default("pending").notNull(),
  
  // Notes
  clientNotes: text("clientNotes"),
  advertiserNotes: text("advertiserNotes"),
  
  // Cancellation
  cancelledBy: mysqlEnum("cancelledBy", ["client", "advertiser"]),
  cancellationReason: text("cancellationReason"),
  cancelledAt: timestamp("cancelledAt"),
  
  // Confirmation
  confirmedAt: timestamp("confirmedAt"),
  completedAt: timestamp("completedAt"),
  
  // Reminders
  reminderSentAt: timestamp("reminderSentAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// ============================================
// APPOINTMENT MESSAGES - Communication about appointments
// ============================================
export const appointmentMessages = mysqlTable("appointment_messages", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull().references(() => appointments.id),
  
  senderType: mysqlEnum("senderType", ["client", "advertiser", "system"]).notNull(),
  message: text("message").notNull(),
  
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AppointmentMessage = typeof appointmentMessages.$inferSelect;
export type InsertAppointmentMessage = typeof appointmentMessages.$inferInsert;


// ============================================
// CONVERSATIONS - Chat conversations between users and advertisers
// ============================================
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  
  // Participants
  userId: int("userId").notNull().references(() => users.id),
  advertiserId: int("advertiserId").notNull().references(() => advertiserProfiles.id),
  
  // Last message info
  lastMessage: text("lastMessage"),
  lastMessageAt: timestamp("lastMessageAt"),
  lastMessageSenderId: int("lastMessageSenderId"),
  
  // Unread counts
  userUnreadCount: int("userUnreadCount").default(0).notNull(),
  advertiserUnreadCount: int("advertiserUnreadCount").default(0).notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// ============================================
// MESSAGES - Individual chat messages
// ============================================
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => conversations.id),
  
  // Sender info
  senderId: int("senderId").notNull().references(() => users.id),
  senderType: mysqlEnum("senderType", ["user", "advertiser"]).notNull(),
  
  // Message content
  content: text("content").notNull(),
  
  // Message status
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
