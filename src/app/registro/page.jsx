"use client";

import { useState, useEffect } from "react";
import {
  FaTrash,
  FaPlus,
  FaFolder,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/router";

export default function RegistroAdmin() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [newSection, setNewSection] = useState("");
  const [editingSection, setEditingSection] = useState(null); // Para manejar la edición de secciones
  const [sectionToEdit, setSectionToEdit] = useState("");

  // Obtener los departamentos desde la base de datos al cargar la página
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        setDepartments(data.departamentos); // La API devuelve `{ message, departamentos }`
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Alternar el estado "abierto" de un departamento
  const toggleDepartment = (id) => {
    setDepartments(
      departments.map((dep) =>
        dep._id === id ? { ...dep, abierto: !dep.abierto } : dep
      )
    );
  };

  // Agregar un nuevo departamento y enviarlo a la base de datos
  const addDepartment = async () => {
    if (newDepartment.trim() === "") return;

    const newDep = { name: newDepartment, sections: [] };

    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDep),
      });

      if (res.ok) {
        const data = await res.json();
        setDepartments([
          ...departments,
          { _id: data.id, name: newDepartment, sections: [], abierto: false },
        ]);
        setNewDepartment("");
      } else {
        console.error("Error al agregar departamento");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  // Agregar nueva sección
  const addSection = async (departmentId) => {
    if (!departmentId || newSection.trim() === "") {
      console.error(
        "departmentId no está definido o el nombre de la sección está vacío"
      );
      return;
    }

    const sectionData = { sectionName: newSection };

    const res = await fetch(`/api/departments/${departmentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sectionData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Respuesta de la API:", data);

      // Actualiza solo el departamento correcto
      setDepartments(
        departments.map((dep) =>
          dep._id === departmentId
            ? { ...dep, sections: [...dep.sections, data.section] }
            : dep
        )
      );
      setNewSection(""); // Limpiar el campo de la nueva sección
    } else {
      console.error("Error al agregar la sección");
    }
  };

  const editSection = async (departmentId, sectionId, newSectionName) => {
    try {
      const res = await fetch(`/api/departments/${departmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sectionId: sectionId,
          sectionName: newSectionName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Actualizar el estado local
        setDepartments(
          departments.map((dep) => {
            if (dep._id === departmentId) {
              return {
                ...dep,
                sections: dep.sections.map((sec) =>
                  sec._id === sectionId ? { ...sec, name: newSectionName } : sec
                ),
              };
            }
            return dep;
          })
        );
      } else {
        console.error("Error al editar la sección");
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  const deleteSection = async (departmentId, sectionId) => {
    try {
      const res = await fetch(`/api/departments/${departmentId}/sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Actualizar el estado local
        setDepartments(
          departments.map((dep) => {
            if (dep._id === departmentId) {
              return {
                ...dep,
                sections: dep.sections.filter((sec) => sec._id !== sectionId),
              };
            }
            return dep;
          })
        );
      } else {
        console.error("Error al eliminar la sección");
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  // También necesitamos modificar la función saveEditSection:

  const saveEditSection = async () => {
    if (sectionToEdit.trim() === "" || !editingSection) return;

    try {
      const department = departments.find(
        (dep) => dep._id === editingSection.depId
      );
      const section = department.sections[editingSection.index];

      await editSection(editingSection.depId, section._id, sectionToEdit);

      // Limpiar campos de edición
      setEditingSection(null);
      setSectionToEdit("");
    } catch (error) {
      console.error("Error al editar sección:", error);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-10 z-[-1]">
        <Image
          src="/assets/logo_leyenda.png"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>

      <nav className="bg-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img src="/assets/logo.png" alt="Logo" className="h-12" />
            <h1 className="text-xl font-bold">CONTROL DOCUMENTAL</h1>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-700 hover:underline">
              Iniciar sesión
            </a>
            <a href="#" className="text-gray-700 hover:underline">
              ADMIN
            </a>
            <a href="#" className="text-gray-700 hover:underline">
              DOCUMENTOS
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-10 px-4">
        {/* Input para agregar departamento */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-400 rounded-lg"
            placeholder="Nuevo departamento"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={addDepartment}
          >
            <FaPlus /> Agregar
          </button>
        </div>

        {/* Lista de departamentos */}
        {departments.map((dep) => (
          <div key={dep._id}>
            <div
              className="flex justify-between items-center bg-gray-200 px-4 py-2 mb-4 rounded-lg cursor-pointer"
              onClick={() => toggleDepartment(dep._id)}
            >
              <h3 className="text-lg font-semibold">{dep.name}</h3>
              <button>
                {dep.abierto ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {dep.abierto && (
              <div className="ml-4">
                <input
                  type="text"
                  placeholder="Nueva sección"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg mb-2"
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  onClick={() => addSection(dep._id)}
                >
                  <FaPlus /> Agregar Sección
                </button>

                {/* Lista de secciones */}
                <ul className="mt-4">
                  {dep.sections.map((sec, index) => (
                    <li
                      key={sec._id}
                      className="flex justify-between items-center bg-white px-4 py-2 border border-gray-300 rounded-md mb-2"
                    >
                      {editingSection?.depId === dep._id &&
                      editingSection?.index === index ? (
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={sectionToEdit}
                            onChange={(e) => setSectionToEdit(e.target.value)}
                            className="flex-1 border border-gray-400 px-2 py-1 rounded"
                            placeholder={sec.name}
                          />
                          <button
                            onClick={saveEditSection}
                            className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => {
                              setEditingSection(null);
                              setSectionToEdit("");
                            }}
                            className="bg-gray-400 text-white px-4 py-1 rounded-md hover:bg-gray-500"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1">{sec.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSection({ depId: dep._id, index });
                                setSectionToEdit(sec.name);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    "¿Estás seguro de eliminar esta sección?"
                                  )
                                ) {
                                  deleteSection(dep._id, sec._id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
