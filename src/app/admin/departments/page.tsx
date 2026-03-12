"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Building2, Plus, Edit2, Trash2, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Department {
    id: string;
    name: string;
    description: string;
    _count?: {
        doctors: number;
    };
}

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get("/departments");
            setDepartments(res.data);
        } catch (error) {
            toast.error("Bo'limlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingDept) {
                await api.patch(`/departments/${editingDept.id}`, formData);
                toast.success("Bo'lim yangilandi");
            } else {
                await api.post("/departments", formData);
                toast.success("Yangi bo'lim qo'shildi");
            }
            setModalOpen(false);
            setEditingDept(null);
            setFormData({ name: "", description: "" });
            fetchDepartments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Haqiqatan ham ushbu bo'limni o'chirmoqchimisiz?")) return;
        try {
            await api.delete(`/departments/${id}`);
            toast.success("Bo'lim o'chirildi");
            fetchDepartments();
        } catch (error) {
            toast.error("O'chirishda xatolik yuz berdi");
        }
    };

    const openEditModal = (dept: Department) => {
        setEditingDept(dept);
        setFormData({ name: dept.name, description: dept.description || "" });
        setModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bo'limlar boshqaruvi</h1>
                    <p className="text-gray-500">Shifoxona bo'limlarini tahrirlang va yangilarini qo'shing.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDept(null);
                        setFormData({ name: "", description: "" });
                        setModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    <Plus className="w-5 h-5" />
                    Yangi bo'lim
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <div key={dept.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => openEditModal(dept)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {dept.description || "Tavsif mavjud emas."}
                            </p>
                            <div className="pt-4 border-t flex justify-between items-center text-sm font-medium">
                                <span className="text-gray-400">Shifokorlar soni:</span>
                                <span className="text-blue-600 font-bold">{dept._count?.doctors || 0} ta</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <form onSubmit={handleSubmit} className="p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingDept ? "Bo'limni tahrirlash" : "Yangi bo'lim qo'shish"}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomi</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        placeholder="Kardiologiya..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif (ixtiyoriy)</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                        placeholder="Bo'lim haqida ma'lumot..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-8 hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingDept ? "Saqlash" : "Yaratish"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
