import { motion } from 'framer-motion';
import { GlassNavbar } from '../components/ui/GlassNavbar';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

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
    <div className="min-h-screen bg-accent text-slate-900 font-sans">
      <GlassNavbar />

      <main className="relative pt-32 pb-16 w-full max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 min-h-[70vh]">
          
          {/* Left Column: Text Content */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full lg:w-1/2 pt-10"
          >
            <motion.h1 
              variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-slate-900 leading-[1.1] mb-6"
            >
              Empowering You with Digital <span className="text-secondary">Skills</span>
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed"
            >
              Our platform makes education flexible and convenient, so you can achieve your goals wherever and whenever you choose.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link to="/register">
                <button className="bg-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-primary-glow transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                  Join Our Course
                </button>
              </Link>
            </motion.div>

            {/* Review Avatars */}
            <motion.div variants={item} className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-4 border-accent object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="User 1" />
                <img className="w-12 h-12 rounded-full border-4 border-accent object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" alt="User 2" />
                <img className="w-12 h-12 rounded-full border-4 border-accent object-cover" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" alt="User 3" />
                <img className="w-12 h-12 rounded-full border-4 border-accent object-cover" src="https://images.unsplash.com/photo-1488161628813-04466f872507?q=80&w=200&auto=format&fit=crop" alt="User 4" />
                <div className="w-12 h-12 rounded-full border-4 border-accent bg-slate-800 text-white flex items-center justify-center text-sm font-bold z-10">+</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center text-primary gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-slate-900 font-bold ml-1">(4.5)</span>
                </div>
                <span className="text-sm text-slate-500 font-medium">1000+ Review of our course</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Image with special shape */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative flex justify-end"
          >
            <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[4rem] rounded-bl-[8rem] rounded-tr-[8rem] overflow-hidden bg-primary/10">
              <img 
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2000&auto=format&fit=crop" 
                alt="Student with books" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute bottom-10 left-0 bg-white p-4 rounded-full shadow-xl flex items-center justify-center w-28 h-28 border-4 border-accent">
              <div className="relative w-full h-full animate-[spin_10s_linear_infinite] flex items-center justify-center text-xs font-bold text-slate-600 tracking-widest uppercase">
                <div className="absolute top-0">E-</div>
                <div className="absolute bottom-0">LEARNING</div>
                <div className="absolute right-0 rotate-90">STUDY</div>
                <div className="absolute left-0 -rotate-90">ONLINE</div>
                <div className="absolute w-8 h-8 rounded-full bg-secondary flex items-center justify-center z-10">
                  <div className="text-white text-lg">+</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Brand Logos */}
        <div className="w-full mt-24 mb-16 text-center">
          <p className="text-slate-500 font-medium mb-8">Trusted by 200+ Brand</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-50 grayscale">
            <span className="text-2xl font-bold font-heading">Medtronic</span>
            <span className="text-2xl font-bold font-heading">Dropbox</span>
            <span className="text-2xl font-bold font-heading">Google</span>
            <span className="text-2xl font-bold font-heading">Medium</span>
            <span className="text-2xl font-bold font-heading">slack</span>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-32 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading max-w-lg">
              Start Exploring: Find Your Perfect <span className="text-primary">Category</span>
            </h2>
            <p className="text-slate-500 max-w-sm mt-4 md:mt-0">
              Dive into our diverse range of categories and discover the ideal course to match your interests and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white rotate-45 group-hover:rotate-0 transition-all">
                  ↑
                </div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&auto=format&fit=crop" alt="Data Analytics" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading mb-2">Data Analytics</h3>
                <p className="text-slate-500 text-sm">Master data-driven decision-making with essential analytics skills and tools.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#fcf6e8] rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold font-heading mb-2">Marketing</h3>
                <p className="text-slate-500 text-sm mb-6">Marketing is the art of connecting brands with people, driving engagement.</p>
                <div className="flex justify-between items-end mt-auto">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white rotate-45 group-hover:rotate-0 transition-all">
                    ↑
                  </div>
                  <div className="w-32 h-24 rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop" alt="Marketing" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white rotate-45 group-hover:rotate-0 transition-all">
                  ↑
                </div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=200&auto=format&fit=crop" alt="UI UX" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading mb-2">UI/UX</h3>
                <p className="text-slate-500 text-sm">UI/UX design focuses on creating seamless, intuitive, and visually appealing experiences.</p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
