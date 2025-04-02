"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import React from "react";

export default function Seccion() {
  const { idSeccion, idDepartamento } = useParams();
  const [documentos, setDocumentos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modoEditor, setModoEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docKey, setDocKey] = useState("");
  const [error, setError] = useState("");
  const [seccionActual, setSeccionActual] = useState<any>(null);

  useEffect(() => {
    const fetchSeccionInfo = async () => {
      try {
        const res = await fetch(`/api/sections/${idSeccion}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setSeccionActual(data.section || null);
      } catch (error) {
        console.error("Error al obtener información de la sección:", error);
      }
    };

    const fetchDocumentos = async () => {
      if (!idDepartamento || !idSeccion) return;

      try {
        const res = await fetch(
          `/api/departments/${idDepartamento}/sections/${idSeccion}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setDocumentos(data.docs || []);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };

    const checkAuth = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ident="));
      if (!cookie) return;

      const token = cookie.split("=")[1];
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.role === "admin");
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    };

    fetchSeccionInfo();
    fetchDocumentos();
    checkAuth();
  }, [idSeccion, idDepartamento]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !docName || !docKey) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!seccionActual?.departmentId) {
      setError("No se pudo identificar el departamento de esta sección.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", docName);
    formData.append("key", docKey);
    formData.append("file", file);
    formData.append("department", String(idDepartamento));
    formData.append("section", String(idSeccion));

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setDocumentos([...documentos, { _id: data.id, name: docName }]);
        setDocName("");
        setDocKey("");
        setFile(null);
      } else {
        setError(data.message || "Error al subir el documento.");
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      setError("Error en la conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md w-full">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          <h2 className="text-3xl font-bold text-gray-900">
            CONTROL DOCUMENTAL
          </h2>
          <button
            onClick={() => window.history.back()}
            className="text-lg font-bold underline text-gray-900 hover:text-gray-700"
          >
            Volver
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div className="flex-grow bg-gray-200 py-16 flex flex-col items-center px-4">
        <h1 className="text-2xl font-bold mb-4">
          {seccionActual?.name
            ? `Documentos - ${seccionActual.name}`
            : "Documentos"}
        </h1>
        {seccionActual?.departmentName && (
          <p className="text-gray-600 mb-4">
            Departamento: {seccionActual.departmentName}
          </p>
        )}

        {isAdmin && (
          <button
            onClick={() => setModoEditor(!modoEditor)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4"
          >
            {modoEditor ? "Desactivar Modo Editor" : "Activar Modo Editor"}
          </button>
        )}

        {/* Formulario */}
        {isAdmin && modoEditor && (
          <form
            onSubmit={handleUpload}
            className="bg-white p-6 rounded shadow-md mb-6 w-full max-w-4xl"
          >
            <h2 className="text-lg font-bold mb-2">Subir Documento</h2>
            <input
              type="text"
              placeholder="Nombre del documento"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              placeholder="Clave del documento"
              value={docKey}
              onChange={(e) => setDocKey(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded mb-2"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 w-full rounded mb-2"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Subir Documento"}
            </button>
          </form>
        )}

        {/* Tabla de Documentos */}
        <div className="w-full max-w-4xl overflow-x-auto bg-white p-6 rounded shadow-md">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Nombre
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Fecha de Creación
                </th>
              </tr>
            </thead>
            <tbody>
              {documentos.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center text-gray-500">
                    No hay documentos disponibles
                  </td>
                </tr>
              ) : (
                documentos.map((doc) => (
                  <tr key={doc._id}>
                    <td className="border px-4 py-2">{doc.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
