"use client";

import { HeartPulse, ShieldCheck, Users, Award, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Biz haqimizda</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Online Shifoxona - bu zamonaviy tibbiyot va texnologiyalar uyg'unligi bo'lib, har bir inson uchun tibbiy xizmatlarni oson va qulay qilishni maqsad qilganmiz.
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="grid grid-cols-12 h-full">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="border-r border-b border-white/20 h-24"></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Bizning vazifamiz</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Bizning vazifamiz - yurtimizning istalgan nuqtasidan turib professional tibbiy xizmatlardan foydalanish imkoniyatini yaratishdir. Biz bemorlar va eng malakali shifokorlar o'rtasidagi masofani qisqartirishni istaymiz.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Ishonchli xizmat</h4>
                                        <p className="text-gray-500">Mutaxassislarimizning barchasi sertifikatlangan va tajribali.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Vaqtni tejash</h4>
                                        <p className="text-gray-500">Navbat kutishlarsiz, onlayn tarzda qabulga yozilish.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-3xl p-12 aspect-square flex items-center justify-center">
                            <div className="text-center">
                                < Award className="w-32 h-32 text-blue-600 mx-auto mb-6 opacity-20" />
                                <h3 className="text-5xl font-bold text-blue-600 mb-2">10+</h3>
                                <p className="text-xl text-gray-600 font-medium">Yillik tajriba</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Stats */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                            <p className="text-gray-500">Malakali shifokorlar</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">10k+</div>
                            <p className="text-gray-500">Muvaffaqiyatli qabullar</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">20+</div>
                            <p className="text-gray-500">Mutaxassislik yo'nalishlari</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
                            <p className="text-gray-500">Mamnun bemorlar</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white">
                        <h2 className="text-3xl md:text-5xl font-bold mb-8">Sog'lig'ingizni asrang!</h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            Hoziroq ro'yxatdan o'ting va o'zingizga ma'qul bo'lgan mutaxassis qabuliga yoziling.
                        </p>
                        <Link href="/register" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition shadow-xl shadow-blue-800/20 inline-block">
                            Hoziroq boshlash
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t py-12">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>© 2026 Online Shifoxona. Barcha huquqlar himoyalangan.</p>
                </div>
            </footer>
        </div>
    );
}
