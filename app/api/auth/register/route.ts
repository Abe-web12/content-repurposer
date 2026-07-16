export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/auth/jwt"
import { registerSchema } from "@/lib/validations/auth"
import { validateBody } from "@/lib/validations/validate"
import { sendWelcomeEmail } from "@/lib/email/resend"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = validateBody(registerSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true },
    })

    const token = generateToken({ userId: user.id, email: user.email })

    sendWelcomeEmail(user.email, user.name ?? user.email)

    const response = NextResponse.json({ user, token }, { status: 201 })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
