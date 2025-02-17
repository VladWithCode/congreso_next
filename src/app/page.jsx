import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Encabezado que abarca todo el ancho */}
      <div className="bg-white w-full shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          {/* Imagen y título */}
          <div className="flex items-center gap-4">
            <Image src="/assets/logo.png" alt="Logo" width={80} height={80} />
            <h2 className="text-3xl font-bold text-gray-900">
              CONTROL DOCUMENTAL
            </h2>
          </div>

          {/* Botón de iniciar sesión */}
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
        {/* Línea divisoria */}
        <hr className="w-full border-t-2 border-gray-300" />
      </div>

      {/* Contenido debajo del navbar */}
      <div className="py-16">
        {/* Línea negra superior */}
        <hr className="w-full border-t-4 border-black mb-4" />

        {/* Texto alineado a la izquierda y más grande */}
        <h1 className="text-3xl font-serif text-gray-900 whitespace-nowrap text-center mx-auto">
          Uso exclusivo para el personal del H. Congreso del Estado de Durango
        </h1>

        {/* Línea negra inferior */}
        <hr className="w-full border-t-4 border-black mt-4" />

        {/* Imagen de fondo grande */}
        <img
          className="w-8/12 h-[500px] object-fill mt-8 mx-auto"
          src="/assets/logo_leyenda.png"
          alt="Imagen de leyenda"
        />
      </div>
      {/* Footer */}
      <footer className="bg-white text-center py-2 shadow-inner text-gray-600 text-sm mt-14">
        Copyright © H. Congreso del Estado de Durango
      </footer>
    </div>
  );
}
