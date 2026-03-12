"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, UserCircle, Menu, X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
    const { user } = useAuthStore();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const getDashboardHref = () => {
        if (!user) return "/login";
        if (user.role === 'ADMIN') return "/admin";
        if (user.role === 'DOCTOR') return "/doctor";
        return "/dashboard";
    };

    const navLinks = [
        { name: 'Bosh sahifa', href: '/' },
        { name: 'Shifokorlar', href: '/doctors' },
        { name: 'Bo\'limlar', href: '/departments' },
        { name: 'Biz haqimizda', href: '/about' },
    ];

    return (
        <header className="border-b border-gray-100 bg-white/70 backdrop-blur-xl sticky top-0 z-[100]">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-blue-600 group relative z-[110]">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-500">
                        <HeartPulse className="w-6 h-6" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-gray-900 uppercase">Shifo<span className="text-blue-600">xona</span></span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-10 text-gray-500 uppercase text-[11px] font-black tracking-widest">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors hover:text-blue-600 ${pathname === link.href ? 'text-blue-600' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions (Desktop & Mobile) */}
                <div className="flex items-center gap-3 md:gap-6 relative z-[110]">
                    {user ? (
                        <Link
                            href={getDashboardHref()}
                            className="flex items-center justify-center bg-blue-50 text-blue-600 p-2 md:p-2.5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 group shadow-lg shadow-blue-100"
                        >
                            <UserCircle className="w-7 h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                        </Link>
                    ) : (
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/login" className="text-gray-400 hover:text-blue-600 font-extrabold text-sm transition-colors">Kirish</Link>
                            <Link href="/register" className="bg-gray-900 text-white px-7 py-3 rounded-2xl hover:bg-blue-600 transition-all duration-300 font-black text-sm shadow-xl shadow-gray-200 hover:shadow-blue-200 active:scale-95">
                                Ro'yxatdan o'tish
                            </Link>
                        </div>
                    )}

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden w-11 h-11 flex items-center justify-center bg-gray-50 rounded-xl text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-white z-[105] lg:hidden transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    }`}
            >
                <div className="flex flex-col h-full pt-32 px-6 pb-12">
                    <div className="flex-1 space-y-6">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-8">Asosiy Menu</p>
                        {navLinks.map((link, idx) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between py-4 border-b border-gray-50 text-2xl font-black transition-all ${pathname === link.href ? 'text-blue-600 pl-4' : 'text-gray-900'
                                    }`}
                                style={{ transitionDelay: `${idx * 50}ms` }}
                            >
                                <span>{link.name}</span>
                                <ChevronRight className={`w-6 h-6 ${pathname === link.href ? 'text-blue-600' : 'text-gray-200'}`} />
                            </Link>
                        ))}
                    </div>

                    {!user && (
                        <div className="space-y-4 pt-8">
                            <Link
                                href="/login"
                                className="block w-full text-center py-5 rounded-3xl font-black text-gray-900 border-2 border-gray-100 hover:bg-gray-50 transition-all"
                            >
                                Kirish
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full text-center py-5 rounded-3xl font-black text-white bg-blue-600 shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
                            >
                                Ro'yxatdan o'tish
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
