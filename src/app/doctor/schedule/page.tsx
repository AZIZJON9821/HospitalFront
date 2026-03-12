"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Calendar, Clock, Plus, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "react-hot-toast";

interface Schedule {
    id?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
}

const DAYS = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
    "Yakshanba"
];

export default function DoctorSchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await api.get("/schedules/my");
            setSchedules(res.data);
        } catch (error) {
            toast.error("Ish grafigini yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const addTimeSlot = (dayIndex: number) => {
        setSchedules([...schedules, { dayOfWeek: dayIndex, startTime: "09:00", endTime: "17:00", slotDuration: 30 }]);
    };

    const removeSlot = (index: number) => {
        const newSchedules = [...schedules];
        newSchedules.splice(index, 1);
        setSchedules(newSchedules);
    };

    const updateSlot = (index: number, field: keyof Schedule, value: any) => {
        const newSchedules = [...schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setSchedules(newSchedules);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Clean data before sending (convert types if needed)
            const dataToSave = schedules.map(s => ({
                dayOfWeek: Number(s.dayOfWeek),
                startTime: s.startTime,
                endTime: s.endTime,
                slotDuration: Number(s.slotDuration)
            }));
            await api.post("/schedules/my", dataToSave);
            toast.success("Ish grafigi saqlandi");
            fetchSchedule();
        } catch (error) {
            toast.error("Saqlashda xatolik yuz berdi");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ish grafigi</h1>
                    <p className="text-gray-500">Haftalik ish kunlaringiz va soatlaringizni belgilang.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Saqlash
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {DAYS.map((day, dayIndex) => {
                        const daySlots = schedules.filter(s => s.dayOfWeek === dayIndex);
                        return (
                            <div key={day} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        {day}
                                    </h3>
                                    <button
                                        onClick={() => addTimeSlot(dayIndex)}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Qo'shish
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {daySlots.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">Dam olish kuni</p>
                                    ) : (
                                        schedules.map((s, idx) => {
                                            if (s.dayOfWeek !== dayIndex) return null;
                                            return (
                                                <div key={idx} className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="time"
                                                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={s.startTime}
                                                            onChange={(e) => updateSlot(idx, "startTime", e.target.value)}
                                                        />
                                                        <span className="text-gray-400">-</span>
                                                        <input
                                                            type="time"
                                                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={s.endTime}
                                                            onChange={(e) => updateSlot(idx, "endTime", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">Davomiyligi:</span>
                                                        <select
                                                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none"
                                                            value={s.slotDuration}
                                                            onChange={(e) => updateSlot(idx, "slotDuration", Number(e.target.value))}
                                                        >
                                                            <option value={15}>15 min</option>
                                                            <option value={20}>20 min</option>
                                                            <option value={30}>30 min</option>
                                                            <option value={45}>45 min</option>
                                                            <option value={60}>60 min</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSlot(idx)}
                                                        className="ml-auto p-2 text-gray-400 hover:text-red-600 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
