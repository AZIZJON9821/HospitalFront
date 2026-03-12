"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Bell, BellRing, Check, Loader2, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function UserNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            toast.error("Xabarlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bildirishnomalar</h1>
                    <p className="text-gray-500">Tizimdan kelgan oxirgi xabarlar va yangilanishlar.</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <BellRing className="w-6 h-6" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="max-w-3xl space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`p-6 rounded-3xl border transition-all ${n.isRead
                                    ? "bg-white border-gray-100 opacity-75"
                                    : "bg-blue-50/50 border-blue-100 shadow-sm"
                                }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className={`font-bold ${n.isRead ? "text-gray-700" : "text-blue-900"}`}>
                                        {n.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
                                    <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(n.createdAt).toLocaleString('uz-UZ')}
                                    </div>
                                </div>
                                {!n.isRead && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        className="p-2 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                                        title="O'qilgan deb belgilash"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                            <Bell className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-gray-400 font-medium">Hozircha bildirishnomalar mavjud emas.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
