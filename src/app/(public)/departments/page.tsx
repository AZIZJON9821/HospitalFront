"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { HeartPulse, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

interface Department {
    id: string;
    name: string;
    description: string;
    _count: {
        doctors: number;
    };
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/departments');
                setDepartments(response.data);
            } catch (error) {
                console.error('Bo\'limlarni yuklashda xatolik:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                        <HeartPulse className="w-8 h-8" />
                        <span>Online Shifoxona</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Bosh sahifa</Link>
                        <Link href="/doctors" className="hover:text-blue-600">Shifokorlar</Link>
                        <Link href="/login" className="text-blue-600 font-medium border border-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-50">Kirish</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Mutaxassislik bo'limlari</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Sizga kerakli bo'lgan tibbiy yo'nalishni tanlang va soha mutaxassislaridan maslahat oling.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept) => (
                            <Link
                                key={dept.id}
                                href={`/doctors?departmentId=${dept.id}`}
                                className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <ActivityIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{dept.name}</h3>
                                <p className="text-gray-600 mb-6 line-clamp-2">{dept.description || 'Ushbu yo\'nalish bo\'yicha malakali shifokorlar xizmat ko\'rsatadi.'}</p>
                                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                    <Users className="w-5 h-5" />
                                    <span>{dept._count.doctors} ta shifokor</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t py-12">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>© 2026 Online Shifoxona. Barcha huquqlar himoyalangan.</p>
                </div>
            </footer>
        </div>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
