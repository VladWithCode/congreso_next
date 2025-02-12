import { NextResponse } from "next/server";
import User from "@/app/api/users/model";

export async function POST(req) {
    await connectDB()
    const {
        email,
        password,
    } = await req.json();

    const usuario = await User.findOne({ email });

    if (!usuario) {
        return new NextResponse.json(
            {
                message: "Email no registrado",
                error: "user not found"
            },
            { status: 404 }
        );
    }

    let valid;
    try {
        valid = await bcrypt.compare(password, usuario.password);
    } catch (err) {
        return new NextResponse.json(
            {
                message: "Error al comparar la contraseña",
                error: err
            },
            { status: 500 }
        );
    }

    if (!valid) {
        return new NextResponse.json(
            {
                message: "Contraseña incorrecta",
                error: "wrong password"
            },
            { status: 401 }
        );
    }

    const token = jwt.sign(
        {
            uid: usuario._id,
            role: usuario.role
        },
        process.env.JWT_SECRET
    );

    const res = new NextResponse();
    res.cookies.set("ident", token);

    return res.json(
        {
            message: "Autenticado correctamente",
        },
        { status: 200 }
    );
}

export async function DELETE() {
    const res = new NextResponse();
    res.cookies.delete("ident");
    return res.redirect("/", 302);
}
