'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          DocManager
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link 
            href="/dashboard" 
            className={`${pathname === '/dashboard' ? 'text-secondary' : 'text-gray-600'} hover:text-primary`}
          >
            Dashboard
          </Link>
          <Link 
            href="/documents" 
            className={`${pathname === '/documents' ? 'text-secondary' : 'text-gray-600'} hover:text-primary`}
          >
            Documentos
          </Link>
          <Link 
            href="/login" 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"
          >
            Acceder
          </Link>
        </div>

        <button className="md:hidden text-gray-600">
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </nav>
  )
}