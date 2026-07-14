import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Send } from 'lucide-react';

export default function KerjakanSoal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jawaban, setJawaban] = useState({
    verbal: '',
    matematik: '',
    grafik: '',
    visual: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJawaban({ ...jawaban, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and redirect to result
    navigate(`/hasil/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <GlassCard className="mb-8 border-primary-glow/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Hukum Newton (Dinamika Partikel)</h1>
              <p className="text-sm text-gray-400">Topik: Mekanika | Guru: Pak Budi</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-warning flex items-center">
                <span className="w-2 h-2 rounded-full bg-warning mr-2 animate-pulse" />
                Sisa Waktu: 45:00
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-gray-200">
            Sebuah balok bermassa 5 kg berada di atas bidang miring licin dengan sudut kemiringan 30 derajat terhadap horizontal. 
            Jelaskan gaya-gaya yang bekerja pada balok tersebut, hitung percepatannya, gambarkan grafik kecepatan terhadap waktu, dan gambarkan diagram gaya (Free-Body Diagram)!
          </div>
        </GlassCard>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <GlassCard>
            <label className="block text-lg font-medium text-white mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-primary-glow mr-3"></span> 1. Representasi Verbal
            </label>
            <p className="text-sm text-gray-400 mb-4">Jelaskan dengan kata-kata gaya apa saja yang bekerja dan bagaimana pengaruhnya terhadap gerak benda.</p>
            <textarea name="verbal" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <GlassCard>
            <label className="block text-lg font-medium text-white mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-secondary-glow mr-3"></span> 2. Representasi Matematik
            </label>
            <p className="text-sm text-gray-400 mb-4">Tuliskan rumus hukum Newton dan hitung nilai percepatan balok (g = 10 m/s²).</p>
            <textarea name="matematik" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <GlassCard>
            <label className="block text-lg font-medium text-white mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-accent mr-3"></span> 3. Representasi Grafik
            </label>
            <p className="text-sm text-gray-400 mb-4">Deskripsikan bentuk grafik hubungan antara kecepatan (v) dan waktu (t).</p>
            <textarea name="grafik" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <GlassCard>
            <label className="block text-lg font-medium text-white mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-400 mr-3"></span> 4. Representasi Visual / Fisik
            </label>
            <p className="text-sm text-gray-400 mb-4">Deskripsikan arah vektor gaya berat (w), gaya normal (N), dan komponen gaya yang menyebabkan benda meluncur.</p>
            <textarea name="visual" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <div className="flex justify-end pt-4">
            <GlassButton type="submit" variant="primary" className="flex items-center space-x-2 px-8">
              <span>Kirim Jawaban & Evaluasi</span>
              <Send className="w-5 h-5 ml-2" />
            </GlassButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
