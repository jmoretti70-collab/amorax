import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `User ${userId}`,
    loginMethod: "manus",
    role: "user",
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
    res: {} as TrpcContext["res"],
  };
}

describe("chat system", () => {
  it("should create a conversation", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.createConversation({
      advertiserId: 2,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.userId).toBe(1);
    expect(result.advertiserId).toBe(2);
  });

  it("should list conversations", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.listConversations();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should handle chat API calls", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const conversation = await caller.chat.createConversation({
      advertiserId: 2,
    });

    expect(conversation).toBeDefined();
    expect(conversation.id).toBeDefined();
  });
});
