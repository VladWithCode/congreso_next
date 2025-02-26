import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
const alg = "HS256"

export function sign(payload, opts = {}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(opts.expiresIn || "30m")
    .sign(secret)
}

export async function verify(token) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: [alg],
  })
  return payload
}
