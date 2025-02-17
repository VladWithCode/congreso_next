"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth", {
          credentials: "include",
        });
        if (response.ok) {
          router.push("/home");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del formulario
    if (!usuario || !password) {
      alert("Por favor ingresa tu nombre de usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usuario,
          password: password,
        }),
        credentials: "include",
      });

      if (response.ok) {
        router.push("/home");
      } else {
        const data = await response.json();
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* Navbar con animación */}
      <nav className="bg-white shadow-md w-full animate-fadeIn">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <img src="/assets/logo.png" alt="Logo" width={48} height={48} />
            <h2 className="text-3xl font-bold text-gray-900">
              CONTROL DOCUMENTAL
            </h2>
          </div>
        </div>
      </nav>

      {/* Formulario de Login */}
      <div className="flex-grow flex items-center justify-center relative">
        {/* Imagen de fondo */}
        <img
          src="/assets/logo_leyenda.png"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-contain opacity-10"
        />
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative z-10 animate-slideUp">
          <h2 className="text-xl font-semibold text-center mb-6">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Campo Usuario */}
            <div className="mb-4">
              <label
                htmlFor="usuario"
                className="block text-gray-700 font-medium"
              >
                Nombre de Usuario:
              </label>
              <input
                type="text"
                id="usuario"
                placeholder="Ingresa tu nombre de usuario"
                className="w-full mt-1 p-2 border rounded-md text-gray-600 focus:ring focus:ring-gray-300 transition duration-300 hover:shadow-md"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                className="w-full mt-1 p-2 border rounded-md text-gray-600 focus:ring focus:ring-gray-300 transition duration-300 hover:shadow-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Botón de entrar */}
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300 active:scale-95"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Entrar"}
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
