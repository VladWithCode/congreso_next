import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/app/db/db";
import User from "./model";

const DEFAULT_LIMIT = 10;

export async function GET(req) {
  await connectDB();
  const limit = parseInt(
    req.nextUrl.searchParams.get("limit") || DEFAULT_LIMIT
  );
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || 0);

  try {
    // Buscar todos los usuarios pero excluir el campo password
    const usuarios = await User.find({}, { password: 0 })
      .limit(limit)
      .skip(offset);

    return NextResponse.json(
      {
        message: "Listado de usuarios",
        usuarios,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    return NextResponse.json(
      {
        message: "Error al obtener usuarios",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  const {
    username,
    password,
    departamento,
    role = "user", // Valor por defecto
  } = await req.json();

  // Verificar campos obligatorios
  if (!username || !password || !departamento) {
    return NextResponse.json(
      {
        message:
          "Nombre de usuario, contraseña y departamento son obligatorios",
      },
      { status: 400 }
    );
  }

  let hashedPw;
  try {
    hashedPw = await bcrypt.hash(password, 10);
  } catch (err) {
    console.error("Error al encriptar la contraseña:", err);
    return NextResponse.json(
      {
        message: "Error al encriptar la contraseña",
        error: err.message,
      },
      { status: 500 }
    );
  }

  // Crear usuario solo con los campos que existen en el modelo
  const usuario = new User({
    username,
    password: hashedPw,
    departamento,
    role,
  });

  try {
    const u = await usuario.save();
    return NextResponse.json(
      {
        message: "Usuario creado correctamente",
        id: u._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error al crear usuario:", err);

    // Verificar si es un error de duplicado (username único)
    if (err.code === 11000) {
      return NextResponse.json(
        {
          message: "El nombre de usuario ya existe",
          error: "Duplicado",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Error al crear el usuario",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
