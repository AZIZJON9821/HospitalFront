"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Users, Stethoscope, Building2, TrendingUp, Loader2, ShieldCheck, Activity, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/stats/admin");
                setStats(res.data);
            } catch (error) {
                console.error("Admin stats fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { name: "Foydalanuvchilar", value: stats?.users || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50", link: "/admin/users" },
        { name: "Shifokorlar", value: stats?.doctors || 0, icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50", link: "/admin/doctors" },
        { name: "Bo'limlar", value: stats?.departments || 0, icon: Building2, color: "text-purple-600", bg: "bg-purple-50", link: "/admin/departments" },
        { name: "Jami daromad", value: (stats?.revenue || 0).toLocaleString() + " so'm", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", link: "#" },
    ];

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-xl w-fit mb-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        Admin Tizimi
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Boshqaruv <span className="text-blue-600">Paneli</span></h1>
                    <p className="text-gray-400 font-medium mt-2">Tizimning barcha ko'rsatkichlari real vaqtda.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic">
                        {user?.fullName?.charAt(0)}
                    </div>
                    <div className="pr-4">
                        <p className="text-sm font-black text-gray-900">{user?.fullName}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat) => (
                    <Link href={stat.link} key={stat.name} className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl opacity-40 group-hover:scale-150 transition-transform duration-700`}></div>
                        <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-100 group-hover:rotate-12 transition-transform duration-500`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.name}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </div>
                        <ChevronRight className="absolute bottom-8 right-8 w-5 h-5 text-gray-200 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-blue-600" />
                            So'nggi faollik
                        </h2>
                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Live updates
                        </span>
                    </div>
                    <div className="py-16 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Hozircha yangi faollik yo'q</p>
                    </div>
                </div>

                <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-gray-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h3 className="text-xl font-black mb-8 relative z-10 uppercase tracking-widest text-blue-400">Tezkor havolalar</h3>
                    <div className="space-y-4 relative z-10">
                        {['Yangi shifokor qo\'shish', 'Hisobot yuklash', 'Tizim sozlamalari'].map((item) => (
                            <button key={item} className="w-full text-left bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-all font-black text-sm flex items-center justify-between group">
                                {item}
                                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

