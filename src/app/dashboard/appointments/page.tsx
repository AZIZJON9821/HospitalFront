"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2, AlertCircle, CalendarDays } from "lucide-react";
import { toast } from "react-hot-toast";

interface Appointment {
    id: string;
    appointmentDate: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
    notes: string;
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

export default function UserAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleCancel = async (id: string) => {
        if (!confirm("Haqiqatan ham ushbu qabulni bekor qilmoqchimisiz?")) return;
        try {
            await api.patch(`/appointments/${id}/status`, { status: "CANCELLED" });
            toast.success("Qabul bekor qilindi");
            fetchAppointments();
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

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
                <h1 className="text-2xl font-bold text-gray-900">Mening qabullarim</h1>
                <p className="text-gray-500">Siz tomondan rejalashtirilgan barcha shifokor qabullari.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex gap-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 shadow-inner shrink-0 group-hover:border-blue-200 transition-all duration-300">
                                        {appt.doctor.imageUrl ? (
                                            <img src={appt.doctor.imageUrl} alt={appt.doctor.user.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <CalendarDays className="w-6 h-6 mb-1" />
                                                <span className="text-[10px] font-bold uppercase">
                                                    {new Date(appt.appointmentDate).getDate()} {new Date(appt.appointmentDate).toLocaleString('uz-UZ', { month: 'short' })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{appt.doctor.user.fullName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(appt.status)}`}>
                                                {getStatusLabel(appt.status)}
                                            </span>
                                        </div>
                                        <div className="text-blue-600 text-sm font-semibold mb-2">{appt.doctor.department.name}</div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {new Date(appt.appointmentDate).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
                                            {appt.notes && <span className="flex items-center gap-1.5 truncate max-w-[200px]"><AlertCircle className="w-4 h-4 text-gray-400" /> {appt.notes}</span>}
                                        </div>
                                    </div>
                                </div>

                                {appt.status === "PENDING" && (
                                    <button
                                        onClick={() => handleCancel(appt.id)}
                                        className="w-full md:w-auto px-6 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Bekor qilish
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {appointments.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Calendar className="w-10 h-10 text-gray-200" />
                            </div>
                            <p className="text-gray-400 font-bold text-lg">Sizda hozircha qabullar mavjud emas.</p>
                            <button className="mt-4 text-blue-600 font-bold hover:underline">Shifokorga yozilish</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
