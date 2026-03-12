"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile & Desktop Header for Public Pages */}
                <header className="bg-white border-b px-4 md:px-8 h-20 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="flex items-center gap-2 text-blue-600 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-500">
                                <HeartPulse className="w-6 h-6" />
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-gray-900 uppercase">Shifo<span className="text-blue-600">xona</span></span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="/doctors" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">Shifokorlar</Link>
                        <Link href="/departments" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">Bo'limlar</Link>
                        <Link href="/about" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">Biz haqimizda</Link>
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
