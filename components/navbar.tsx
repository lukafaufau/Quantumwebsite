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
import { User, LogOut, Settings, Menu, Shield, Home, Users, Megaphone, UserPlus, Trophy } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() || "/"

  const links = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/explorer", label: "Explorer", icon: Megaphone },
    { href: "/community", label: "Communauté", icon: Users },
    { href: "/updates", label: "Updates", icon: Trophy },
    ...(isAuthenticated
      ? [
          { href: "/recrutement", label: "Recrutement", icon: UserPlus },
          { href: "/profil", label: "Profil", icon: User },
          ...(user?.role === "admin" || user?.role === "developer"
            ? [{ href: "/admin", label: "Admin", icon: Shield }]
            : []),
        ]
      : []),
  ]

  const NavLinks = () =>
    links.map((link) => {
      const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
      const Icon = link.icon
      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setIsOpen(false)}
          className={`
            group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
            ${isActive 
              ? "bg-gradient-to-r from-primary/20 to-purple-500/20 text-white border border-primary/30" 
              : "text-gray-300 hover:text-white hover:bg-white/5"
            }
          `}
        >
          <Icon className="h-4 w-4" />
          <span>{link.label}</span>
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl animate-pulse" />
          )}
        </Link>
      )
    })

  return (
    <nav className="sticky top-0 z-50 w-full glass-effect border-b border-white/10">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-xl font-heading font-bold gradient-text">
            Nemesis
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {NavLinks()}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-white/10 rounded-xl px-3 py-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:inline text-white font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 glass-effect border-white/20 animate-scale-in"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/profil"
                    className="flex items-center cursor-pointer text-white hover:bg-white/10"
                  >
                    <Settings className="mr-2 h-4 w-4" /> Profil
                  </Link>
                </DropdownMenuItem>
                {(user?.role === "admin" || user?.role === "developer") && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="flex items-center cursor-pointer text-white hover:bg-white/10"
                    >
                      <Shield className="mr-2 h-4 w-4" /> Administration
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center cursor-pointer text-white hover:bg-white/10"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-white/10 rounded-xl"
              >
                <Link href="/login" className="text-white font-medium">
                  Connexion
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/80 hover:to-purple-500/80 rounded-xl"
              >
                <Link href="/signup">Inscription</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-white/10 rounded-xl"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] glass-effect border-white/20"
            >
              <div className="flex flex-col space-y-6 mt-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">N</span>
                  </div>
                  <span className="text-xl font-heading font-bold gradient-text">Nemesis</span>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {NavLinks()}
                </div>
                
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-6 border-t border-white/20">
                    <Button
                      variant="ghost"
                      asChild
                      onClick={() => setIsOpen(false)}
                      className="justify-start hover:bg-white/10 rounded-xl"
                    >
                      <Link href="/login" className="text-white">
                        Connexion
                      </Link>
                    </Button>
                    <Button
                      asChild
                      onClick={() => setIsOpen(false)}
                      className="justify-start bg-gradient-to-r from-primary to-purple-500 rounded-xl"
                    >
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