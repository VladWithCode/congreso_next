import { SignJWT, jwtVerify } from "jose"

const secret = process.env.JWT_SECRET
const alg = "HS256"

export function sign(payload, opts = {}) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(opts.expiresIn || "30m")
        .sign(secret)
}

export function verify(token) {
    return jwtVerify(token, secret, {
        algorithms: [alg],
    })
}

