"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

export default function Seccion() {
  const router = useRouter();
  const { id } = router.query; // Obtiene el ID de la sección desde la URL

  const [section, setSection] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Obtener datos de la sección y sus documentos
  useEffect(() => {
    if (id) {
      fetch(`/api/documents?section=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setSection(data.section);
          setDocuments(data.documents);
        })
        .catch((error) => console.error("Error fetching section:", error));
    }
  }, [id]);

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
            className="text-lg font-bold underline text-gray-900 hover:text-gray-700 text-right cursor-pointer"
          >
            Salir
          </Link>
        </div>
      </nav>

      {/* Contenido */}
      <div className="flex-grow bg-gray-200 py-8 flex flex-col items-center justify-start min-h-screen px-4">
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-md">
          {/* Botón para regresar */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <IoIosArrowBack size={20} />
            Volver a Departamentos
          </button>

          {/* Título de la Sección */}
          <h1 className="text-3xl font-bold text-center text-gray-900 my-4">
            {section ? section.name : "Cargando..."}
          </h1>

          {/* Lista de Documentos */}
          <ul className="mt-4 space-y-3">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <li
                  key={doc._id}
                  className="p-3 bg-gray-100 rounded shadow flex justify-between items-center"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {doc.name}
                  </span>
                  <a
                    href={doc.url} // Enlace del documento
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Descargar
                  </a>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No hay documentos disponibles en esta sección.
              </p>
            )}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner text-gray-600 text-sm">
        Copyright © H. Congreso del Estado de Durango
      </footer>
    </div>
  );
}
