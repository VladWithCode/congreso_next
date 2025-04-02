"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Para redirigir
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Documentos() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const router = useRouter(); // Para manejar la navegación

  // Obtener los departamentos y sus secciones
  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch("/api/departments");
      if (res.ok) {
        const data = await res.json();
        setDepartments(data.departamentos);
      }
    };
    fetchDepartments();
  }, []);

  // Manejar la selección de un departamento
  const handleDepartmentClick = (departmentId) => {
    setSelectedDepartment(
      selectedDepartment === departmentId ? null : departmentId
    );
  };

  // Navegar a la pantalla de una sección
  const handleSectionClick = (sectionId) => {
    router.push(`/documentos/${sectionId}`);
  };

  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md w-full">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <img src="/assets/logo.png" alt="Logo" width={48} height={48} />
            <h2 className="text-3xl font-bold text-gray-900">
              CONTROL DOCUMENTAL
            </h2>
          </div>
          <Link
            href="/home"
            className="text-lg font-bold underline text-gray-900 hover:text-gray-700"
          >
            Salir
          </Link>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex-grow bg-gray-200 py-16 flex flex-col items-center">
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
                {selectedDepartment === department._id ? (
                  <IoIosArrowUp className="text-gray-600" />
                ) : (
                  <IoIosArrowDown className="text-gray-600" />
                )}
              </div>

              {/* Mostrar las secciones si el departamento está seleccionado */}
              {selectedDepartment === department._id && (
                <div className="mt-2 pl-4">
                  {department.sections.length > 0 ? (
                    department.sections.map((section) => (
                      <div
                        key={section._id}
                        onClick={() => handleSectionClick(section._id)}
                        className="p-2 bg-gray-100 rounded mb-1 hover:bg-gray-200 cursor-pointer"
                      >
                        {section.name}
                      </div>
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
