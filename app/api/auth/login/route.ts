export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { authenticateLocal } from "@/lib/auth/passport"
import { generateToken } from "@/lib/auth/jwt"
import { loginSchema } from "@/lib/validations/auth"
import { validateBody } from "@/lib/validations/validate"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = validateBody(loginSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    const result = await authenticateLocal(email, password)

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 401 }
      )
    }

    const { user } = result

    const token = generateToken({ userId: user.id, email: user.email })

    const response = NextResponse.json({ user, token })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
