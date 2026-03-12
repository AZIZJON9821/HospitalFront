"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Users, Calendar, CheckCircle, Clock, Loader2, PlayCircle, Star, ArrowRight } from "lucide-react";

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/stats/doctor");
                setStats(res.data);
            } catch (error) {
                console.error("Doctor stats fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { name: "Bugungi qabullar", value: stats?.todayAppointments || 0, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Jami bemorlar", value: stats?.totalPatients || 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { name: "Yakunlanganlar", value: stats?.completedAppointments || 0, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-12">
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl w-fit mb-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Shifokor Hubi
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Xayrli kun, <span className="text-blue-600">Doktor {user?.fullName.split(' ')[0]}!</span></h1>
                <p className="text-gray-400 font-medium mt-2">Bugungi rejangiz va bemorlar ko'rsatkichlari bilan tanishing.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {statCards.map((stat) => (
                    <div key={stat.name} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 transition-all duration-500 hover:-translate-y-2">
                        <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.name}</p>
                            <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-gray-900">Bugungi jadval</h2>
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            Boshlash
                        </button>
                    </div>
                    <div className="py-20 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                        <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Hali qabullar rejalashtirilmagan</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <h3 className="text-xl font-black mb-8 relative z-10 uppercase tracking-widest text-blue-400">Analitika</h3>
                    <div className="space-y-8 relative z-10">
                        <div>
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3 text-gray-400">
                                <span>Haftalik samaradorlik</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full w-[85%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3 text-gray-400">
                                <span>Bemorlar mamnunligi</span>
                                <span>4.9/5.0</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
                            </div>
                        </div>
                        <button className="w-full mt-4 flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group font-black text-sm">
                            Batafsil Hisobot
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

