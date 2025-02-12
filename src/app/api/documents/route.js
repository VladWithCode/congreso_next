import connectDB from "@/app/db/db";
import Doc from "./model";

export async function GET(req) {
    await connectDB()
    const limit = req.nextUrl.searchParams.limit || 20;
    const offset = (req.nextUrl.searchParams.page || 0) * limit;
    const docs = await Doc
        .find()
        .limit(limit)
        .skip(offset);

    return NextResponse.json(
        {
            message: "Listado de documentos",
            docs
        },
        { status: 200 }
    );
}

export async function POST(req) {
    await connectDB()
    const {
        name,
        department,
        section,
        filename,
    } = await req.json();

    const currentVersion = {
        version: 1,
        date: Date.now(),
        author: req.cookie.get("userId"),
        filename,
    }

    const doc = new Doc({
        name,
        department,
        section,
        filename,
        currentVersion: currentVersion,
        versions: [currentVersion],
    });

    try {
        const d = await doc.save();
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
                error: err
            },
            { status: 500 }
        );
    }
}
