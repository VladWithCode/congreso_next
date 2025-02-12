import jwt from "jsonwebtoken"

export default async function middleware(req) {
    const token = req.cookies.get("ident")
    if (!token) {
        if (req.method === "GET") {
            return NextResponse.redirect("/login")
        } else {
            return NextResponse.json({
                message: "Error de autenticación. No se proporcionó token",
                error: "No token"
            }, {
                status: 401
            })
        }
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, payload) => {
            if (err) {
                return NextResponse.json({
                    message: "Error de autenticación. Token inválido",
                    error: err
                }, {
                    status: 401
                })
            }

            req.cookie.set("role", payload.role)
            req.cookie.set("userId", payload.uid)
        }
    )
    return NextResponse.next()
}

export const config = {
    matcher: "/api/:path*",
}

