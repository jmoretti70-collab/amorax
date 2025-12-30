import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn(() => Promise.resolve([
                {
                  id: 1,
                  slug: "julia-santos",
                  displayName: "Julia Santos",
                  category: "women",
                  age: 25,
                  city: "São Paulo",
                  state: "SP",
                  pricePerHour: "300.00",
                  isActive: true,
                  plan: "premium"
                }
              ]))
            }))
          }))
        })),
        limit: vi.fn(() => Promise.resolve([{ count: 1 }]))
      }))
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve({ insertId: 1 }))
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

function createAuthenticatedContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("profiles.list", () => {
  it("should return profiles list with pagination", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profiles.list({
      page: 1,
      limit: 20
    });

    expect(result).toHaveProperty("profiles");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("page");
    expect(result).toHaveProperty("totalPages");
  });

  it("should filter by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profiles.list({
      category: "women",
      page: 1,
      limit: 20
    });

    expect(result).toHaveProperty("profiles");
  });
});

describe("auth.me", () => {
  it("should return null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("should return user for authenticated user", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@example.com");
  });
});

describe("auth.logout", () => {
  it("should clear session cookie and return success", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});
