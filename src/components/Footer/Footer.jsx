"use client"
import React from 'react' // We don't need useEffect or useState anymore
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation' // 1. Import the correct hook

const Footer = () => {
  const pathname = usePathname()

  const isAdminPage = pathname.startsWith('/admin')

  if (isAdminPage) {
    return null
  }

  return (
    <footer>
      <div className="grid gap-y-10 sm:grid-flow-col bg-[#083365] text-white p-10">
        <aside>
          
          <Link href="/" className="relative w-24 h-24 block">
            <Image
              src="/logo.jpeg"
              alt="GammaDevs Logo"
              className="object-cover rounded-lg"
              fill
            />
          </Link>
          <p className="mt-4">
            GammaDevs Technologies Limited.
            <br />
            Bringing the Best of Tech to You
          </p>
        </aside>
        <nav>
          <h6 className="font-bold uppercase opacity-60 mb-2">Services</h6>
          <span className="block cursor-pointer hover:underline mb-1">Development</span>
          <span className="block cursor-pointer hover:underline mb-1">Design</span>
          <span className="block cursor-pointer hover:underline mb-1">Consultations</span>
          <span className="block cursor-pointer hover:underline">Building</span>
        </nav>
        <nav>
          <h6 className="font-bold uppercase opacity-60 mb-2">Company</h6>
          <Link href="/#home" className="block hover:underline mb-1">Home</Link>
          <Link href="/#about" className="block hover:underline mb-1">About us</Link>
          <Link href="/#team" className="block hover:underline mb-1">Meet the Team</Link>
          <Link href="/#projects" className="block hover:underline">Projects</Link>
        </nav>
        <nav>
          <h6 className="font-bold uppercase opacity-60 mb-2">Legal</h6>
          <Link href="/terms-conditions" className="block cursor-pointer hover:underline mb-1">Terms of use</Link>
          <Link href="/privacy-policy" className="block cursor-pointer hover:underline">Privacy policy</Link>
        </nav>
      </div>
      
      <div className="grid place-items-center bg-[#000000] text-white p-4">
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All right reserved by GammaDevs Technologies Limited</p>
        </aside>
      </div>
    </footer>
  )
}

export default Footer;