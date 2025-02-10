import Image from 'next/image';

export default function Login() {
  return (
    <div className="bg-gray-200 flex flex-col min-h-screen">
      {/* Navbar con animación */}
      <nav className="bg-white shadow-md w-full animate-fadeIn">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 py-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={48} height={48} />
            <h2 className="text-3xl font-bold text-gray-900">CONTROL DOCUMENTAL</h2>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-6">
            <a
              href="/admin"
              className="text-lg font-bold underline text-gray-900 hover:text-gray-700 transition duration-300"
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

        {/* Formulario con animación de entrada */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative z-10 animate-slideUp">
          <h2 className="text-xl font-semibold text-center mb-6">Iniciar sesión</h2>

          <form>
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
              />
            </div>

            {/* Botón de enviar con animación */}
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300 active:scale-95"
            >
              Entrar
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
