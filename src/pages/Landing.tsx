import { motion } from 'framer-motion';
import { GlassNavbar } from '../components/ui/GlassNavbar';
import { GlassButton } from '../components/ui/GlassButton';
import { Link } from 'react-router-dom';

export default function Landing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <GlassNavbar />

      <main className="relative pt-24 pb-16 w-full">
        
        {/* Full-width Hero Banner Image */}
        <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2000" 
            alt="Research Lab" 
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay to ensure text contrast if needed, but we use overlapping card instead */}
        </div>

        {/* Overlapping Content Box */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-4xl mx-auto px-6"
        >
          <div className="bg-white px-8 py-16 md:px-16 md:py-20 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 -mt-32 md:-mt-48 text-center flex flex-col items-center">
            
            <motion.h1 
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-8 text-slate-900 uppercase tracking-tight"
            >
              FisiAssess AI Platform
            </motion.h1>
            
            <motion.div variants={item} className="w-16 h-1 bg-slate-900 mb-8"></motion.div>

            <motion.p 
              variants={item}
              className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              Sistem penilaian esai fisika otomatis berbasis kecerdasan buatan. 
              Menganalisis 4 representasi utama (Verbal, Matematik, Grafik, dan Visual/Fisik) 
              untuk memberikan evaluasi pemahaman yang komprehensif, objektif, dan instan 
              bagi guru maupun siswa.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4">
              <Link to="/register">
                <GlassButton variant="primary" className="px-10 py-4 text-sm font-bold tracking-widest">
                  COBA GRATIS
                </GlassButton>
              </Link>
              <Link to="/tentang">
                <GlassButton className="px-10 py-4 text-sm font-bold tracking-widest">
                  PELAJARI LEBIH LANJUT
                </GlassButton>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Grid Below */}
        <div className="max-w-6xl mx-auto px-6 mt-32 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 text-center">
            
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-heading font-bold mb-4 uppercase tracking-wide">Verbal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kemampuan menjelaskan konsep fisika dengan kata-kata yang logis dan tepat.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-xl font-heading font-bold mb-4 uppercase tracking-wide">Matematik</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kebenaran perhitungan, substitusi variabel, dan penurunan rumus secara matematis.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-xl font-heading font-bold mb-4 uppercase tracking-wide">Grafik</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interpretasi bentuk kurva dan pembuatan grafik dari data eksperimen fisis.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-xl font-heading font-bold mb-4 uppercase tracking-wide">Visual / Fisik</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Penggambaran situasi fisis seperti Free-Body Diagram dan visualisasi model.
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
