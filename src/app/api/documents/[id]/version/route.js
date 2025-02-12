export async function PUT(req, { params }) {
    await connectDB()
    const [
        { version, date, filename },
        { id },
    ] = await Promise.all([
        req.json(),
        params,
    ]);
    const author = req.cookie.get("userId");

    try {
        await Doc.updateOne(
            { _id: id },
            {
                $set: {
                    currentVersion: {
                        version,
                        date,
                        author,
                        filename,
                    }
                },
                $push: {
                    versions: {
                        // Needed for $sort
                        $each: [
                            {
                                version,
                                date,
                                author,
                                filename,
                            }
                        ],
                        // Ensure the array remains sorted by version DESC
                        $sort: {
                            version: -1,
                        }
                    }
                }
            },
        );

        return NextResponse.json(
            {
                message: "El archivo para el documento fue actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (err) {
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
