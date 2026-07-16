export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import type { Platform } from "@prisma/client"

const LOCK_TTL_MS = 30_000

function isAuthorized(request: NextRequest): boolean {
  const secret =
    request.headers.get("x-cron-secret") ??
    request.nextUrl.searchParams.get("secret")

  return secret === process.env.CRON_SECRET
}

async function dispatchToSocialMedia(
  platform: Platform,
  content: string
): Promise<void> {
  console.log(
    `[dispatch] Publishing to ${platform}: "${content.slice(0, 80)}..."`
  )
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results: {
    postId: string
    platform: Platform
    status: "published" | "failed" | "skipped"
    error?: string
  }[] = []

  try {
    const overduePosts = await prisma.scheduledPost.findMany({
      where: {
        status: "PENDING",
        scheduledAt: { lte: new Date() },
      },
      select: { id: true, platform: true, content: true },
      orderBy: { scheduledAt: "asc" },
    })

    for (const post of overduePosts) {
      const lockKey = `lock:post:${post.id}`
      const locked = await redis.set(lockKey, "1", {
        nx: true,
        px: LOCK_TTL_MS,
      })

      if (!locked) {
        results.push({
          postId: post.id,
          platform: post.platform,
          status: "skipped",
        })
        continue
      }

      try {
        await dispatchToSocialMedia(post.platform, post.content)

        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: "PUBLISHED" },
        })

        results.push({
          postId: post.id,
          platform: post.platform,
          status: "published",
        })
      } catch (dispatchError) {
        const message =
          dispatchError instanceof Error
            ? dispatchError.message
            : "Unknown dispatch error"

        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: "FAILED" },
        })

        results.push({
          postId: post.id,
          platform: post.platform,
          status: "failed",
          error: message,
        })
      } finally {
        await redis.del(lockKey)
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
