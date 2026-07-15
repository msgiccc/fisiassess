import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { evaluateAnswer } from '../lib/openrouter';
import toast from 'react-hot-toast';

export default function KerjakanSoal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [soal, setSoal] = useState<any>(null);
  const [loadingSoal, setLoadingSoal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [jawaban, setJawaban] = useState({
    verbal: '',
    matematik: '',
    grafik: '',
    visual: '',
  });

  useEffect(() => {
    if (id) fetchSoal(id);
  }, [id]);

  const fetchSoal = async (soalId: string) => {
    try {
      const { data, error } = await supabase
        .from('assessment_soal')
        .select(`*, profiles:guru_id ( nama )`)
        .eq('id', soalId)
        .single();
        
      if (error) throw error;
      setSoal(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat soal.');
    } finally {
      setLoadingSoal(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJawaban({ ...jawaban, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !soal) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading('Sedang memproses penilaian otomatis... (Ini mungkin memakan waktu beberapa detik)');
    
    try {
      // Panggil OpenRouter API untuk ke-4 representasi secara paralel
      const [hasilVerbal, hasilMatematik, hasilGrafik, hasilVisual] = await Promise.all([
        evaluateAnswer(soal.soal_text, soal.kunci_verbal, jawaban.verbal, "Verbal"),
        evaluateAnswer(soal.soal_text, soal.kunci_matematik, jawaban.matematik, "Matematik"),
        evaluateAnswer(soal.soal_text, soal.kunci_grafik, jawaban.grafik, "Grafik"),
        evaluateAnswer(soal.soal_text, soal.kunci_visual, jawaban.visual, "Visual / Fisik"),
      ]);

      const feedbackString = JSON.stringify({
        verbal: hasilVerbal.feedback,
        matematik: hasilMatematik.feedback,
        grafik: hasilGrafik.feedback,
        visual: hasilVisual.feedback,
      });

      // Simpan hasil ke Supabase
      const { error } = await supabase.from('assessment_jawaban').insert([
        {
          soal_id: soal.id,
          siswa_id: user.id,
          jawaban_verbal: jawaban.verbal,
          jawaban_matematik: jawaban.matematik,
          jawaban_grafik: jawaban.grafik,
          jawaban_visual: jawaban.visual,
          skor_verbal: hasilVerbal.skor,
          skor_matematik: hasilMatematik.skor,
          skor_grafik: hasilGrafik.skor,
          skor_visual: hasilVisual.skor,
          feedback: feedbackString,
        }
      ]);

      if (error) throw error;

      toast.success('Evaluasi selesai!', { id: toastId });
      navigate(`/hasil/${soal.id}`);
      
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal memproses atau menyimpan jawaban.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSoal) {
    return (
      <DashboardLayout>
        <p className="text-slate-500 p-8">Memuat soal...</p>
      </DashboardLayout>
    );
  }

  if (!soal) {
    return (
      <DashboardLayout>
        <p className="text-red-400 p-8">Soal tidak ditemukan.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <GlassCard className="mb-8 border-primary-glow/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{soal.judul}</h1>
              <p className="text-sm text-slate-500">Topik: {soal.topik} | Guru: {soal.profiles?.nama || 'Guru'}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-gray-200 whitespace-pre-wrap">
            {soal.soal_text}
          </div>
        </GlassCard>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <GlassCard>
            <label className="block text-lg font-medium text-slate-900 mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-primary-glow mr-3"></span> 1. Representasi Verbal
            </label>
            <p className="text-sm text-slate-500 mb-4">Jelaskan dengan kata-kata gaya apa saja yang bekerja dan bagaimana pengaruhnya terhadap gerak benda.</p>
            <textarea name="verbal" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <GlassCard>
            <label className="block text-lg font-medium text-slate-900 mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-secondary-glow mr-3"></span> 2. Representasi Matematik
            </label>
            <p className="text-sm text-slate-500 mb-4">Tuliskan rumus hukum Newton dan hitung nilai percepatan balok (g = 10 m/s²).</p>
            <textarea name="matematik" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <GlassCard>
            <label className="block text-lg font-medium text-slate-900 mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-accent mr-3"></span> 3. Representasi Grafik
            </label>
            <p className="text-sm text-slate-500 mb-4">Deskripsikan bentuk grafik hubungan antara kecepatan (v) dan waktu (t).</p>
            <textarea name="grafik" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <GlassCard>
            <label className="block text-lg font-medium text-slate-900 mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-400 mr-3"></span> 4. Representasi Visual / Fisik
            </label>
            <p className="text-sm text-slate-500 mb-4">Deskripsikan arah vektor gaya berat (w), gaya normal (N), dan komponen gaya yang menyebabkan benda meluncur.</p>
            <textarea name="visual" onChange={handleChange} className="glass-input w-full min-h-[120px]" placeholder="Jawaban Anda..." required />
          </GlassCard>

          <div className="flex justify-end pt-4">
            <GlassButton type="submit" variant="primary" className="flex items-center space-x-2 px-8" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Mengevaluasi...' : 'Kirim Jawaban & Evaluasi'}</span>
              <Send className="w-5 h-5 ml-2" />
            </GlassButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
