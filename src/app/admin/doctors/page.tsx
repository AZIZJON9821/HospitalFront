"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Stethoscope, Plus, Edit2, Trash2, Loader2, X, Search, Filter, Camera, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { uploadImage } from "@/lib/supabase";
import Image from "next/image";

interface Doctor {
    id: string;
    userId: string;
    departmentId: string;
    specialization: string;
    experience: number;
    biography: string;
    imageUrl?: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    department: {
        id: string;
        name: string;
    };
}

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

interface Department {
    id: string;
    name: string;
}

export default function AdminDoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedDept, setSelectedDept] = useState("");

    const [fromScratch, setFromScratch] = useState(true);
    const [formData, setFormData] = useState({
        userId: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        departmentId: "",
        specialization: "",
        experience: 0,
        biography: "",
        imageUrl: "",
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [search, selectedDept]);

    const fetchInitialData = async () => {
        try {
            const [usersRes, deptsRes] = await Promise.all([
                api.get("/users?role=USER"),
                api.get("/departments"),
            ]);
            setUsers(usersRes.data);
            setDepartments(deptsRes.data);
        } catch (error) {
            toast.error("Ma'lumotlarni yuklashda xatolik");
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await api.get(`/doctors?search=${search}&departmentId=${selectedDept}`);
            setDoctors(res.data);
        } catch (error) {
            toast.error("Shifokorlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingDoctor) {
                await api.patch(`/doctors/${editingDoctor.id}`, {
                    departmentId: formData.departmentId,
                    specialization: formData.specialization,
                    experience: Number(formData.experience),
                    biography: formData.biography,
                    imageUrl: formData.imageUrl,
                });
                toast.success("Shifokor ma'lumotlari yangilandi");
            } else {
                const payload = fromScratch
                    ? { ...formData, userId: undefined, experience: Number(formData.experience) }
                    : {
                        userId: formData.userId,
                        departmentId: formData.departmentId,
                        specialization: formData.specialization,
                        experience: Number(formData.experience),
                        biography: formData.biography,
                        imageUrl: formData.imageUrl,
                    };

                await api.post("/doctors", payload);
                toast.success("Yangi shifokor qo'shildi");
            }
            setModalOpen(false);
            setEditingDoctor(null);
            fetchDoctors();
            fetchInitialData(); // Refresh users list
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Haqiqatan ham ushbu shifokor profilini o'chirmoqchimisiz?")) return;
        try {
            await api.delete(`/doctors/${id}`);
            toast.success("Profil o'chirildi");
            fetchDoctors();
        } catch (error) {
            toast.error("O'chirishda xatolik yuz berdi");
        }
    };

    const openEditModal = (doctor: Doctor) => {
        setEditingDoctor(doctor);
        setFromScratch(false);
        setFormData({
            ...formData,
            userId: doctor.userId,
            departmentId: doctor.departmentId,
            specialization: doctor.specialization,
            experience: doctor.experience,
            biography: doctor.biography || "",
            imageUrl: doctor.imageUrl || "",
        });
        setModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shifokorlar boshqaruvi</h1>
                    <p className="text-gray-500">Shifokorlar ro'yxati va ularning profillarini boshqaring.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDoctor(null);
                        setFromScratch(true);
                        setFormData({
                            userId: "",
                            fullName: "",
                            email: "",
                            phoneNumber: "",
                            password: "",
                            departmentId: "",
                            specialization: "",
                            experience: 0,
                            biography: "",
                            imageUrl: ""
                        });
                        setModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    <Plus className="w-5 h-5" />
                    Yangi shifokor
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Ism bo'yicha qidirish..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64 relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white font-medium"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        <option value="">Barcha bo'limlar</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-sm md:text-base">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="px-6 py-4 font-bold text-gray-500">Shifokor</th>
                                    <th className="px-6 py-4 font-bold text-gray-500">Bo'lim</th>
                                    <th className="px-6 py-4 font-bold text-gray-500">Mutaxassislik</th>
                                    <th className="px-6 py-4 font-bold text-gray-500">Tajriba</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0">
                                                    {doctor.imageUrl ? (
                                                        <img src={doctor.imageUrl} alt={doctor.user.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Stethoscope className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{doctor.user.fullName}</div>
                                                    <div className="text-xs text-gray-500">{doctor.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{doctor.department.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{doctor.specialization}</td>
                                        <td className="px-6 py-4 text-gray-600">{doctor.experience} yil</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(doctor)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doctor.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {doctors.length === 0 && (
                        <div className="text-center py-20 text-gray-400">Shifokorlar topilmadi</div>
                    )}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b bg-gray-50 flex justify-between items-center shrink-0">
                            <h2 className="text-2xl font-bold">
                                {editingDoctor ? "Profilni tahrirlash" : "Yangi shifokor yaratish"}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white rounded-full transition">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
                            {!editingDoctor && (
                                <div className="flex p-1 bg-gray-100 rounded-2xl mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setFromScratch(true)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${fromScratch ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        Noldan qo'shish
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFromScratch(false)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${!fromScratch ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        Mavjud foydalanuvchi
                                    </button>
                                </div>
                            )}

                            {!editingDoctor && fromScratch ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">To'liq ismi</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="+998901234567"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Parol</label>
                                        <input
                                            required
                                            type="password"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : !editingDoctor && !fromScratch ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Foydalanuvchini tanlang</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    >
                                        <option value="">Foydalanuvchini tanlang...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            ) : null}

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="col-span-2">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-sm font-medium text-gray-700">Bo'lim</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const name = prompt("Yangi bo'lim nomini kiriting:");
                                                if (name) {
                                                    api.post("/departments", { name })
                                                        .then(res => {
                                                            toast.success("Yangi bo'lim qo'shildi");
                                                            fetchInitialData(); // Refresh departments
                                                            setFormData(prev => ({ ...prev, departmentId: res.data.id }));
                                                        })
                                                        .catch(() => toast.error("Bo'lim qo'shishda xatolik"));
                                                }
                                            }}
                                            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Yangi bo'lim qo'shish
                                        </button>
                                    </div>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                    >
                                        <option value="">Bo'limni tanlang...</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tajriba (yil)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mutaxassislik</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Masalan: Kardiolog-jarroh"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Biografiya</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Shifokor haqida qisqacha..."
                                    value={formData.biography}
                                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 border-t">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Shifokor rasmi</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                        {formData.imageUrl ? (
                                            <>
                                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                                                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </>
                                        ) : (
                                            <Camera className="w-8 h-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-50 transition">
                                            <Upload className="w-4 h-4" />
                                            Rasm tanlash
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        try {
                                                            const toastId = toast.loading("Rasm yuklanmoqda...");
                                                            const url = await uploadImage(file);
                                                            setFormData({ ...formData, imageUrl: url });
                                                            toast.success("Rasm yuklandi", { id: toastId });
                                                        } catch (error) {
                                                            toast.error("Rasm yuklashda xatolik");
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                        <p className="mt-1 text-xs text-gray-400">PNG, JPG, max 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 shrink-0"
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingDoctor ? "Saqlash" : "Yaratish"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
