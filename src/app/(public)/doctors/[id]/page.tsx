"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Calendar, Clock, Stethoscope, Star, ChevronLeft, Loader2, Activity } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/authStore";

export default function DoctorProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    const fetchDoctor = async () => {
        try {
            const res = await api.get(`/doctors/${id}`);
            setDoctor(res.data);
        } catch (error) {
            toast.error("Ma'lumotlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error("Qabulga yozilish uchun avval ro'yxatdan o'ting");
            router.push("/register");
            return;
        }

        if (!selectedDate || !selectedTime) {
            toast.error("Iltimos, sana va vaqtni tanlang");
            return;
        }

        setBookingLoading(true);
        try {
            const appointmentDate = new Date(`${selectedDate}T${selectedTime}`);
            await api.post("/appointments", {
                doctorId: id,
                appointmentDate: appointmentDate.toISOString(),
            });
            toast.success("Qabulga muvaffaqiyatli yozildingiz!");
            router.push("/dashboard/appointments");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
    if (!doctor) return <div className="text-center py-20">Shifokor topilmadi</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            <div className="container mx-auto px-4 py-12">
                <Link href="/doctors" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold mb-10 transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Shifokorlar ro'yxatiga qaytish
                </Link>

                <div className="grid lg:grid-cols-3 gap-10 items-start">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Profile Header Card */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-gray-50 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                            <div className="w-48 h-48 rounded-[2rem] overflow-hidden relative border-4 border-white shadow-2xl shrink-0 z-10">
                                {doctor.imageUrl ? (
                                    <img src={doctor.imageUrl} alt={doctor.user.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-300">
                                        <Stethoscope className="w-20 h-20" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 z-10 pt-4">
                                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-4">
                                    <Activity className="w-4 h-4" />
                                    <span>Professional Mutaxassis</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{doctor.user.fullName}</h1>
                                <p className="text-blue-600 text-xl font-bold mb-8 uppercase tracking-wide">{doctor.specialization}</p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Reyting</span>
                                        <div className="flex items-center gap-2 text-gray-900 font-black">
                                            <Star className="w-5 h-5 text-orange-400 fill-current" />
                                            <span className="text-xl">{doctor.rating.toFixed(1)}</span>
                                            <span className="text-gray-300 font-medium text-sm">({doctor.reviewCount} sharh)</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tajriba</span>
                                        <div className="text-xl font-black text-gray-900">
                                            {doctor.experience} <span className="text-gray-400 text-sm font-bold lowercase">yil</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Bo'lim</span>
                                        <div className="text-lg font-black text-blue-600">
                                            {doctor.department.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Biography */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                Biografiya va Tajriba
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                                {doctor.biography || "Ushbu shifokor haqida batafsil ma'lumotlar tez orada qo'shiladi."}
                            </p>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                    Bemorlar fikrlari
                                </h2>
                                <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl font-black text-sm">
                                    {doctor.reviews?.length || 0} ta sharh
                                </div>
                            </div>

                            {doctor.reviews?.length > 0 ? (
                                <div className="grid gap-6">
                                    {doctor.reviews.map((review: any) => (
                                        <div key={review.id} className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-blue-600 italic">
                                                        {review.user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{review.user.fullName}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Doimiy mijoz</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                                    <Star className="w-4 h-4 text-orange-400 fill-current" />
                                                    <span className="text-sm font-black">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed font-medium italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Hali sharhlar qoldirilmagan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking */}
                    <div className="space-y-8 sticky top-32">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-200/40 border border-blue-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>

                            <h2 className="text-2xl font-black text-gray-900 mb-2">Qabulga yozilish</h2>
                            <p className="text-sm text-gray-400 font-medium mb-10">O'zingizga qulay vaqtni tanlang</p>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Sana tanlang</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold transition-all"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Vaqt tanlang</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-3 text-sm font-black rounded-xl border transition-all duration-300 ${selectedTime === time
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                                                    : "bg-white border-gray-100 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/30"
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={bookingLoading}
                                        onClick={handleBooking}
                                        className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-3 group"
                                    >
                                        {bookingLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Band qilish</span>
                                                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-wider italic">
                                        * Tasdiqlash uchun shifokor bilan bog'laniladi
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
                            <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Tezkor Maslahat
                            </h3>
                            <p className="text-sm font-medium text-blue-100 italic leading-relaxed">
                                Sizda shoshilinch savollar bormi? Mutaxassis bilan bog'lanish uchun klinikamizga qo'ng'iroq qiling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
