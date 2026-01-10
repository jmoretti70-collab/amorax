import Stripe from "stripe";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { users, advertiserProfiles, payments } from "../../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover"
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe Webhook] Missing webhook secret");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Stripe Webhook] Processing checkout.session.completed");

  const userId = session.metadata?.user_id;
  const plan = session.metadata?.plan as "premium" | "vip";

  if (!userId || !plan) {
    console.error("[Stripe Webhook] Missing metadata in checkout session");
    return;
  }

  const db = await getDb();
  if (!db) return;

  // Update user's Stripe customer ID
  if (session.customer) {
    await db
      .update(users)
      .set({ stripeCustomerId: session.customer as string })
      .where(eq(users.id, parseInt(userId)));
  }

  // Update advertiser profile with subscription
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const periodEnd = (subscription as any).current_period_end;
    const expiresAt = periodEnd ? new Date(periodEnd * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db
      .update(advertiserProfiles)
      .set({
        plan: plan,
        planExpiresAt: expiresAt,
        stripeSubscriptionId: session.subscription as string,
        isFeatured: plan === "vip"
      })
      .where(eq(advertiserProfiles.userId, parseInt(userId)));
  }

  console.log(`[Stripe Webhook] User ${userId} upgraded to ${plan} plan`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Processing subscription update");

  const db = await getDb();
  if (!db) return;

  const profile = await db
    .select()
    .from(advertiserProfiles)
    .where(eq(advertiserProfiles.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (profile.length === 0) {
    console.log("[Stripe Webhook] No profile found for subscription:", subscription.id);
    return;
  }

  const periodEnd = (subscription as any).current_period_end;
  const expiresAt = periodEnd ? new Date(periodEnd * 1000) : null;
  const isActive = subscription.status === "active" || subscription.status === "trialing";

  await db
    .update(advertiserProfiles)
    .set({
      planExpiresAt: expiresAt,
      isActive: isActive
    })
    .where(eq(advertiserProfiles.stripeSubscriptionId, subscription.id));

  console.log(`[Stripe Webhook] Updated subscription ${subscription.id}, active: ${isActive}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Processing subscription deletion");

  const db = await getDb();
  if (!db) return;

  await db
    .update(advertiserProfiles)
    .set({
      plan: "free",
      planExpiresAt: null,
      stripeSubscriptionId: null,
      isFeatured: false
    })
    .where(eq(advertiserProfiles.stripeSubscriptionId, subscription.id));

  console.log(`[Stripe Webhook] Subscription ${subscription.id} cancelled, reverted to free plan`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("[Stripe Webhook] Processing invoice.paid");

  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) return;

  const db = await getDb();
  if (!db) return;

  const profile = await db
    .select()
    .from(advertiserProfiles)
    .where(eq(advertiserProfiles.stripeSubscriptionId, subscriptionId as string))
    .limit(1);

  if (profile.length === 0) return;

  const paymentIntentId = (invoice as any).payment_intent;
  const amountPaid = (invoice as any).amount_paid || 0;

  // Record payment
  await db.insert(payments).values({
    profileId: profile[0].id,
    planId: profile[0].plan === "vip" ? 3 : 2, // Assuming plan IDs
    amount: (amountPaid / 100).toFixed(2),
    currency: (invoice.currency || "brl").toUpperCase(),
    paymentMethod: "credit_card",
    status: "completed",
    stripePaymentIntentId: paymentIntentId as string,
    stripeInvoiceId: invoice.id || undefined,
    paidAt: new Date()
  });

  console.log(`[Stripe Webhook] Recorded payment for invoice ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("[Stripe Webhook] Processing invoice.payment_failed");
  // Could send notification to user about failed payment
  // For now, just log it
  console.log(`[Stripe Webhook] Payment failed for invoice ${invoice.id}`);
}
