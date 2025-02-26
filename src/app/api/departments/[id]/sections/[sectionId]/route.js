import { NextResponse } from "next/server";
import connectDB from "@/app/db/db";
import Department from "@/app/api/departments/model";

export async function DELETE(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id, sectionId } = params;

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

    const sectionIndex = department.sections.findIndex(
      (section) => section._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
      return NextResponse.json(
        { message: "Sección no encontrada", error: "Sección no encontrada" },
        { status: 404 }
      );
    }

    department.sections.splice(sectionIndex, 1);
    await department.save();

    return NextResponse.json(
      { message: "Sección eliminada correctamente", departamento: department },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en DELETE:", err);
    return NextResponse.json(
      { message: "Error al eliminar la sección", error: err.message },
      { status: 500 }
    );
  }
}