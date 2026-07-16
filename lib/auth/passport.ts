import { Strategy as LocalStrategy } from "passport-local"
import passport from "passport"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { jwtStrategy } from "./jwt-strategy"

export interface UserPayload {
  id: string
  email: string
  name: string | null
}

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          return done(null, false, { message: "Invalid email or password" })
        }
        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
          return done(null, false, { message: "Invalid email or password" })
        }
        const payload: UserPayload = {
          id: user.id,
          email: user.email,
          name: user.name,
        }
        return done(null, payload)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.use("jwt", jwtStrategy)

function createMockReq(): any {
  return { body: {}, cookies: {} }
}

type AuthSuccess = { user: UserPayload }
type AuthFailure = { error: { message: string } }
export type AuthResult = AuthSuccess | AuthFailure

export function authenticateLocal(
  email: string,
  password: string
): Promise<AuthResult> {
  return new Promise((resolve) => {
    const req = createMockReq()
    req.body = { email, password }
    const res: any = {}
    const next = () => {}

    passport.authenticate(
      "local",
      { session: false },
      (
        err: Error | null,
        user: UserPayload | false,
        info: { message?: string } | undefined
      ) => {
        if (err) {
          return resolve({ error: { message: "Internal authentication error" } })
        }
        if (!user) {
          return resolve({
            error: { message: info?.message ?? "Invalid credentials" },
          })
        }
        return resolve({ user })
      }
    )(req, res, next)
  })
}

export function authenticateJwt(token: string): Promise<AuthResult> {
  return new Promise((resolve) => {
    const req = {
      headers: { authorization: `Bearer ${token}` },
      cookies: { token },
    }
    const res: any = {}
    const next = () => {}

    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error | null, user: UserPayload | false) => {
        if (err) {
          return resolve({ error: { message: "Internal authentication error" } })
        }
        if (!user) {
          return resolve({ error: { message: "Unauthorized" } })
        }
        return resolve({ user })
      }
    )(req, res, next)
  })
}

export { passport }
