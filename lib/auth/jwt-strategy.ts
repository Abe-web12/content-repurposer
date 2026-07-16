import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { prisma } from "@/lib/prisma"
import type { UserPayload } from "./passport"

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      (req) => {
        let token: string | null = null
        if (req && req.cookies) {
          token = req.cookies.token ?? null
        }
        return token
      },
    ]),
    secretOrKey: process.env.JWT_SECRET!,
  },
  async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true },
      })
      if (!user) return done(null, false)
      return done(null, user satisfies UserPayload)
    } catch (error) {
      return done(error)
    }
  }
)
