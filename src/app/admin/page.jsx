"use client"; // Para manejar estado en Next.js

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      if (data.role === "user") {
        router.push("/oficinas"); // Cambia esto a la pantalla correcta
      } else {
        setError("No tienes permisos de administrador.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md w-full animate-fadeIn">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <Image src="/assets/logo.png" alt="Logo" width={48} height={48} />
            <h2 className="text-3xl font-bold text-gray-900">CONTROL DOCUMENTAL</h2>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-lg font-bold underline text-gray-900 hover:text-gray-700">
              Salir
            </a>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="flex-grow flex items-center justify-center relative">
        <Image
          src="/assets/logo_leyenda.png"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-contain opacity-10"
          width={1000}
          height={1000}
        />

        {/* Cuadro con formulario */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative z-10 animate-slideUp">
          <h2 className="text-xl font-semibold text-center mb-6">Iniciar Sesión</h2>
          <p className="text-center mb-6">
            Solo los administradores pueden acceder a esta sección.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium">
                Usuario:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full mt-1 p-2 border rounded-md text-gray-600 focus:ring focus:ring-gray-300 transition duration-300 hover:shadow-md"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full mt-1 p-2 border rounded-md text-gray-600 focus:ring focus:ring-gray-300 transition duration-300 hover:shadow-md"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner text-gray-600 text-sm">
        Copyright © H. Congreso del Estado de Durango
      </footer>
    </div>
  );
}
