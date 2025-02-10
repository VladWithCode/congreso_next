import Image from "next/image";

export default function Admin() {
  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* Navbar con animación */}
      <nav className="bg-white shadow-md w-full animate-fadeIn">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <Image src="/assets/logo.png" alt="Logo" width={48} height={48} />
            <h2 className="text-3xl font-bold text-gray-900">CONTROL DOCUMENTAL</h2>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-6">
            <a
              href="/admin"
              className="text-lg font-bold underline text-gray-900 hover:text-gray-700"
            >
              Admin
            </a>
            <a
              href="/login"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300 active:scale-95"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
      </nav>

      {/* Contenedor principal con imagen de fondo */}
      <div className="flex-grow flex items-center justify-center relative">
        {/* Imagen de fondo */}
        <Image
          src="/assets/logo_leyenda.png"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-contain opacity-10"
          width={1000}
          height={1000}
        />

        {/* Cuadro con advertencia y formulario de contraseña */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative z-10 animate-slideUp">
          <h2 className="text-xl font-semibold text-center mb-6">
            ¡Advertencia!
          </h2>
          <p className="text-center mb-6">
            Este contenido se encuentra protegido por una contraseña. Para
            visualizarlo, por favor introduce una contraseña válida.
          </p>

          <form className="flex items-center gap-4">
            {/* Campo Contraseña */}
            <div className="flex-1 mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                placeholder="Ingresa la contraseña"
                className="w-full mt-1 p-2 border rounded-md text-gray-600 focus:ring focus:ring-gray-300 transition duration-300 hover:shadow-md"
              />
            </div>

            {/* Botón de "Entrar" más pequeño y minimalista */}
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
      <footer className="bg-white text-center py-4 shadow-inner text-gray-100 text-sm">
        Copyright © H. Congreso del Estado de Durango
      </footer>
    </div>
  );
}
