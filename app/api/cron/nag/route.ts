import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  // 1. Secure the route so only Vercel can trigger it
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Find all incomplete tasks past their due date
    const stalledTasks = await prisma.task.findMany({
      where: {
        isCompleted: false,
        dueDate: { lt: new Date() }
      },
      include: {
        user: true
      }
    });

    // 3. Group them by user email
    const usersToNag = new Map();
    for (const task of stalledTasks) {
      const email = task.user.email;
      if (!usersToNag.has(email)) {
        usersToNag.set(email, []);
      }
      usersToNag.get(email).push(task.description);
    }

    // 4. Send an email to each user via Resend
    for (const [email, tasks] of usersToNag.entries()) {
      await resend.emails.send({
        from: 'Awsaf Hub <alerts@awsaftrading.com>', // Note: You must verify this domain in Resend
        to: email,
        subject: '⚠️ Your DTC Warfare plan is stalled!',
        html: `<p>You have incomplete tasks in your Execution Battle Deck. Don't leave money on the table.</p><ul>${tasks.map((t: string) => `<li>${t}</li>`).join('')}</ul>`
      });
    }

    return NextResponse.json({ success: true, nagged: usersToNag.size });
  } catch (error) {
    console.error("NAG ENGINE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}