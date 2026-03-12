import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-20 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16 text-center md:text-left">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center justify-center md:justify-start gap-2 text-blue-600 mb-6 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-500">
                                <HeartPulse className="w-6 h-6" />
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-gray-900 uppercase">Shifo<span className="text-blue-600">xona</span></span>
                        </Link>
                        <p className="text-gray-400 font-medium max-w-sm leading-relaxed mx-auto md:mx-0">
                            Bizning maqsadimiz — har bir bemor uchun zamonaviy va sifatli tibbiy xizmatlarni oson va qulay qilish.
                            Sizning salomatligingiz bizning oliy maqsadimizdir.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px] md:text-xs mb-6 px-4 md:px-0 bg-gray-50 md:bg-transparent py-2 md:py-0 inline-block md:inline rounded-lg md:rounded-none">Bo'limlar</h4>
                        <ul className="space-y-4 text-gray-400 font-bold text-sm">
                            <li className="hover:text-blue-600 transition-colors cursor-pointer">Kardiologiya</li>
                            <li className="hover:text-blue-600 transition-colors cursor-pointer">Stomatologiya</li>
                            <li className="hover:text-blue-600 transition-colors cursor-pointer">Nevrologiya</li>
                            <li className="hover:text-blue-600 transition-colors cursor-pointer">Pediatriya</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px] md:text-xs mb-6 px-4 md:px-0 bg-gray-50 md:bg-transparent py-2 md:py-0 inline-block md:inline rounded-lg md:rounded-none">Aloqa</h4>
                        <ul className="space-y-4 text-gray-400 font-bold text-sm">
                            <li className="hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-center md:justify-start gap-2">
                                <span className="text-gray-300">T:</span> +998 (90) 123-45-67
                            </li>
                            <li className="hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-center md:justify-start gap-2">
                                <span className="text-gray-300">E:</span> info@shifoxona.uz
                            </li>
                            <li className="hover:text-blue-600 transition-colors cursor-pointer">
                                Toshkent sh., Chilonzor tumani
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-50 pt-12 text-center">
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        © 2026 Online Shifoxona. Barcha huquqlar himoyalangan.
                    </p>
                </div>
            </div>
        </footer>
    );
}
