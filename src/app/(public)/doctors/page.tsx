"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, Filter, Stethoscope, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDept, setSelectedDept] = useState("");

    useEffect(() => {
        fetchData();
    }, [search, selectedDept]);

    const fetchData = async () => {
        try {
            const [docsRes, deptsRes] = await Promise.all([
                api.get(`/doctors?search=${search}&departmentId=${selectedDept}`),
                api.get("/departments"),
            ]);
            setDoctors(docsRes.data);
            setDepartments(deptsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            {/* Hero Section */}
            <section className="bg-white border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                <div className="container mx-auto px-4 py-20 relative">
                    <div className="max-w-3xl">
                        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-6">
                            <Link href="/" className="hover:text-blue-600 transition-colors">Bosh sahifa</Link>
                            <span>/</span>
                            <span className="text-gray-900">Shifokorlar</span>
                        </nav>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                            Malakali <span className="text-blue-600">mutaxassislar</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            Sizning salomatligingiz uchun eng yaxshi shifokorlarni bir joyga jamladik.
                            Mutaxassisni tanlang va onlayn qabulga yoziling.
                        </p>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12">
                {/* Search & Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-12 -mt-20 relative z-10">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Shifokor ismi, mutaxassisligi bo'yicha qidirish..."
                            className="w-full pl-14 pr-6 py-5 rounded-2xl border-0 shadow-xl shadow-gray-200/50 outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium text-gray-700 placeholder:text-gray-400 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full lg:w-72 relative group">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                        <select
                            className="w-full pl-14 pr-10 py-5 rounded-2xl border-0 shadow-xl shadow-gray-200/50 outline-none focus:ring-2 focus:ring-blue-600 appearance-none bg-white font-bold text-gray-700 cursor-pointer transition-all"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="">Barcha bo'limlar</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[450px] bg-white rounded-3xl animate-pulse shadow-sm border border-gray-100"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 overflow-hidden group flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    {doctor.imageUrl ? (
                                        <img
                                            src={doctor.imageUrl}
                                            alt={doctor.user.fullName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-300">
                                            <Stethoscope className="w-20 h-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-orange-600 px-3 py-1.5 rounded-xl font-black text-sm shadow-sm border border-white/20">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{doctor.rating.toFixed(1)}</span>
                                    </div>
                                    {doctor.experience >= 10 && (
                                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-blue-600/30">
                                            Top Mutaxassis
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <p className="text-blue-600 font-black mb-2 tracking-widest uppercase text-[10px]">{doctor.specialization}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{doctor.user.fullName}</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between text-sm py-3 border-b border-gray-50">
                                            <span className="text-gray-400 font-medium italic">Bo'lim</span>
                                            <span className="text-gray-900 font-bold">{doctor.department.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm py-3 border-b border-gray-50">
                                            <span className="text-gray-400 font-medium italic">Tajriba</span>
                                            <span className="text-gray-600 font-bold"><span className="text-blue-600 text-lg">{doctor.experience}</span> yil</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/doctors/${doctor.id}`}
                                        className="mt-auto block w-full text-center bg-gray-50 text-gray-900 py-4 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 shadow-inner"
                                    >
                                        Profilni ko'rish
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && doctors.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Hech qanday shifokor topilmadi</h3>
                        <p className="text-gray-500">Boshqa qidiruv so'zlarini sinab ko'ring yoki filtrlarni tozalang</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
