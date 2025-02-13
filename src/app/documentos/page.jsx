import Link from "next/link"; // Importa Link para las rutas

export default function Documentos() {
  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* Navbar con animación */}
      <nav className="bg-white shadow-md w-full animate-fadeIn">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <img src="/assets/logo.png" alt="Logo" width={48} height={48} />
            <h2 className="text-3xl font-bold text-gray-900">CONTROL DOCUMENTAL</h2>
          </div>
          {/* Botones dentro del navbar */}
          <div className="flex items-center gap-6 z-10"> {/* Añadir z-10 aquí */}
            <Link
              href="/" // Asegúrate de que la ruta apunte al inicio ("/")
              className="text-lg font-bold underline text-gray-900 hover:text-gray-700 text-right cursor-pointer"
            >
              Salir
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido con fondo gris claro */}
      <div className="flex-grow bg-gray-200 py-16 flex flex-col items-center justify-center min-h-screen relative">
        {/* Imagen de fondo transparente */}
        <img
          src="/assets/logo_leyenda.png"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-contain opacity-10 z-0" // Asegurar z-index de la imagen
        />
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner text-gray-600 text-sm">
        Copyright © H. Congreso del Estado de Durango
      </footer>
    </div>
  );
}
