import './globals.css'

export const metadata = {
  title: 'Document Manager',
  description: 'Sistema de gestión de documentos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
