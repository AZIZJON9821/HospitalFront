"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, Trash2, Loader2, Search, Filter, ShieldCheck, User } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserData {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: "USER" | "DOCTOR" | "ADMIN";
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            const res = await api.get(`/users?role=${roleFilter}`);
            setUsers(res.data);
        } catch (error) {
            toast.error("Foydalanuvchilarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Haqiqatan ham ushbu foydalanuvchini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.")) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("Foydalanuvchi o'chirildi");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "O'chirishda xatolik yuz berdi");
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phoneNumber?.includes(search)
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar boshqaruvi</h1>
                <p className="text-gray-500">Barcha ro'yxatdan o'tgan foydalanuvchilar va ularning rollari.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Ism, email yoki tel raqam bo'yicha qidirish..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64 relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white font-medium"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">Barcha rollar</option>
                        <option value="USER">Bemorlar (USER)</option>
                        <option value="DOCTOR">Shifokorlar (DOCTOR)</option>
                        <option value="ADMIN">Administratorlar (ADMIN)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Foydalanuvchi</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Telefon</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Sana</th>
                                <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{u.fullName}</div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{u.phoneNumber || "-"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === "ADMIN" ? "bg-purple-100 text-purple-600" :
                                                u.role === "DOCTOR" ? "bg-green-100 text-green-600" :
                                                    "bg-blue-100 text-blue-600"
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(u.createdAt).toLocaleDateString('uz-UZ')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {u.role !== "ADMIN" && (
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                title="Foydalanuvchini o'chirish"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                        {u.role === "ADMIN" && <ShieldCheck className="w-5 h-5 text-gray-300 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-20 text-gray-400">Foydalanuvchilar topilmadi</div>
                    )}
                </div>
            )}
        </div>
    );
}
