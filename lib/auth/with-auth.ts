import { NextRequest, NextResponse } from "next/server"
import { authenticateJwt, type UserPayload } from "./passport"

export interface AuthContext {
  user: UserPayload
}

type ApiHandler = (
  request: NextRequest,
  context: AuthContext
) => Promise<NextResponse>

export function withAuth(handler: ApiHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authHeader = request.headers.get("authorization")
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await authenticateJwt(token)

    if ("error" in result) {
      return NextResponse.json({ error: result.error.message }, { status: 401 })
    }

    return handler(request, { user: result.user })
  }
}
