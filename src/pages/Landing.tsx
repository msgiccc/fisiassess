import { motion } from 'framer-motion';
import { GlassNavbar } from '../components/ui/GlassNavbar';
import { GlassButton } from '../components/ui/GlassButton';
import { ArrowRight, BrainCircuit, PenTool, Calculator, AreaChart } from 'lucide-react';
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
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen bg-dark-900 overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hero-glow rounded-full blur-[100px] opacity-60 pointer-events-none" />
      
      <GlassNavbar />

      <main className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Hero Title */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.h1 
            variants={item}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-6"
          >
            Fisi<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-secondary-glow">Assess</span> AI
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Sistem penilaian esai fisika otomatis berbasis kecerdasan buatan. 
            Menganalisis 4 representasi untuk pemahaman yang komprehensif.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <GlassButton variant="primary" className="flex items-center space-x-2 px-8 py-4 text-lg">
                <span>Coba Gratis</span>
                <ArrowRight className="w-5 h-5" />
              </GlassButton>
            </Link>
            <Link to="/tentang">
              <GlassButton className="px-8 py-4 text-lg">
                Pelajari Lebih Lanjut
              </GlassButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* 4 Representations Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 w-full"
        >
          <div className="glass-card hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6 text-primary-glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verbal</h3>
            <p className="text-sm text-gray-400">Kemampuan menjelaskan konsep fisika dengan kata-kata yang tepat.</p>
          </div>

          <div className="glass-card hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-secondary-glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Matematik</h3>
            <p className="text-sm text-gray-400">Kebenaran perhitungan dan penurunan rumus secara matematis.</p>
          </div>

          <div className="glass-card hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <AreaChart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Grafik</h3>
            <p className="text-sm text-gray-400">Interpretasi dan pembuatan grafik atau diagram data fisis.</p>
          </div>

          <div className="glass-card hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual / Fisik</h3>
            <p className="text-sm text-gray-400">Penggambaran situasi fisis seperti Free-Body Diagram.</p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
