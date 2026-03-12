"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Calendar, Activity, Bell, Loader2, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/stats/user");
                setStats(res.data);
            } catch (error) {
                console.error("Stats fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { name: "Mening qabullarim", value: stats?.appointments || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Bildirishnomalar", value: stats?.notifications || 0, icon: Bell, color: "text-purple-600", bg: "bg-purple-50" },
        { name: "Uchrashgan shifokorlar", value: stats?.consultedDoctors || 0, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-12">
                <div className="flex items-center gap-3 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl w-fit mb-4 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
                    <Heart className="w-4 h-4 fill-current" />
                    Bemor Dashbordi
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                    Xayrli kun, <span className="text-blue-600">{user?.fullName}!</span>
                </h1>
                <p className="text-gray-400 font-medium">Sizning salomatlik ko'rsatkichlaringiz va rejalaringiz bir joyda.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {statCards.map((stat) => (
                    <div key={stat.name} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>
                        <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.name}</p>
                            <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-gray-900">Yaqindagi qabullar</h2>
                        <Link href="/dashboard/appointments" className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                            Hammasini ko'rish <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                        <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Hozircha yaqin orada qabullar yo'q</p>
                        <Link href="/doctors" className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                            Qabulga yozilish
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-300 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                            <Activity className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 leading-tight">Sog'lig'ingiz haqida qayg'uring</h3>
                        <p className="text-blue-100 font-medium mb-10 leading-relaxed text-lg italic">
                            "Salomatlik - bu nafaqat kasallikning yo'qligi, balki to'liq jismoniy va ruhiy farovonlik holatidir."
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                            Profilni to'ldirish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

