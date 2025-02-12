import connectDB from "@/app/db/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "@/app/lib/jwt/jwt";
import User from "@/app/api/users/model";

export async function POST(req) {
    await connectDB()
    const {
        username,
        password,
    } = await req.json();

    const usuario = await User.findOne({ username });

    if (!usuario) {
        return NextResponse.json(
            {
                message: "Email no registrado",
                error: "user not found"
            },
            { status: 404 }
        );
    }

    let valid;
    try {
        valid = await bcrypt.compare(password, usuario.password);
    } catch (err) {
        return NextResponse.json(
            {
                message: "Error al comparar la contraseña",
                error: err
            },
            { status: 500 }
        );
    }

    if (!valid) {
        return NextResponse.json(
            {
                message: "Contraseña incorrecta",
                error: "wrong password"
            },
            { status: 401 }
        );
    }

    const token = jwt.sign(
        {
            uid: usuario._id,
            role: usuario.role
        },
        process.env.JWT_SECRET
    );

    const res = new NextResponse(JSON.stringify({ message: "Autenticado correctamente" }), { status: 200 });
    res.cookies.set("ident", token);
    res.headers.set("Content-Type", "application/json");
    return res;
}

export async function DELETE() {
    const res = new NextResponse();
    res.cookies.delete("ident");
    return res.redirect("/", 302);
}
