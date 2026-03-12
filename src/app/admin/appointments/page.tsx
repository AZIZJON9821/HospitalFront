"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Calendar, Clock, User, Stethoscope, Search, Filter, Loader2, CheckCircle, XCircle, Clock4 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Appointment {
    id: string;
    appointmentDate: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
    notes: string;
    user: {
        fullName: string;
        phoneNumber: string;
    };
    doctor: {
        user: {
            fullName: string;
        };
        department: {
            name: string;
        };
        imageUrl?: string;
    };
}

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get("/appointments");
            setAppointments(res.data);
        } catch (error) {
            toast.error("Qabullarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success("Holat yangilandi");
            fetchAppointments();
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        const matchesStatus = statusFilter ? appt.status === statusFilter : true;
        const matchesSearch = searchTerm
            ? appt.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.doctor.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesStatus && matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-orange-100 text-orange-600 border-orange-200";
            case "APPROVED": return "bg-blue-100 text-blue-600 border-blue-200";
            case "REJECTED": return "bg-red-100 text-red-600 border-red-200";
            case "CANCELLED": return "bg-gray-100 text-gray-600 border-gray-200";
            case "COMPLETED": return "bg-green-100 text-green-600 border-green-200";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING": return "Kutilmoqda";
            case "APPROVED": return "Tasdiqlangan";
            case "REJECTED": return "Rad etilgan";
            case "CANCELLED": return "Bekor qilingan";
            case "COMPLETED": return "Yakunlangan";
            default: return status;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Barcha qabullar</h1>
                <p className="text-gray-500">Shifoxonadagi barcha qabullar ro'yxati va ularning holati.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Bemor yoki shifokor ismi bo'yicha qidirish..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64 relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white font-medium"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Barcha holatlar</option>
                        <option value="PENDING">Kutilmoqda</option>
                        <option value="APPROVED">Tasdiqlangan</option>
                        <option value="REJECTED">Rad etilgan</option>
                        <option value="CANCELLED">Bekor qilingan</option>
                        <option value="COMPLETED">Yakunlangan</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Sana va vaqt</th>
                                    <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Bemor</th>
                                    <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Shifokor</th>
                                    <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider">Holat</th>
                                    <th className="px-6 py-4 font-bold text-sm text-gray-500 uppercase tracking-wider text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAppointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">
                                                        {new Date(appt.appointmentDate).toLocaleDateString('uz-UZ')}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock4 className="w-3 h-3" />
                                                        {new Date(appt.appointmentDate).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{appt.user.fullName}</div>
                                            <div className="text-xs text-gray-500">{appt.user.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0">
                                                    {appt.doctor.imageUrl ? (
                                                        <img src={appt.doctor.imageUrl} alt={appt.doctor.user.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Stethoscope className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{appt.doctor.user.fullName}</div>
                                                    <div className="text-xs text-blue-600 font-medium">{appt.doctor.department.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(appt.status)}`}>
                                                {getStatusLabel(appt.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {appt.status === "PENDING" && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(appt.id, "APPROVED")}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Tasdiqlash"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(appt.id, "REJECTED")}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Rad etish"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredAppointments.length === 0 && (
                        <div className="text-center py-20 bg-gray-50/50">
                            <p className="text-gray-400">Hech qanday qabul topilmadi</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
