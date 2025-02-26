import { NextResponse } from "next/server";
import connectDB from "@/app/db/db";
import Department from "../model";

export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const { sectionId, sectionName } = await req.json(); // Ahora esperamos el id de la sección y el nuevo nombre

  try {
    const department = await Department.findById(id);

    if (!department) {
      return NextResponse.json(
        {
          message: "Departamento no encontrado",
          error: "Departamento no encontrado",
        },
        { status: 404 }
      );
    }

    // Buscamos la sección por su ID y la actualizamos
    const sectionIndex = department.sections.findIndex(
      (sec) => sec._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
      return NextResponse.json(
        {
          message: "Sección no encontrada",
          error: "Sección no encontrada",
        },
        { status: 404 }
      );
    }

    department.sections[sectionIndex].name = sectionName; // Actualizamos el nombre de la sección
    await department.save();

    return NextResponse.json(
      {
        message: "Sección actualizada correctamente",
        departamento: department,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en PUT: ", err); // Imprime el error en la consola del servidor
    return NextResponse.json(
      { message: "Error al actualizar la sección", error: err.message || err },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  await connectDB();
  const { id } = await params; // El ID del departamento
  const { sectionName } = await req.json();

  try {
    const department = await Department.findById(id);

    if (!department) {
      return NextResponse.json(
        {
          message: "Departamento no encontrado",
          error: "Departamento no encontrado",
        },
        { status: 404 }
      );
    }

    // Crear una nueva sección y agregarla al departamento
    const newSection = { name: sectionName };
    department.sections.push(newSection);
    await department.save();

    // Devolver la nueva sección en la respuesta
    return NextResponse.json(
      {
        message: "Sección agregada correctamente",
        section: newSection,
        departamento: department,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error al agregar la sección", error: err },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id, sectionId } = params;
  const { newSectionName } = await req.json();

  try {
    await connectDB();

    const department = await Department.findById(id);
    if (!department) {
      return new Response(
        JSON.stringify({ message: "Departamento no encontrado" }),
        { status: 404 }
      );
    }

    const section = department.sections.id(sectionId); // Busca la sección dentro del departamento
    if (!section) {
      return new Response(
        JSON.stringify({ message: "Sección no encontrada" }),
        { status: 404 }
      );
    }

    // Actualiza el nombre de la sección
    section.name = newSectionName;

    await department.save();

    return new Response(
      JSON.stringify({
        message: "Sección editada correctamente",
        section,
        departamento: department,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al editar la sección:", error);
    return new Response(
      JSON.stringify({ message: "Error al editar la sección" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id, sectionId } = params;

  try {
    const department = await Department.findById(id);
    if (!department) {
      return NextResponse.json(
        {
          message: "Departamento no encontrado",
          error: "Departamento no encontrado",
        },
        { status: 404 }
      );
    }

    const section = department.sections.id(sectionId);
    if (!section) {
      return NextResponse.json(
        { message: "Sección no encontrada", error: "Sección no encontrada" },
        { status: 404 }
      );
    }

    section.remove();
    await department.save();

    return NextResponse.json(
      { message: "Sección eliminada correctamente", departamento: department },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error al eliminar la sección", error: err },
      { status: 500 }
    );
  }
}
