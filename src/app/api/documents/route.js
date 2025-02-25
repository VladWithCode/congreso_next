import { NextResponse } from "next/server"
import { Types } from "mongoose"
import p from "node:path"
import { writeFile } from "node:fs/promises"
import path from "node:path"
import connectDB from "@/app/db/db"
import Doc from "./model"
import Department from "@/app/api/departments/model"
import { cookies } from "next/headers"

export const DOC_PUBLIC_PATH = process.env.PUBLIC_PATH || "./public/uploads"

export async function GET(req) {
  await connectDB()
  const limit = req.nextUrl.searchParams.limit || 20
  const offset = (req.nextUrl.searchParams.page || 0) * limit
  const docs = await Doc.find().limit(limit).skip(offset)

  return NextResponse.json(
    {
      message: "Listado de documentos",
      docs,
    },
    { status: 200 }
  )
}

export async function POST(req) {
  await connectDB()
  const cookieStore = await cookies()

  const data = await req.formData()
  const name = data.get("name")
  const departmentId = data.get("department")
  const sectionId = data.get("section")
  const key = data.get("key")
  const author = cookieStore.get("userId").value
  /** @type {File} */
  const file = data.get("file")
  const ext = p.extname(file.name)

  let dept
  try {
    dept = await Department.findById(departmentId)
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error al recuperar el departamento",
        error: "query error",
      },
      { status: 500 }
    )
  }
  if (!dept) {
    return NextResponse.json(
      {
        message: "Departamento no encontrado",
        error: "invalid department",
      },
      { status: 400 }
    )
  }
  let section
  for (let s of dept.sections) {
    if (s._id.toString() === sectionId) {
      section = s
      break
    }
  }
  if (!section) {
    return NextResponse.json(
      {
        message: "Sección no encontrada",
        error: "invalid section",
      },
      { status: 400 }
    )
  }

  const currentVersion = {
    _id: new Types.ObjectId(),
    version: 1,
    date: Date.now(),
    author,
    filename: "",
  }

  const doc = new Doc({
    _id: new Types.ObjectId(),
    name,
    department: departmentId,
    section: sectionId,
    key,
    currentVersion: {},
    versions: [],
  })

  const arrBuf = await file.arrayBuffer()
  const buf = Buffer.from(arrBuf)
  const safeDept = dept.name.replace(/[^a-zA-Z0-9]/g, "-")
  const safeSection = section.name.replace(/[^a-zA-Z0-9]/g, "-")
  const finalFilename = `${safeDept}-${safeSection}-${key}-${name}-v${currentVersion.version}${ext}`
  try {
    await writeFile(path.join(DOC_PUBLIC_PATH, finalFilename), buf)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {
        message: "Error al guardar el archivo",
        error: err,
      },
      { status: 500 }
    )
  }
  doc.filename = finalFilename
  currentVersion.filename = finalFilename
  doc.currentVersion = currentVersion
  doc.versions.push(currentVersion)

  try {
    const d = await doc.save()
    return NextResponse.json(
      {
        message: "Documento creado correctamente",
        id: d._id,
      },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error al crear el documento",
        error: err,
      },
      { status: 500 }
    )
  }
}
