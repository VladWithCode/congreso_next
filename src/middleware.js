import { NextResponse } from "next/server"
import * as jwt from "@/app/lib/jwt/jwt"

const ADMIN_PATHS = [
    "/api/users",
    "/api/users/:id",
    "/api/departments",
    "/api/departments/:id",
    "/api/documents",
    "/api/documents/:id",
]

export async function middleware(req) {
    if (
        req.method === "GET"
        || req.nextUrl.pathname === "/api/auth"
        || req.nextUrl.pathname === "/iniciar-sesion"
    ) {
        return NextResponse.next()
    }

    const tokenCookie = req.cookies.get("ident")
    if (!tokenCookie) {
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

    let tokenPayload;
    try {
        tokenPayload = await jwt.verify(tokenCookie.value)
        req.cookies.set("role", tokenPayload.role)
        req.cookies.set("userId", tokenPayload.uid)
    } catch (err) {
        console.error(err)
        return NextResponse.json({
            message: "Error de autenticación. Token inválido",
            error: err
        }, {
            status: 401
        })
    }

    const path = req.nextUrl.pathname
    if (
        ADMIN_PATHS.includes(path)
        && tokenPayload.role !== "admin"
    ) {
        return NextResponse.json({
            message: "Error de autenticación. No cuentas con privilegios de administrador",
            error: "Unauthorized"
        }, {
            status: 403
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/api/:path*",
        "/:path+",
    ],
}

