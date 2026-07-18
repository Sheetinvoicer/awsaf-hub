import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  try {
    const { taskId, isCompleted } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // Update the task in the Neon database
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: isCompleted },
    });

    // BONUS: If they completed the task, check if all 5 are done.
    if (isCompleted) {
      const strategyTasks = await prisma.task.findMany({
        where: { strategyId: updatedTask.strategyId },
      });

      const allCompleted = strategyTasks.every(task => task.isCompleted);

      if (allCompleted && strategyTasks.length > 0) {
        console.log("🎉 User completed all tasks! Triggering celebration email.");
      }
    }

    return NextResponse.json({ success: true, task: updatedTask });

  } catch (error) {
    console.error("TASK TOGGLE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}