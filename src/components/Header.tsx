'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-yellow-400 border-b border-yellow-500 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo, Brand, and Desktop Navigation - All on same line */}
          <nav className="flex relative items-center justify-between w-full">
            <div className="flex relative container">
                <Image
                  src="/images/the_simpsons.png"
                  alt="The Simpsons"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
                                 <div className="lg:flex flex flex-grow items-center hidden ml-6">
                   <Menubar className="bg-transparent border-none">
                     <MenubarMenu>
                       <MenubarTrigger className="font-medium text-gray-700 hover:text-gray-900">
                         <Link href="/">Home</Link>
                       </MenubarTrigger>
                     </MenubarMenu>
                     
                     <MenubarMenu>
                       <MenubarTrigger className="font-medium text-gray-700 hover:text-gray-900">
                         Games
                       </MenubarTrigger>
                       <MenubarContent>
                         <MenubarItem>
                           <Link href="/unlimited">Unlimited Mode</Link>
                         </MenubarItem>
                         <MenubarItem>
                           <Link href="/games">All Games</Link>
                         </MenubarItem>
                       </MenubarContent>
                     </MenubarMenu>
                     
                     <MenubarMenu>
                       <MenubarTrigger className="font-medium text-gray-700 hover:text-gray-900">
                         <Link href="/statistics">Statistics</Link>
                       </MenubarTrigger>
                     </MenubarMenu>
                     
                     <MenubarMenu>
                       <MenubarTrigger className="font-medium text-gray-700 hover:text-gray-900">
                         Help
                       </MenubarTrigger>
                       <MenubarContent>
                         <MenubarItem>
                           <Link href="/guides">How to Play</Link>
                         </MenubarItem>
                         <MenubarItem>
                           <Link href="/about">About</Link>
                         </MenubarItem>
                         <MenubarItem>
                           <Link href="/contacts">Contact Us</Link>
                         </MenubarItem>
                       </MenubarContent>
                     </MenubarMenu>
                   </Menubar>
                 </div>
              <span className="text-lg font-bold text-gray-900">DLE</span>
              </div>
                

            {/* Score Display (like Tradle's cart total) */}
            <div className="hidden md:flex items-center">
              <span className="text-sm text-gray-600">Score: 0</span>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              aria-label="Open main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link href="/unlimited" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Unlimited
              </Link>
              <Link href="/games" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Games
              </Link>
              <Link href="/guides" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Guides
              </Link>
              <Link href="/statistics" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Statistics
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                About
              </Link>
              <Link href="/contacts" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Contacts
              </Link>
              <div className="px-3 py-2 text-sm text-gray-600">
                Score: 0
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 