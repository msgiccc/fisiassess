import { motion } from 'framer-motion';
import { GlassNavbar } from '../components/ui/GlassNavbar';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, CheckCircle } from 'lucide-react';

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
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <GlassNavbar />

      <main className="flex-grow pt-32 pb-16 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Hero Section */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col items-center mt-12"
        >
          <motion.div variants={item} className="mb-4 inline-block bg-primary-pale text-primary-light px-4 py-1.5 rounded-full text-sm font-semibold border border-primary-pale">
            Platform Penilaian Edukasi Terpadu
          </motion.div>
          
          <motion.h1 
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 max-w-4xl"
          >
            FisiAssess — Sistem Penilaian Esai Fisika <span className="text-primary">Multi-Representasi</span>
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed"
          >
            Membantu Guru Menilai 4 Representasi secara Otomatis: Verbal, Matematik, Grafik, dan Visual.
          </motion.p>
          
          <motion.div variants={item} className="flex gap-4">
            <Link to="/register">
              <button className="btn-primary flex items-center gap-2">
                Coba Sekarang
              </button>
            </Link>
            <Link to="/login">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                Masuk sebagai Tamu (Demo)
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* 3 Langkah Cara Kerja */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full mt-32 mb-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Cara Kerja Sistem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-pale text-primary rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Buat Soal Fisika</h3>
              <p className="text-slate-500 text-sm">
                Guru membuat soal esai fisika melalui dashboard yang telah disediakan dan membagikan tautan kepada siswa.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-pale text-primary rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Kerjakan Online</h3>
              <p className="text-slate-500 text-sm">
                Siswa mengerjakan secara online dengan mengisi 4 komponen representasi: verbal, matematik, grafik, dan visual.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-pale text-primary rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Hasil & Umpan Balik</h3>
              <p className="text-slate-500 text-sm">
                Sistem menampilkan skor per representasi secara otomatis beserta umpan balik diagnostik yang konstruktif.
              </p>
            </div>

          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-slate-200 bg-white">
        <p className="text-slate-500 font-medium text-sm">FisiAssess — PKM-KC AMLI 2026</p>
      </footer>
    </div>
  );
}
