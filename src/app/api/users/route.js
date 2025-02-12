import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import connectDB from "@/app/db/db";
import User from "./model";

const DEFAULT_LIMIT = 10;

export async function GET(req) {
    await connectDB()
    const limit = req.nextUrl.searchParams.limit || DEFAULT_LIMIT;

    const usuarios = await User
        .find({ password: false })
        .limit(limit)
        .skip(req.nextUrl.searchParams.offset || 0);

    return new NextResponse.json(
        {
            message: "Listado de usuarios",
            usuarios
        },
        { status: 200 }
    );
}

export async function POST(req) {
    await connectDB()
    const {
        nombre,
        username,
        password,
        departamento,
        role,
        email
    } = await req.json();

    let hashedPw;

    try {
        hashedPw = await bcrypt.hash(password, 10);
    } catch (err) {
        return new NextResponse.json(
            {
                message: "Error al encriptar la contraseña",
                error: err
            },
            { status: 500 }
        );
    }

    const usuario = new User({
        nombre,
        username,
        departamento,
        role,
        email
    });

    try {
        const u = await usuario.save();
        return new NextResponse.json(
            {
                message: "Usuario creado correctamente",
                id: u._id,
            },
            { status: 201 }
        )
    } catch (err) {
        return new NextResponse.json(
            {
                message: "Error al crear el usuario",
                error: err
            },
            { status: 500 }
        );
    }
}

