import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/app/db/db";
import User from "../model";

export async function GET(_, { params }) {
  await connectDB();
  const { id } = await params;

  const usuario = await User.findById(id);

  if (!usuario) {
    return NextResponse.json(
      {
        message: "Usuario no encontrado",
        error: "Usuario no encontrado",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: "Usuario encontrado",
      usuario,
    },
    { status: 200 }
  );
}

export async function PUT(req, { params }) {
  await connectDB();
  const { username, password, departamento, role } = await req.json();
  const { id } = params;

  // Objeto para actualizar solo con los campos que existen en el modelo
  const updateData = {};

  if (username) updateData.username = username;
  if (departamento) updateData.departamento = departamento;
  if (role) updateData.role = role;

  // Si hay contraseña, encriptarla
  if (password) {
    try {
      updateData.password = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error("Error al encriptar contraseña:", err);
      return NextResponse.json(
        {
          message: "Error al encriptar la contraseña",
          error: err.message,
        },
        { status: 500 }
      );
    }
  }

  try {
    const resultado = await User.updateOne({ _id: id }, { $set: updateData });

    if (resultado.modifiedCount === 0) {
      return NextResponse.json(
        {
          message: "No se encontró el usuario o no se realizaron cambios",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Usuario actualizado correctamente",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al actualizar usuario:", err);

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
        message: "Error al actualizar el usuario",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const resultado = await User.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        {
          message: "No se encontró el usuario",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Usuario eliminado correctamente",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    return NextResponse.json(
      {
        message: "Error al eliminar el usuario",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
