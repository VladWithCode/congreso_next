import bcrypt from "bcryptjs"
import connectDB from "./src/app/db/db"
import User from "./src/app/api/users/model"
import Department from "./src/app/api/departments/model"

async function initAdmin() {
    console.log("Start initAdmin()")
    try {
        console.log("Connecting to DB")
        await connectDB()
    } catch (err) {
        console.error("Error while connecting to DB")
        console.error(err)
        process.exit(1)
    }
    // Create control department
    const dept = new Department({
        name: "_control_dept",
        sections: [{
            name: "_control_sect",
        }],
    })
    let deptId;
    try {
        console.log("Creando departamento de control...")
        deptId = (await dept.save())._id
    } catch (err) {
        console.error("Error al crear el departamento de control")
        console.error(err)
        process.exit(1)
    }

    let pwd;
    try {
        console.log("Encriptando contraseña...")
        pwd = await bcrypt.hash("admin", 10)
    } catch (err) {
        console.error("Error al encriptar la contraseña")
        console.error(err)
        process.exit(1)
    }

    const user = new User({
        nombre: "Administrador",
        username: "luis",
        password: pwd,
        departamento: deptId,
        role: "admin",
        email: "luis@congreso.app",
    })
    try {
        console.log("Creando usuario...")
        await user.save()
    } catch (err) {
        console.error("Error al crear usuario")
        console.error(err)
        process.exit(1)
    }

    console.log("Se creo el usuario administrador con exito")
    process.exit(0)
}

initAdmin();
