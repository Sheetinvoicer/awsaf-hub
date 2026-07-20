import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;

    if (email) {
      if (session.mode === 'subscription') {
        // PRO SUBSCRIPTION ($100/mo)
        await prisma.user.updateMany({
          where: { email },
          data: { 
            isPremium: true,
            reportsThisMonth: 0,
            lastReportReset: new Date()
          },
        });
        console.log(`🎉 User ${email} upgraded to Pro!`);
      } else if (session.mode === 'payment') {
        // EXTRA REPORT ($25)
        await prisma.user.updateMany({
          where: { email },
          data: { 
            bonusReports: { increment: 1 } 
          },
        });
        console.log(`💎 User ${email} bought an extra report!`);
      }
    }
  }

  return NextResponse.json({ received: true });
}