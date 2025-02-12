import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/app/db/db";
import User from "../model";

export async function GET(_, { params }) {
    await connectDB()
    const { id } = await params;

    const usuario = await User.findById(id);

    if (!usuario) {
        return NextResponse.json(
            {
                message: "Usuario no encontrado",
                error: "Usuario no encontrado"
            },
            { status: 404 }
        );
    }

    return NextResponse.json(
        {
            message: "Usuario encontrado",
            usuario
        },
        { status: 200 }
    );
}

export async function PUT(req, { params }) {
    await connectDB()
    const {
        nombre,
        username,
        password,
        departamento,
        role,
        email,
    } = await req.json();
    const { id } = await params;

    let newPass;
    if (password) {
        try {
            newPass = await bcrypt.hash(password, 10);
        } catch (err) {
            return NextResponse.json(
                {
                    message: "Error al encriptar la contraseña",
                    error: err
                },
                { status: 500 }
            );
        }
    }

    try {
        await User.updateOne(
            { _id: id },
            {
                $set: {
                    nombre,
                    username,
                    departamento,
                    role,
                    email,
                    password: newPass
                }
            }
        );

        return NextResponse.json(
            {
                message: "Usuario actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            {
                message: "Error al actualizar el usuario",
                error: err
            },
            { status: 500 }
        );
    }
}

export async function DELETE(_, { params }) {
    await connectDB()
    const { id } = await params;
    await User.deleteOne({ _id: id });
}
