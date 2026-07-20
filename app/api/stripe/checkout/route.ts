import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any
});

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    if (type === 'extra_report') {
      // $25 ONE-OFF PAYMENT FOR EXTRA REPORT
      sessionConfig = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_EXTRA_REPORT_PRICE_ID!, // Using your new Env Variable
            quantity: 1
          }
        ],
        mode: 'payment',
        customer_email: email || undefined,
        success_url: `${req.headers.get('origin')}/dashboard?extra=true`,
        cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`
      };
    } else {
      // $100/MONTH SUBSCRIPTION
      sessionConfig = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID!,
            quantity: 1
          }
        ],
        mode: 'subscription',
        customer_email: email || undefined,
        success_url: `${req.headers.get('origin')}/dashboard?upgraded=true`,
        cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('STRIPE CHECKOUT ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
