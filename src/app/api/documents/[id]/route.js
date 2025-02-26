import connectDB from "@/app/db/db"
import Doc from "./model"

export async function GET(_, { params }) {
  await connectDB()
  const { id } = await params

  const doc = await Doc.findById(id)

  if (!doc) {
    return NextResponse.json(
      {
        message: "Documento no encontrado",
        error: "Documento no encontrado",
      },
      { status: 404 }
    )
  }

  return NextResponse.json(
    {
      message: "Documento encontrado",
      doc,
    },
    { status: 200 }
  )
}

export async function PUT(req, { params }) {
  await connectDB()
  const [{ name, department, section, key }, { id }] = await Promise.all([
    req.json(),
    params,
  ])

  try {
    await Doc.updateOne(
      { _id: id },
      {
        $set: {
          name,
          department,
          section,
          key,
        },
      }
    )

    return NextResponse.json(
      {
        message: "Documento actualizado correctamente",
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error al actualizar el documento",
        error: err,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_, { params }) {
  await connectDB()
  const { id } = await params
  await Doc.deleteOne({ _id: id })
}
