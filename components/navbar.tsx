"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User, LogOut, Settings, Menu, Shield } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

const LogoImage = "https://i.ibb.co/yFb8BdcK/sqdq.png"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() || "/"

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/explorer", label: "Explorer" },
    { href: "/equipes", label: "Équipes" },
    { href: "/joueurs", label: "Joueurs" },
    ...(isAuthenticated
      ? [
          { href: "/recrutement", label: "Recrutement" },
          { href: "/profil", label: "Profil" },
          ...(user?.role === "admin" || user?.role === "developer"
            ? [{ href: "/admin", label: "Administration", special: true }]
            : []),
        ]
      : []),
    { href: "/credits", label: "Crédits" },
  ]

  const NavLinks = () =>
    links.map((link) => {
      const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setIsOpen(false)}
          className={`
            relative text-sm font-medium transition-all duration-300 transform hover:scale-105
            ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
          `}
        >
          <span className="px-2 py-1 hover:bg-white/10 rounded-md transition-all duration-300">
            {link.label}
          </span>
          {isActive && (
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white rounded animate-fade-in"></span>
          )}
        </Link>
      )
    })

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-16 items-center justify-between px-3 lg:px-5">

        {/* Logo + texte */}
        <Link href="/" className="flex items-center space-x-4 group">
          <Image
            src={LogoImage}
            alt="Logo"
            width={30}
            height={30}
            className="transition-all duration-300 group-hover:scale-110"
          />
          <span className="text-2xl font-bold text-white font-heading transition-all duration-300 group-hover:text-white/90 animate-glow">
            NEMESIS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center space-x-8">{NavLinks()}</div>

        {/* Right section: user/login */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-white/10 transition-all duration-300 hover:scale-105 border-glow">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-white font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={5} className="w-48 bg-black border-white/20 animate-scale-in z-50">
                <DropdownMenuItem asChild>
                  <Link href="/profil" className="flex items-center cursor-pointer text-white hover:bg-white/10">
                    <Settings className="mr-2 h-4 w-4" /> Profil
                  </Link>
                </DropdownMenuItem>
                {(user?.role === "admin" || user?.role === "developer") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center cursor-pointer text-white hover:bg-white/10">
                      <Shield className="mr-2 h-4 w-4" /> Administration
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer text-white hover:bg-white/10">
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <Link href="/login" className="text-white font-medium">
                  Connexion
                </Link>
              </Button>
              <Button size="sm" asChild className="bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105 border-glow">
                <Link href="/signup">Inscription</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black border-white/20 animate-slide-left">
              <div className="flex flex-col space-y-6 mt-10 text-center">
                <Link href="/" className="flex items-center justify-center space-x-3 text-2xl font-bold text-white mb-4">
                  <Image src={LogoImage} alt="Logo" width={32} height={32} />
                  <span>NEMESIS</span>
                </Link>
                <div className="flex flex-col space-y-6 items-center">{NavLinks()}</div>
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-6 border-t border-white/20 items-center">
                    <Button variant="ghost" size="sm" asChild onClick={() => setIsOpen(false)} className="hover:bg-white/10 transition-all duration-300">
                      <Link href="/login" className="text-white">
                        Connexion
                      </Link>
                    </Button>
                    <Button size="sm" asChild onClick={() => setIsOpen(false)} className="bg-white text-black hover:bg-white/90 transition-all duration-300">
                      <Link href="/signup">Inscription</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
