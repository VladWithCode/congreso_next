"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [authStatus, setAuthStatus] = useState(null);
  const [role, setRole] = useState(""); // Variable para guardar el rol del usuario
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar el dropdown
  const dropdownRef = useRef(null); // Ref para el dropdown
  const router = useRouter();

  useEffect(() => {
    // Función de autenticación en el frontend
    const checkAuth = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ident="))
        ?.split("=")[1]; // Extraer el token de la cookie

      if (token) {
        // Decodificar el token JWT para obtener el rol del usuario
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el token
        setRole(payload.role); // Guardar el rol en el estado

        // Si el token está presente, ya está autenticado
        setAuthStatus("authenticated");
      } else {
        setAuthStatus("notAuthenticated");
      }
    };

    checkAuth();
  }, []);

  // Detectar clic fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (authStatus === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="bg-white w-full shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Image src="/assets/logo.png" alt="Logo" width={80} height={80} />
            <h2 className="text-3xl font-bold text-gray-900">
              CONTROL DOCUMENTAL
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Mostrar los botones de acuerdo al rol */}
            {role === "admin" && (
              <>
                <Link
                  href="/documentos"
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                >
                  Documentos
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Alterna la visibilidad del dropdown
                    className="text-lg font-semibold underline text-gray-900 hover:text-gray-700"
                  >
                    Admin
                  </button>
                  {/* Mostrar el dropdown si el estado está activado */}
                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-48 text-gray-900 rounded-md z-10"
                    >
                      <Link
                        href="/lista-maestra"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Lista Maestra
                      </Link>
                      <Link
                        href="/registro"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Registro
                      </Link>
                      <Link
                        href="/control-de-versiones"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Control de Versiones
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
            {role === "usuario" && (
              <Link
                href="/documentos"
                className="text-lg font-semibold text-gray-900 hover:text-gray-700"
              >
                Documentos
              </Link>
            )}
            <Link
              href="/"
              className="text-lg font-bold text-gray-900 hover:text-gray-700"
            >
              Salir
            </Link>
          </div>
        </div>
        <hr className="w-full border-t-2 border-gray-300" />
      </div>

      <div className="py-16">
        <hr className="w-full border-t-4 border-black mb-4" />
        <h1 className="text-3xl font-serif text-gray-900 whitespace-nowrap text-center mx-auto">
          Uso exclusivo para el personal del H. Congreso del Estado de Durango
        </h1>
        <hr className="w-full border-t-4 border-black mt-4" />
        <img
          className="w-8/12 h-[500px] object-fill mt-8 mx-auto"
          src="/assets/logo_leyenda.png"
          alt="Imagen de leyenda"
        />
      </div>

      <footer className="bg-white text-center py-2 shadow-inner text-gray-600 text-sm mt-14">
        Copyright © H. Congreso del Estado de Durango
      </footer>
    </div>
  );
}
