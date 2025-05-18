"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useLocalUser } from "@/lib/local-user-context"

export const Navbar = () => {
    const { user } = useLocalUser();
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <nav className="bg-background border-b border-border relative z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16 relative">
                        <Link href="/" className="p-2 font-medium text-primary">YouTube Analyzer</Link>

                    <div className="md:hidden z-50">
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-primary"
                                aria-label="Toggle Menu"
                            >
                                {isOpen ? (
                                    <X className="h-6 w-6"/>
                                ) : (
                                    <Menu className="h-6 w-6"/>
                                )}
                            </button>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/dashboard" className="p-2 font-medium text-primary hover:text-primary/80">Dashboard</Link>
                        <div className="space-x-4 flex items-center">
                            <span className="text-sm text-muted-foreground">
                                {user ? `Logged in as ${user.name || 'Local User'}` : 'Loading...'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`md:hidden fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`}>
                    <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen? "opacity-100" : "opacity-0"}`} />

                    <div className={`absolute top-16 left-0 right-0 bg-background border-b border-border/40 shadow-lg transition-all duration-300 ease-in-out
                                    ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
                            <div className="px-4 pt-2 pb-3 space-y-1 flex flex-col ">
                                <Link href="/dashboard" className="p-2 font-medium text-primary hover:text-primary/80">Dashboard</Link>
                                <div className="pt-2">
                                    <span className="text-sm text-muted-foreground">
                                        {user ? `Logged in as ${user.name || 'Local User'}` : 'Loading...'}
                                    </span>
                                </div>
                            </div>
                    </div>

                </div>

            </div>
        </nav>
    )
}
