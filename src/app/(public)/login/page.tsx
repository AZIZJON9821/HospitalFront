"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { LogIn, Loader2 } from "lucide-react";

const loginSchema = z.object({
    identifier: z.string().min(1, "Email yoki telefon raqami kiritilishi shart"),
    password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/login", data);
            const { user, access_token } = response.data;
            setAuth(user, access_token);
            toast.success("Hush kelibsiz!");

            // Redirect based on role
            if (user.role === 'ADMIN') router.push('/admin');
            else if (user.role === 'DOCTOR') router.push('/doctor');
            else router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-4">
                        <LogIn className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Tizimga kirish</h1>
                    <p className="text-gray-500 mt-2">Shaxsiy kabinetingizga kiring</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email yoki telefon raqami</label>
                        <input
                            {...register("identifier")}
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="example@mail.com yoki +998901234567"
                        />
                        {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
                        <input
                            {...register("password")}
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirish"}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600 text-sm">
                    Hisobingiz yo'qmi?{" "}
                    <Link href="/register" className="text-blue-600 font-bold hover:underline">
                        Ro'yxatdan o'tish
                    </Link>
                </p>
            </div>
        </div>
    );
}
