import { NextResponse } from "next/server";
import connectDB from "@/app/db/db";
import Department from "./model";

const DEFAULT_LIMIT = 20;

export async function GET(req) {
    await connectDB()
    const limit = req.nextUrl.searchParams.limit || DEFAULT_LIMIT;
    const offset = (req.nextUrl.searchParams.page || 0) * limit;
    const departamentos = await Department
        .find()
        .limit(limit)
        .skip(offset);

    return NextResponse.json(
        {
            message: "Listado de departamentos",
            departamentos
        },
        { status: 200 }
    );
}

export async function POST(req) {
    await connectDB()
    const {
        name,
        sections,
    } = await req.json();

    const departamento = new Department({
        name,
        sections,
    });

    try {
        const d = await departamento.save();
        return NextResponse.json(
            {
                message: "Departamento creado correctamente",
                id: d._id,
            },
            { status: 201 }
        )
    } catch (err) {
        return NextResponse.json(
            {
                message: "Error al crear el departamento",
                error: err
            },
            { status: 500 }
        );
    }
}
