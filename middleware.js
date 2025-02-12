import jwt from "jsonwebtoken"

export default async function middleware(req) {
    const rawToken = req.headers.get("Authorization")
    if (!rawToken) {
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

    const token = rawToken.split(" ")[1]
    if (token.length === 0) {
        if (req.method === "GET") {
            return NextResponse.redirect("/login")
        } else {
            return NextResponse.json({
                message: "Error de autenticación. Token malformado",
                error: "Malformed token"
            }, {
                status: 401
            })
        }
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) {
                return NextResponse.json({
                    message: "Error de autenticación. Token inválido",
                    error: err
                }, {
                    status: 401
                })
            }

            req.cookie.set("role", decoded.role)
            req.cookie.set("username", decoded.username)
        }
    )
    return NextResponse.next()
}

export const config = {}

