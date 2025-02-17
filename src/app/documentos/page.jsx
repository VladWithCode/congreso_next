"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Importa Link para las rutas
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"; // Iconos de flecha

export default function Documentos() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Para gestionar el departamento seleccionado

  // Función para obtener los departamentos
  const fetchDepartments = async () => {
    const res = await fetch("/api/departments");
    if (res.ok) {
      const data = await res.json();
      setDepartments(data.departamentos); // Asegúrate de que el formato JSON sea correcto
    }
  };

  // Cargar departamentos al inicio
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Maneja el clic en el nombre del departamento
  const handleDepartmentClick = (departmentId) => {
    // Si el departamento ya está abierto, cerrarlo
    if (selectedDepartment === departmentId) {
      setSelectedDepartment(null);
    } else {
      setSelectedDepartment(departmentId); // Mostrar secciones
    }
  };

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
          {/* Botones dentro del navbar */}
          <div className="flex items-center gap-6 z-10">
            <Link
              href="/home" // Asegúrate de que la ruta apunte al inicio ("/")
              className="text-lg font-bold underline text-gray-900 hover:text-gray-700 text-right cursor-pointer"
            >
              Salir
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido con fondo gris claro */}
      <div className="flex-grow bg-gray-200 py-16 flex flex-col items-center justify-center min-h-screen relative">
        {/* Mostrar departamentos */}
        <ul className="w-full max-w-2xl">
          {departments.map((department) => (
            <li
              key={department._id}
              className="bg-white p-4 rounded mb-2 shadow hover:bg-gray-100 cursor-pointer"
            >
              <div
                onClick={() => handleDepartmentClick(department._id)}
                className="flex items-center justify-between text-xl font-semibold text-black underline"
              >
                <span>{department.name}</span>
                {/* Icono de flecha dependiendo de si está desplegado o no */}
                {selectedDepartment === department._id ? (
                  <IoIosArrowUp className="text-gray-600" />
                ) : (
                  <IoIosArrowDown className="text-gray-600" />
                )}
              </div>

              {/* Si el departamento está seleccionado, mostrar sus secciones */}
              {selectedDepartment === department._id && (
                <div className="mt-2 pl-4">
                  {department.sections.length > 0 ? (
                    department.sections.map((section, index) => (
                      <Link
                        key={index}
                        href={`/section/${section._id}`} // Redirige a la página de la sección
                      >
                        <div className="p-2 bg-gray-100 rounded mb-1 hover:bg-gray-200 cursor-pointer">
                          {section.name}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-500">
                      No hay secciones disponibles
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner text-gray-600 text-sm">
        Copyright © H. Congreso del Estado de Durango
      </footer>
    </div>
  );
}
