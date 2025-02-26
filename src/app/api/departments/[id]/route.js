import connectDB from "@/app/db/db"
import Department from "../model"

export async function GET(_, { params }) {
  await connectDB()
  const { id } = await params

  const department = await Department.findById(id)

  if (!department) {
    return NextResponse.json(
      {
        message: "Departamento no encontrado",
        error: "Departamento no encontrado",
      },
      { status: 404 }
    )
  }

  return NextResponse.json(
    {
      message: "Departamento encontrado",
      departamento: department,
    },
    { status: 200 }
  )
}

export async function PUT(req, { params }) {
  await connectDB()
  const { name, sections } = await req.json()
  const { id } = await params

  try {
    await Department.updateOne(
      { _id: id },
      {
        $set: {
          name,
          sections,
        },
      }
    )

    return NextResponse.json(
      {
        message: "Departamento actualizado correctamente",
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error al actualizar el departamento",
        error: err,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_, { params }) {
  await connectDB()
  const { id } = await params
  await Department.deleteOne({ _id: id })
}
