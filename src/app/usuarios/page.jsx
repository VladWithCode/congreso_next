"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [departamento, setDepartamento] = useState(""); // Corregido
  const [role, setRole] = useState("user");
  const [departamentos, setDepartamentos] = useState([]); // Lista de departamentos
  const [error, setError] = useState(null);
  const router = useRouter();

  // Cargar departamentos desde la API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        console.log("Departamentos obtenidos:", data); // 🚀 Verifica si se obtienen datos
        setDepartamentos(data.departamentos || []);
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          departamento,
          role,
        }),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data); // Log para depuración

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      alert("Usuario registrado correctamente");
      router.push("/admin");
    } catch (err) {
      console.error("Error completo:", err); // Log más detallado
      setError(err.message);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Image src="/assets/logo.png" alt="Logo" width={50} height={50} />
            <h1 className="text-xl font-bold">REGISTRO DE USUARIOS</h1>
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-700 hover:underline">
              Inicio
            </Link>
            <Link href="/admin" className="text-gray-700 hover:underline">
              Admin
            </Link>
            <Link href="/documents" className="text-gray-700 hover:underline">
              Documentos
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="bg-gray-200 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">
            Registrar Usuario
          </h2>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Usuario:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium">Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium">Departamento:</label>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-lg"
              >
                <option value="">Selecciona un departamento</option>
                {departamentos.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Rol:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-lg"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 shadow-md"
            >
              Registrar
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-gray-600">
        © {new Date().getFullYear()} Congreso del Estado de Durango. Todos los
        derechos reservados.
      </footer>
    </div>
  );
}
