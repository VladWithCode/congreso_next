import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import p from "node:path";
import { writeFile } from "node:fs/promises";
import { Types } from "mongoose";
import connectDB from "@/app/db/db";
import "@/app/api/departments/model";
import Doc from "../../model";
import { DOC_PUBLIC_PATH } from "../../route";

export async function PUT(req, { params }) {
    await connectDB()
    const cookieStore = await cookies()

    const [
        data,
        { id },
    ] = await Promise.all([
        req.formData(),
        params,
    ]);
    const file = data.get("file");
    const author = cookieStore.get("userId").value;

    let doc;
    try {
        doc = await Doc.findById({ _id: id }).populate("department");
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            {
                message: "Error al recuperar el documento",
                error: err
            },
            { status: 500 }
        );
    }

    if (!doc) {
        return NextResponse.json(
            {
                message: "Documento no encontrado",
                error: "document not found"
            },
            { status: 404 }
        );
    }
    
    let sectionName = "";
    for (let s of doc.department.sections) {
        if (s._id.toString() === doc.section.toString()) {
            sectionName = s.name;
            break;
        }
    }

    const date = data.get("date") || Date.now();
    const version = data.get("version") || doc.currentVersion.version + 1;
    const safeDept = doc.department.name.replace(/[^a-zA-Z0-9]/g, "-");
    const safeSection = sectionName.replace(/[^a-zA-Z0-9]/g, "-");
    const finalFilename = `${safeDept}-${safeSection}-${doc.key}-${doc.name}-v${version}${p.extname(file.name)}`;

    try {
        const arrBuf = await file.arrayBuffer();
        const buf = Buffer.from(arrBuf);
        await writeFile(p.join(DOC_PUBLIC_PATH, finalFilename), buf);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                message: "Error al guardar el archivo",
                error: err
            },
            { status: 500 }
        );
    }

    try {
        const versionId = new Types.ObjectId();
        await Doc.updateOne(
            { _id: id },
            {
                $set: {
                    currentVersion: {
                        _id: versionId,
                        version,
                        date,
                        author,
                        filename: finalFilename,
                    },
                    filename: finalFilename,
                },
                $push: {
                    versions: {
                        // needed for $sort
                        $each: [
                            {
                                _id: versionId,
                                version,
                                date,
                                author,
                                filename: finalFilename,
                            }
                        ],
                        // ensure the array remains sorted by version desc
                        $sort: {
                            version: -1,
                        }
                    }
                }
            },
        );

        return NextResponse.json(
            {
                message: "Archivo para el documento actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            {
                message: "Error al actualizar el archivo para el documento",
                error: err
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    await connectDB()
    const [
        { fileId },
        { id },
    ] = await Promise.all([
        req.json(),
        params,
    ]);

    try {
        await Doc.updateOne(
            { _id: id },
            {
                $pull: {
                    versions: {
                        _id: fileId
                    }
                },
                $set: {
                    currentVersion: "$versions.$[0]",
                }
            }
        );

        return NextResponse.json(
            {
                message: "El archivo para el documento fue borrado correctamente",
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            {
                message: "Error al borrar el archivo para el documento",
                error: err
            },
            { status: 500 }
        );
    }
}
