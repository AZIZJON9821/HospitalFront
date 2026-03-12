import { Activity, Users, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
        <section className="py-12 md:py-24 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 md:mb-8">
                Sog'lig'ingiz bizning <span className="text-blue-600">ustuvor vazifamiz</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto md:mx-0">
                Eng yaxshi shifokorlar bilan onlayn bog'laning, qabulga yoziling va sog'lig'ingizni professional darajada nazorat qiling.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link href="/register" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 text-center">Hoziroq boshlash</Link>
                <Link href="/doctors" className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all hover:border-gray-300 text-center">Shifokorni topish</Link>
              </div>
            </div>
            <div className="relative mt-8 md:mt-0">
              <div className="w-full h-[350px] md:h-[550px] bg-blue-600 rounded-[2.5rem] md:rounded-[3.rem] overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center justify-center h-full text-white/20">
                  <Activity className="w-32 h-32 md:w-48 md:h-48 animate-pulse" />
                </div>
                {/* Visual accents */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm md:text-base">100% Xavfsiz</div>
                      <div className="text-blue-100 text-xs md:text-sm">Ma'lumotlaringiz himoyalangan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">Imkoniyatlar</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Nega bizni tanlashadi?</h2>
              <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Professional shifokorlar"
                desc="Eng sara va malakali mutaxassislar sizning xizmatingizda."
                color="blue"
              />
              <FeatureCard
                icon={<Calendar className="w-8 h-8" />}
                title="Oson qabulga yozilish"
                desc="Bir necha soniya ichida o'zingizga ma'qul vaqtni tanlang."
                color="indigo"
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8" />}
                title="Xavfsiz va maxfiy"
                desc="Sizning barcha ma'lumotlaringiz to'liq himoyalangan."
                color="emerald"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300"
  };

  return (
    <div className={`p-10 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${colors[color]}`}>
      <div className="mb-8">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
