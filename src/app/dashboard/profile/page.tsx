"use client";

import { useAuthStore } from "@/store/authStore";
import { User, Mail, Phone, Shield, Calendar, Edit2, LogOut } from "lucide-react";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mening profilim</h1>
                <p className="text-gray-500">Shaxsiy ma'lumotlaringizni boshqaring.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="w-32 h-32 bg-white rounded-[2rem] p-2 shadow-xl border-4 border-white">
                            <div className="w-full h-full bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600">
                                <User className="w-16 h-16" />
                            </div>
                        </div>
                        <div className="pb-4 flex gap-3">
                            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">
                                <Edit2 className="w-4 h-4" /> Tahrirlash
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{user.fullName}</h2>
                            <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mt-1">
                                {user.role === 'ADMIN' ? 'Administrator' : user.role === 'DOCTOR' ? 'Shifokor' : 'Bemor'}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Email manzili</p>
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Telefon raqami</p>
                                    <p className="text-gray-900 font-medium">{user.phoneNumber || "Kiritilmagan"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Hisob turi</p>
                                    <p className="text-gray-900 font-medium">{user.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Ro'yxatdan o'tilgan sana</p>
                                    <p className="text-gray-900 font-medium">
                                        {new Date().toLocaleDateString('uz-UZ')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t">
                            <button
                                onClick={() => { logout(); window.location.href = "/"; }}
                                className="flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all"
                            >
                                <LogOut className="w-5 h-5" /> Tizimdan chiqish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
