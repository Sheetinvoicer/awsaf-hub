import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    // Get email directly from the frontend
    const { email } = await req.json();

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/strategy?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/strategy?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('STRIPE CHECKOUT ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}