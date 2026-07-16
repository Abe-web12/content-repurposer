import { prisma } from "@/lib/prisma"

export interface QueueStatus {
  pendingCount: number
  publishedCount: number
  failedCount: number
}

export async function getQueueStatus(): Promise<QueueStatus> {
  const [pendingCount, publishedCount, failedCount] = await Promise.all([
    prisma.scheduledPost.count({ where: { status: "PENDING" } }),
    prisma.scheduledPost.count({ where: { status: "PUBLISHED" } }),
    prisma.scheduledPost.count({ where: { status: "FAILED" } }),
  ])

  return { pendingCount, publishedCount, failedCount }
}
