import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { ENV } from "./_core/env";
import { recordStripeWebhookEvent, upsertStripeMembership } from "./db";

type StripeObject = Record<string, unknown>;
type StripeEvent = { id: string; type: string; data: { object: StripeObject } };

const SIGNATURE_TOLERANCE_SECONDS = 300;

function firstString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function parseStripeSignature(header: string): { timestamp: string; signatures: string[] } | null {
  const segments = header.split(",").map((item) => item.trim());
  const timestamp = segments.find((item) => item.startsWith("t="))?.slice(2);
  const signatures = segments.filter((item) => item.startsWith("v1=")).map((item) => item.slice(3));
  if (!timestamp || signatures.length === 0 || !/^\d+$/.test(timestamp)) return null;
  return { timestamp, signatures };
}

export function verifyStripeSignature(payload: Buffer, header: string, secret: string, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  const parsed = parseStripeSignature(header);
  if (!parsed || !secret) return false;
  if (Math.abs(nowSeconds - Number(parsed.timestamp)) > SIGNATURE_TOLERANCE_SECONDS) return false;
  const expected = createHmac("sha256", secret).update(`${parsed.timestamp}.${payload.toString("utf8")}`).digest("hex");
  return parsed.signatures.some((candidate) => {
    if (candidate.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(expected, "hex"));
  });
}

function resolvePlan(object: StripeObject): string {
  const directPriceId = firstString(object.price) ?? firstString((object.items as StripeObject | undefined)?.data && undefined);
  const items = object.items as { data?: Array<{ price?: { id?: string } }> } | undefined;
  const priceId = directPriceId ?? items?.data?.[0]?.price?.id ?? null;
  if (priceId && priceId === ENV.stripePremiumPriceId) return "premium";
  if (priceId && priceId === ENV.stripeVipPriceId) return "vip";
  return "unknown";
}

function secondsToDate(value: unknown): Date | null {
  return typeof value === "number" && Number.isFinite(value) ? new Date(value * 1000) : null;
}

function extractSubscriptionId(event: StripeEvent): string | null {
  const object = event.data.object;
  if (event.type.startsWith("customer.subscription.")) return firstString(object.id);
  return firstString(object.subscription);
}

export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
  const signature = req.header("stripe-signature") ?? "";
  if (!ENV.stripeWebhookSecret) {
    res.status(503).json({ error: "WEBHOOK_NOT_CONFIGURED" });
    return;
  }
  if (!verifyStripeSignature(rawBody, signature, ENV.stripeWebhookSecret)) {
    res.status(400).json({ error: "INVALID_SIGNATURE" });
    return;
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody.toString("utf8")) as StripeEvent;
  } catch {
    res.status(400).json({ error: "INVALID_PAYLOAD" });
    return;
  }
  if (!event.id || !event.type || !event.data?.object) {
    res.status(400).json({ error: "MALFORMED_EVENT" });
    return;
  }

  const subscriptionId = extractSubscriptionId(event);
  const isNew = await recordStripeWebhookEvent({
    eventId: event.id,
    eventType: event.type,
    stripeSubscriptionId: subscriptionId,
  });
  if (!isNew) {
    res.status(200).json({ received: true, duplicate: true });
    return;
  }

  const object = event.data.object;
  if (subscriptionId && [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_failed",
  ].includes(event.type)) {
    const status = event.type === "invoice.payment_failed"
      ? "past_due"
      : event.type === "customer.subscription.deleted"
        ? "canceled"
        : firstString(object.status) ?? "active";
    await upsertStripeMembership({
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: firstString(object.customer),
      plan: resolvePlan(object),
      status,
      currentPeriodEnd: secondsToDate(object.current_period_end),
      cancelAtPeriodEnd: object.cancel_at_period_end === true,
      eventId: event.id,
    });
  }

  res.status(200).json({ received: true });
}
