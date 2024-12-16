import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { char } from "drizzle-orm/pg-core";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2024-11-20.acacia",
  });
  const sig = req.headers.get("stripe-signature") || "";
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  // Read the request body as text
  const reqText = await req.text();
  // Convert the text to a buffer
  const reqBuffer = Buffer.from(reqText);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  // Handle the event just an example!
  switch (event.type) {
    case "payment_intent.succeeded":
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        { expand: ["latest_charge"] }
      );
      const charge = retrieveOrder.latest_charge as Stripe.Charge;

      const customer = await db
        .update(orders)
        .set({ status: "succeeded", receiptURL: charge.receipt_url })
        .where(eq(orders.paymentIntentID, event.data.object.id))
        .returning();
      console.log("CHARGE RECIEPT URL: " + charge.receipt_url);
      console.log("CHARGE:" + charge);

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
