"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react";
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
}

export default function DoctorAppointmentsPage() {
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

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success("Muvaffaqiyatli yangilandi");
            fetchAppointments();
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-orange-100 text-orange-600";
            case "APPROVED": return "bg-blue-100 text-blue-600";
            case "REJECTED": return "bg-red-100 text-red-600";
            case "COMPLETED": return "bg-green-100 text-green-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mening qabullarim</h1>
                <p className="text-gray-500">Sizga yozilgan barcha bemorlar ro'yxati.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex gap-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600 shrink-0">
                                        <span className="text-lg font-bold">
                                            {new Date(appt.appointmentDate).getDate()}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold">
                                            {new Date(appt.appointmentDate).toLocaleString('uz-UZ', { month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">{appt.user.fullName}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(appt.status)}`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(appt.appointmentDate).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {appt.user.phoneNumber}</span>
                                        </div>
                                        {appt.notes && (
                                            <div className="mt-4 flex gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 italic">
                                                <MessageSquare className="w-4 h-4 shrink-0 text-gray-400" />
                                                "{appt.notes}"
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {appt.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(appt.id, "APPROVED")}
                                                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Tasdiqlash
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(appt.id, "REJECTED")}
                                                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition flex items-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" /> Rad etish
                                            </button>
                                        </>
                                    )}
                                    {appt.status === "APPROVED" && (
                                        <button
                                            onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                                            className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Yakunlash
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {appointments.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
                            <p className="text-gray-400 italic">Hozircha qabullar mavjud emas.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
