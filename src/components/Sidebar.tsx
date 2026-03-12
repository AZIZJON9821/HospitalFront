"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    Bell,
    UserCircle,
    Stethoscope,
    Building2,
    BarChart3,
    X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    const publicLinks = [
        { name: "Bosh sahifa", href: "/", icon: Building2 },
        { name: "Shifokorlar", href: "/doctors", icon: Stethoscope },
        { name: "Bo'limlar", href: "/departments", icon: Building2 },
        { name: "Biz haqimizda", href: "/about", icon: Users },
    ];

    const adminLinks = [
        { name: "Statistika", href: "/admin", icon: BarChart3 },
        { name: "Shifokorlar", href: "/admin/doctors", icon: Stethoscope },
        { name: "Foydalanuvchilar", href: "/admin/users", icon: Users },
        { name: "Bo'limlar", href: "/admin/departments", icon: Building2 },
        { name: "Qabullar", href: "/admin/appointments", icon: Calendar },
        { name: "Profil", href: "/admin/profile", icon: UserCircle },
    ];

    const doctorLinks = [
        { name: "Dashboard", href: "/doctor", icon: LayoutDashboard },
        { name: "Jadval", href: "/doctor/schedule", icon: Calendar },
        { name: "Qabullar", href: "/doctor/appointments", icon: Users },
        { name: "Profil", href: "/doctor/profile", icon: UserCircle },
    ];

    const userLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Mening qabullarim", href: "/dashboard/appointments", icon: Calendar },
        { name: "Bildirishnomalar", href: "/dashboard/notifications", icon: Bell },
        { name: "Profil", href: "/dashboard/profile", icon: UserCircle },
    ];

    let links = publicLinks;
    if (user?.role === "ADMIN") links = [...publicLinks, ...adminLinks];
    else if (user?.role === "DOCTOR") links = [...publicLinks, ...doctorLinks];
    else if (user?.role === "USER") links = [...publicLinks, ...userLinks];

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 z-[160] h-screen w-64 bg-white border-r flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                )}
            >
                <div className="p-6 border-b flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                        <Building2 className="w-8 h-8" />
                        <span>Shifoxona</span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium",
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    {user ? (
                        <>
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName || "Foydalanuvchi"}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'DOCTOR' ? 'Shifokor' : 'Bemor'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                Chiqish
                            </button>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition font-bold text-sm"
                            >
                                <UserCircle className="w-5 h-5" />
                                Kirish
                            </Link>
                            <Link
                                href="/register"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white bg-gray-900 hover:bg-blue-600 transition font-bold text-sm"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Ro'yxatdan o'tish
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
