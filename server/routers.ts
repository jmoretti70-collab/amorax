import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { 
  advertiserProfiles, 
  profileMedia, 
  reviews, 
  subscriptionPlans, 
  verificationRequests, 
  favorites,
  profileViews,
  appointments,
  availabilitySlots,
  blockedDates,
  appointmentMessages,
  users
} from "../drizzle/schema";
import { eq, and, desc, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { STRIPE_PRODUCTS, getPlanPrice, getPlanIntervalCount, type PlanType, type BillingInterval } from "./stripe/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover"
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Profiles Router
  profiles: router({
    // List profiles with filters
    list: publicProcedure
      .input(z.object({
        category: z.enum(["women", "men", "trans"]).optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        neighborhood: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        minAge: z.number().optional(),
        maxAge: z.number().optional(),
        isVerified: z.boolean().optional(),
        hasOwnPlace: z.boolean().optional(),
        is24Hours: z.boolean().optional(),
        services: z.array(z.string()).optional(),
        sortBy: z.enum(["relevance", "price_asc", "price_desc", "rating", "recent"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const offset = (input.page - 1) * input.limit;
        
        // Build query conditions
        const conditions = [eq(advertiserProfiles.isActive, true)];
        
        if (input.category) {
          conditions.push(eq(advertiserProfiles.category, input.category));
        }
        if (input.city) {
          conditions.push(like(advertiserProfiles.city, `%${input.city}%`));
        }
        if (input.state) {
          conditions.push(eq(advertiserProfiles.state, input.state));
        }
        if (input.hasOwnPlace) {
          conditions.push(eq(advertiserProfiles.hasOwnPlace, true));
        }
        if (input.is24Hours) {
          conditions.push(eq(advertiserProfiles.is24Hours, true));
        }
        if (input.minPrice) {
          conditions.push(sql`${advertiserProfiles.pricePerHour} >= ${input.minPrice}`);
        }
        if (input.maxPrice) {
          conditions.push(sql`${advertiserProfiles.pricePerHour} <= ${input.maxPrice}`);
        }
        if (input.minAge) {
          conditions.push(sql`${advertiserProfiles.age} >= ${input.minAge}`);
        }
        if (input.maxAge) {
          conditions.push(sql`${advertiserProfiles.age} <= ${input.maxAge}`);
        }

        // Get profiles
        const result = await db
          .select()
          .from(advertiserProfiles)
          .where(and(...conditions))
          .orderBy(
            input.sortBy === "price_asc" ? advertiserProfiles.pricePerHour :
            input.sortBy === "price_desc" ? desc(advertiserProfiles.pricePerHour) :
            input.sortBy === "recent" ? desc(advertiserProfiles.createdAt) :
            desc(advertiserProfiles.plan) // Default: VIP first, then Premium, then Free
          )
          .limit(input.limit)
          .offset(offset);

        // Get total count
        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(advertiserProfiles)
          .where(and(...conditions));

        return {
          profiles: result,
          total: countResult[0]?.count || 0,
          page: input.page,
          totalPages: Math.ceil((countResult[0]?.count || 0) / input.limit)
        };
      }),

    // Get single profile by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const result = await db
          .select()
          .from(advertiserProfiles)
          .where(eq(advertiserProfiles.slug, input.slug))
          .limit(1);

        if (!result[0]) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
        }

        // Increment view count
        await db
          .update(advertiserProfiles)
          .set({ viewCount: sql`${advertiserProfiles.viewCount} + 1` })
          .where(eq(advertiserProfiles.id, result[0].id));

        // Get photos
        const media = await db
          .select()
          .from(profileMedia)
          .where(eq(profileMedia.profileId, result[0].id))
          .orderBy(profileMedia.sortOrder);

        // Get reviews
        const profileReviews = await db
          .select()
          .from(reviews)
          .where(and(
            eq(reviews.profileId, result[0].id),
            eq(reviews.isApproved, true)
          ))
          .orderBy(desc(reviews.createdAt))
          .limit(10);

        return {
          ...result[0],
          media,
          reviews: profileReviews
        };
      }),

    // Create profile (for advertisers)
    create: protectedProcedure
      .input(z.object({
        category: z.enum(["women", "men", "trans"]),
        displayName: z.string().min(2).max(50),
        bio: z.string().min(10).max(2000),
        age: z.number().min(18).max(99),
        height: z.number().optional(),
        weight: z.number().optional(),
        eyeColor: z.string().optional(),
        hairColor: z.string().optional(),
        bodyType: z.string().optional(),
        ethnicity: z.string().optional(),
        whatsapp: z.string(),
        telegram: z.string().optional(),
        city: z.string(),
        state: z.string(),
        neighborhood: z.string(),
        pricePerHour: z.number().min(50),
        pricePerNight: z.number().optional(),
        acceptsPix: z.boolean().default(true),
        acceptsCard: z.boolean().default(false),
        acceptsCash: z.boolean().default(true),
        hasOwnPlace: z.boolean().default(false),
        doesOutcalls: z.boolean().default(false),
        is24Hours: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Generate slug from display name
        const baseSlug = input.displayName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        
        const slug = `${baseSlug}-${Date.now().toString(36)}`;

        await db.insert(advertiserProfiles).values({
          userId: ctx.user.id,
          slug,
          category: input.category,
          displayName: input.displayName,
          bio: input.bio,
          age: input.age,
          height: input.height,
          weight: input.weight,
          eyeColor: input.eyeColor,
          hairColor: input.hairColor,
          bodyType: input.bodyType,
          ethnicity: input.ethnicity,
          whatsapp: input.whatsapp,
          telegram: input.telegram,
          city: input.city,
          state: input.state,
          neighborhood: input.neighborhood,
          pricePerHour: String(input.pricePerHour),
          pricePerNight: input.pricePerNight ? String(input.pricePerNight) : null,
          acceptsPix: input.acceptsPix,
          acceptsCard: input.acceptsCard,
          acceptsCash: input.acceptsCash,
          hasOwnPlace: input.hasOwnPlace,
          doesOutcalls: input.doesOutcalls,
          is24Hours: input.is24Hours,
        });

        return { success: true, slug };
      }),

    // Update profile
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        displayName: z.string().min(2).max(50).optional(),
        bio: z.string().min(10).max(2000).optional(),
        age: z.number().min(18).max(99).optional(),
        height: z.number().optional(),
        weight: z.number().optional(),
        eyeColor: z.string().optional(),
        hairColor: z.string().optional(),
        bodyType: z.string().optional(),
        whatsapp: z.string().optional(),
        telegram: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        neighborhood: z.string().optional(),
        pricePerHour: z.number().min(50).optional(),
        pricePerNight: z.number().optional(),
        acceptsPix: z.boolean().optional(),
        acceptsCard: z.boolean().optional(),
        acceptsCash: z.boolean().optional(),
        hasOwnPlace: z.boolean().optional(),
        doesOutcalls: z.boolean().optional(),
        is24Hours: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify ownership
        const existing = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, input.id),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!existing[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to edit this profile" });
        }

        const { id, pricePerHour, pricePerNight, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        
        if (pricePerHour !== undefined) {
          updateData.pricePerHour = String(pricePerHour);
        }
        if (pricePerNight !== undefined) {
          updateData.pricePerNight = String(pricePerNight);
        }

        await db
          .update(advertiserProfiles)
          .set(updateData)
          .where(eq(advertiserProfiles.id, id));

        return { success: true };
      }),

    // Get my profile (for dashboard)
    getMyProfile: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select()
        .from(advertiserProfiles)
        .where(eq(advertiserProfiles.userId, ctx.user.id))
        .limit(1);

      if (!result[0]) {
        return null;
      }

      // Get media
      const media = await db
        .select()
        .from(profileMedia)
        .where(eq(profileMedia.profileId, result[0].id))
        .orderBy(profileMedia.sortOrder);

      // Get stats
      const stats = {
        viewsToday: result[0].viewCount || 0,
        viewsWeek: result[0].viewCount || 0,
        viewsMonth: result[0].viewCount || 0,
        contactsToday: result[0].contactCount || 0,
      };

      return {
        ...result[0],
        media,
        stats
      };
    }),
  }),

  // Media Router
  media: router({
    // Get media for multiple profiles
    getByProfiles: publicProcedure
      .input(z.object({
        profileIds: z.array(z.number()),
      }))
      .query(async ({ input }) => {
        if (input.profileIds.length === 0) return [];
        
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const result = await db
          .select()
          .from(profileMedia)
          .where(sql`${profileMedia.profileId} IN (${sql.join(input.profileIds.map(id => sql`${id}`), sql`, `)})`)
          .orderBy(profileMedia.sortOrder);

        return result;
      }),

    upload: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        type: z.enum(["photo", "video"]),
        url: z.string().url(),
        isMain: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify profile ownership
        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, input.profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        // Get current media count
        const mediaCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(profileMedia)
          .where(eq(profileMedia.profileId, input.profileId));

        const sortOrder = (mediaCount[0]?.count || 0) + 1;

        // If this is main photo, unset other main photos
        if (input.isMain) {
          await db
            .update(profileMedia)
            .set({ isMain: false })
            .where(eq(profileMedia.profileId, input.profileId));
        }

        await db.insert(profileMedia).values({
          profileId: input.profileId,
          type: input.type,
          url: input.url,
          isMain: input.isMain,
          sortOrder,
        });

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ mediaId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify ownership through profile
        const media = await db
          .select({ profileId: profileMedia.profileId })
          .from(profileMedia)
          .where(eq(profileMedia.id, input.mediaId))
          .limit(1);

        if (!media[0]) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Media not found" });
        }

        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, media[0].profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        await db.delete(profileMedia).where(eq(profileMedia.id, input.mediaId));

        return { success: true };
      }),
  }),

  // Reviews Router
  reviews: router({
    create: publicProcedure
      .input(z.object({
        profileId: z.number(),
        authorName: z.string().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10).max(500),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        await db.insert(reviews).values({
          profileId: input.profileId,
          authorName: input.authorName || "Anônimo",
          rating: input.rating,
          comment: input.comment,
          isApproved: false, // Requires moderation
        });

        return { success: true, message: "Review submitted for moderation" };
      }),

    list: publicProcedure
      .input(z.object({
        profileId: z.number(),
        page: z.number().default(1),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const offset = (input.page - 1) * input.limit;

        const result = await db
          .select()
          .from(reviews)
          .where(and(
            eq(reviews.profileId, input.profileId),
            eq(reviews.isApproved, true)
          ))
          .orderBy(desc(reviews.createdAt))
          .limit(input.limit)
          .offset(offset);

        return result;
      }),
  }),

  // Favorites Router
  favorites: router({
    toggle: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Check if already favorited
        const existing = await db
          .select()
          .from(favorites)
          .where(and(
            eq(favorites.userId, ctx.user.id),
            eq(favorites.profileId, input.profileId)
          ))
          .limit(1);

        if (existing[0]) {
          // Remove favorite
          await db.delete(favorites).where(eq(favorites.id, existing[0].id));
          return { isFavorite: false };
        } else {
          // Add favorite
          await db.insert(favorites).values({
            userId: ctx.user.id,
            profileId: input.profileId,
          });
          return { isFavorite: true };
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select({
          favorite: favorites,
          profile: advertiserProfiles,
        })
        .from(favorites)
        .innerJoin(advertiserProfiles, eq(favorites.profileId, advertiserProfiles.id))
        .where(eq(favorites.userId, ctx.user.id))
        .orderBy(desc(favorites.createdAt));

      return result.map(r => r.profile);
    }),
  }),

  // Plans Router
  plans: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, true))
        .orderBy(subscriptionPlans.priceMonthly);

      return result;
    }),
  }),

  // Verification Router
  verifications: router({
    submit: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        type: z.enum(["documents", "age", "photos"]),
        documentUrl: z.string().url(),
        selfieUrl: z.string().url().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify profile ownership
        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, input.profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        await db.insert(verificationRequests).values({
          profileId: input.profileId,
          type: input.type,
          documentUrl: input.documentUrl,
          selfieUrl: input.selfieUrl,
          status: "pending",
        });

        return { success: true, message: "Verification submitted for review" };
      }),

    getStatus: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const result = await db
          .select()
          .from(verificationRequests)
          .where(eq(verificationRequests.profileId, input.profileId))
          .orderBy(desc(verificationRequests.createdAt));

        return result;
      }),
  }),

  // Analytics Router
  analytics: router({
    trackView: publicProcedure
      .input(z.object({
        profileId: z.number(),
        referrer: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };

        await db.insert(profileViews).values({
          profileId: input.profileId,
          referrer: input.referrer,
        });

        return { success: true };
      }),
  }),

  // Appointments Router - Sistema de Agendamento
  appointments: router({
    // Get available slots for a profile on a specific date
    getAvailableSlots: publicProcedure
      .input(z.object({
        profileId: z.number(),
        date: z.string(), // YYYY-MM-DD format
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const dateObj = new Date(input.date);
        const dayOfWeek = dateObj.getDay();

        // Get availability slots for this day
        const slots = await db
          .select()
          .from(availabilitySlots)
          .where(and(
            eq(availabilitySlots.profileId, input.profileId),
            eq(availabilitySlots.dayOfWeek, dayOfWeek),
            eq(availabilitySlots.isActive, true)
          ));

        // Get existing appointments for this date
        const startOfDay = new Date(input.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(input.date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointments = await db
          .select()
          .from(appointments)
          .where(and(
            eq(appointments.profileId, input.profileId),
            sql`${appointments.appointmentDate} >= ${startOfDay}`,
            sql`${appointments.appointmentDate} <= ${endOfDay}`,
            sql`${appointments.status} NOT IN ('cancelled', 'no_show')`
          ));

        // Check if date is blocked
        const blocked = await db
          .select()
          .from(blockedDates)
          .where(and(
            eq(blockedDates.profileId, input.profileId),
            sql`DATE(${blockedDates.date}) = ${input.date}`
          ));

        return {
          slots,
          existingAppointments,
          isBlocked: blocked.length > 0,
          blockedReason: blocked[0]?.reason
        };
      }),

    // Create new appointment
    create: publicProcedure
      .input(z.object({
        profileId: z.number(),
        clientName: z.string().min(2),
        clientPhone: z.string().min(10),
        clientEmail: z.string().email().optional(),
        appointmentDate: z.string(), // ISO date string
        duration: z.number().min(60).default(60), // minutes
        serviceType: z.string().optional(),
        locationType: z.enum(["advertiser_place", "client_place", "hotel"]).default("advertiser_place"),
        locationAddress: z.string().optional(),
        clientNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Get profile to calculate estimated price
        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(eq(advertiserProfiles.id, input.profileId))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
        }

        const hourlyRate = parseFloat(profile[0].pricePerHour || "0");
        const estimatedPrice = (hourlyRate * input.duration) / 60;

        const result = await db.insert(appointments).values({
          profileId: input.profileId,
          clientName: input.clientName,
          clientPhone: input.clientPhone,
          clientEmail: input.clientEmail,
          appointmentDate: new Date(input.appointmentDate),
          duration: input.duration,
          serviceType: input.serviceType,
          locationType: input.locationType,
          locationAddress: input.locationAddress,
          clientNotes: input.clientNotes,
          estimatedPrice: String(estimatedPrice),
          status: "pending",
        });

        return { success: true, appointmentId: (result as any)[0]?.insertId };
      }),

    // Get appointments for advertiser
    listForAdvertiser: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show", "all"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify ownership
        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, input.profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        const conditions = [eq(appointments.profileId, input.profileId)];

        if (input.status && input.status !== "all") {
          conditions.push(eq(appointments.status, input.status));
        }
        if (input.startDate) {
          conditions.push(sql`${appointments.appointmentDate} >= ${new Date(input.startDate)}`);
        }
        if (input.endDate) {
          conditions.push(sql`${appointments.appointmentDate} <= ${new Date(input.endDate)}`);
        }

        const offset = (input.page - 1) * input.limit;

        const result = await db
          .select()
          .from(appointments)
          .where(and(...conditions))
          .orderBy(desc(appointments.appointmentDate))
          .limit(input.limit)
          .offset(offset);

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(appointments)
          .where(and(...conditions));

        return {
          appointments: result,
          total: countResult[0]?.count || 0,
          page: input.page,
          totalPages: Math.ceil((countResult[0]?.count || 0) / input.limit)
        };
      }),

    // Update appointment status (confirm, cancel, complete)
    updateStatus: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        status: z.enum(["confirmed", "cancelled", "completed", "no_show"]),
        cancellationReason: z.string().optional(),
        advertiserNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Get appointment and verify ownership
        const appointment = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, input.appointmentId))
          .limit(1);

        if (!appointment[0]) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Appointment not found" });
        }

        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, appointment[0].profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        const updateData: Record<string, unknown> = { status: input.status };

        if (input.status === "confirmed") {
          updateData.confirmedAt = new Date();
        } else if (input.status === "cancelled") {
          updateData.cancelledAt = new Date();
          updateData.cancelledBy = "advertiser";
          updateData.cancellationReason = input.cancellationReason;
        } else if (input.status === "completed") {
          updateData.completedAt = new Date();
        }

        if (input.advertiserNotes) {
          updateData.advertiserNotes = input.advertiserNotes;
        }

        await db
          .update(appointments)
          .set(updateData)
          .where(eq(appointments.id, input.appointmentId));

        return { success: true };
      }),

    // Get single appointment details
    getById: protectedProcedure
      .input(z.object({ appointmentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const appointment = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, input.appointmentId))
          .limit(1);

        if (!appointment[0]) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Appointment not found" });
        }

        // Get messages
        const messages = await db
          .select()
          .from(appointmentMessages)
          .where(eq(appointmentMessages.appointmentId, input.appointmentId))
          .orderBy(appointmentMessages.createdAt);

        return {
          ...appointment[0],
          messages
        };
      }),

    // Send message about appointment
    sendMessage: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        message: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        await db.insert(appointmentMessages).values({
          appointmentId: input.appointmentId,
          senderType: "advertiser",
          message: input.message,
        });

        return { success: true };
      }),
  }),

  // Availability Router - Gerenciar disponibilidade
  availability: router({
    // Get availability slots for a profile
    getSlots: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify ownership
        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, input.profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        const slots = await db
          .select()
          .from(availabilitySlots)
          .where(eq(availabilitySlots.profileId, input.profileId))
          .orderBy(availabilitySlots.dayOfWeek, availabilitySlots.startTime);

        return slots;
      }),

    // Set availability slots
    setSlots: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        slots: z.array(z.object({
          dayOfWeek: z.number().min(0).max(6),
          startTime: z.string(), // HH:MM
          endTime: z.string(), // HH:MM
          isActive: z.boolean().default(true),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify ownership
        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, input.profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        // Delete existing slots
        await db
          .delete(availabilitySlots)
          .where(eq(availabilitySlots.profileId, input.profileId));

        // Insert new slots
        if (input.slots.length > 0) {
          await db.insert(availabilitySlots).values(
            input.slots.map(slot => ({
              profileId: input.profileId,
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isActive: slot.isActive,
            }))
          );
        }

        return { success: true };
      }),

    // Get blocked dates
    getBlockedDates: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const blocked = await db
          .select()
          .from(blockedDates)
          .where(and(
            eq(blockedDates.profileId, input.profileId),
            sql`${blockedDates.date} >= ${new Date(input.startDate)}`,
            sql`${blockedDates.date} <= ${new Date(input.endDate)}`
          ));

        return blocked;
      }),

    // Block/unblock date
    toggleBlockDate: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        date: z.string(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify ownership
        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(and(
            eq(advertiserProfiles.id, input.profileId),
            eq(advertiserProfiles.userId, ctx.user.id)
          ))
          .limit(1);

        if (!profile[0]) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        // Check if already blocked
        const existing = await db
          .select()
          .from(blockedDates)
          .where(and(
            eq(blockedDates.profileId, input.profileId),
            sql`DATE(${blockedDates.date}) = ${input.date}`
          ));

        if (existing.length > 0) {
          // Unblock
          await db
            .delete(blockedDates)
            .where(eq(blockedDates.id, existing[0].id));
          return { blocked: false };
        } else {
          // Block
          await db.insert(blockedDates).values({
            profileId: input.profileId,
            date: new Date(input.date),
            reason: input.reason,
          });
          return { blocked: true };
        }
      }),
  }),

  // Payments Router - Stripe Integration
  payments: router({
    // Create checkout session for subscription
    createCheckoutSession: protectedProcedure
      .input(z.object({
        plan: z.enum(["premium", "vip"]),
        interval: z.enum(["monthly", "quarterly", "yearly"]).default("monthly"),
      }))
      .mutation(async ({ ctx, input }) => {
        const product = input.plan === "premium" ? STRIPE_PRODUCTS.PREMIUM : STRIPE_PRODUCTS.VIP;
        const price = getPlanPrice(input.plan, input.interval);
        const intervalCount = getPlanIntervalCount(input.interval);

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          allow_promotion_codes: true,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan: input.plan,
            interval: input.interval,
          },
          line_items: [
            {
              price_data: {
                currency: "brl",
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: price,
                recurring: {
                  interval: "month",
                  interval_count: intervalCount,
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.headers.origin}/dashboard?payment=success&plan=${input.plan}`,
          cancel_url: `${ctx.req.headers.origin}/dashboard?payment=cancelled`,
        });

        return { checkoutUrl: session.url };
      }),

    // Get current subscription status
    getSubscriptionStatus: protectedProcedure
      .query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(eq(advertiserProfiles.userId, ctx.user.id))
          .limit(1);

        if (!profile[0]) {
          return { hasSubscription: false, plan: "free" as const };
        }

        if (!profile[0].stripeSubscriptionId) {
          return { hasSubscription: false, plan: profile[0].plan };
        }

        try {
          const subscription = await stripe.subscriptions.retrieve(profile[0].stripeSubscriptionId);
          const periodEnd = (subscription as any).current_period_end;
          const cancelAtEnd = (subscription as any).cancel_at_period_end;
          return {
            hasSubscription: true,
            plan: profile[0].plan,
            status: subscription.status,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            cancelAtPeriodEnd: cancelAtEnd || false,
          };
        } catch {
          return { hasSubscription: false, plan: profile[0].plan };
        }
      }),

    // Cancel subscription
    cancelSubscription: protectedProcedure
      .mutation(async ({ ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const profile = await db
          .select()
          .from(advertiserProfiles)
          .where(eq(advertiserProfiles.userId, ctx.user.id))
          .limit(1);

        if (!profile[0]?.stripeSubscriptionId) {
          throw new TRPCError({ code: "NOT_FOUND", message: "No active subscription" });
        }

        await stripe.subscriptions.update(profile[0].stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

        return { success: true, message: "Subscription will be cancelled at the end of the billing period" };
      }),

    // Get available plans
    getPlans: publicProcedure
      .query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const plans = await db
          .select()
          .from(subscriptionPlans)
          .where(eq(subscriptionPlans.isActive, true));

        return plans;
      }),

    // Create portal session for managing subscription
    createPortalSession: protectedProcedure
      .mutation(async ({ ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        if (!user[0]?.stripeCustomerId) {
          throw new TRPCError({ code: "NOT_FOUND", message: "No Stripe customer found" });
        }

        const session = await stripe.billingPortal.sessions.create({
          customer: user[0].stripeCustomerId,
          return_url: `${ctx.req.headers.origin}/dashboard`,
        });

        return { portalUrl: session.url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
