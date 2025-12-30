import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getDb: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([{
            id: 1,
            profileId: 1,
            clientName: "Test Client",
            clientPhone: "11999999999",
            appointmentDate: new Date(),
            duration: 60,
            status: "pending",
            estimatedPrice: "300.00",
          }])),
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn(() => Promise.resolve([]))
            }))
          }))
        }))
      }))
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve([{ insertId: 1 }]))
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve())
      }))
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve())
    }))
  }))
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "advertiser",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Appointments Router", () => {
  describe("getAvailableSlots", () => {
    it("should return available slots for a given date", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.appointments.getAvailableSlots({
        profileId: 1,
        date: "2025-01-15",
      });

      expect(result).toHaveProperty("slots");
      expect(result).toHaveProperty("existingAppointments");
      expect(result).toHaveProperty("isBlocked");
    });
  });

  describe("create", () => {
    it("should create a new appointment with valid data", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const appointmentData = {
        profileId: 1,
        clientName: "João Silva",
        clientPhone: "11999999999",
        appointmentDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        duration: 60,
        locationType: "advertiser_place" as const,
      };

      const result = await caller.appointments.create(appointmentData);

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("appointmentId");
    });

    it("should reject appointment with invalid phone number", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.appointments.create({
          profileId: 1,
          clientName: "João Silva",
          clientPhone: "123", // Too short
          appointmentDate: new Date(Date.now() + 86400000).toISOString(),
          duration: 60,
          locationType: "advertiser_place",
        })
      ).rejects.toThrow();
    });

    it("should reject appointment with invalid client name", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.appointments.create({
          profileId: 1,
          clientName: "J", // Too short
          clientPhone: "11999999999",
          appointmentDate: new Date(Date.now() + 86400000).toISOString(),
          duration: 60,
          locationType: "advertiser_place",
        })
      ).rejects.toThrow();
    });
  });

  describe("listForAdvertiser", () => {
    it("should require authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.appointments.listForAdvertiser({
          profileId: 1,
        })
      ).rejects.toThrow();
    });

    it("should list appointments for authenticated advertiser", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.appointments.listForAdvertiser({
        profileId: 1,
      });

      expect(result).toHaveProperty("appointments");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("totalPages");
    });
  });

  describe("updateStatus", () => {
    it("should require authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.appointments.updateStatus({
          appointmentId: 1,
          status: "confirmed",
        })
      ).rejects.toThrow();
    });
  });
});

describe("Availability Router", () => {
  describe("getSlots", () => {
    it("should require authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.availability.getSlots({
          profileId: 1,
        })
      ).rejects.toThrow();
    });
  });

  describe("setSlots", () => {
    it("should require authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.availability.setSlots({
          profileId: 1,
          slots: [
            { dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isActive: true }
          ],
        })
      ).rejects.toThrow();
    });

    it("should validate day of week range", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.availability.setSlots({
          profileId: 1,
          slots: [
            { dayOfWeek: 7, startTime: "09:00", endTime: "18:00", isActive: true } // Invalid: 7 is out of range
          ],
        })
      ).rejects.toThrow();
    });
  });

  describe("toggleBlockDate", () => {
    it("should require authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.availability.toggleBlockDate({
          profileId: 1,
          date: "2025-01-15",
        })
      ).rejects.toThrow();
    });
  });
});
