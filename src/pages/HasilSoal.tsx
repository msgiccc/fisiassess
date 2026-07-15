import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function HasilSoal() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  const [soal, setSoal] = useState<any>(null);
  const [jawaban, setJawaban] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any>({});

  useEffect(() => {
    if (id && user) {
      fetchHasil();
    }
  }, [id, user]);

  const fetchHasil = async () => {
    try {
      // 1. Fetch Soal
      const { data: soalData, error: soalError } = await supabase
        .from('assessment_soal')
        .select('*')
        .eq('id', id)
        .single();
      
      if (soalError) throw soalError;
      setSoal(soalData);

      // 2. Fetch Jawaban
      // Jika guru, mungkin lihat berdasarkan id yang berbeda, tapi untuk MVP kita ambil jawaban user saat ini
      const { data: jawabanData, error: jawabanError } = await supabase
        .from('assessment_jawaban')
        .select('*')
        .eq('soal_id', id)
        .eq('siswa_id', user?.id)
        .single();

      if (jawabanError) {
        // Mungkin ini guru yang melihat hasil siswa, idealnya parameter URL harus mencakup siswa_id
        // Untuk MVP, anggap kita hanya lihat jawaban milik user yg login
        throw jawabanError;
      }
      
      setJawaban(jawabanData);
      if (jawabanData.feedback) {
        setFeedbacks(JSON.parse(jawabanData.feedback));
      }

    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat hasil atau belum dikerjakan.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><p className="p-8">Memuat hasil evaluasi...</p></DashboardLayout>;
  if (!jawaban) return <DashboardLayout><p className="p-8 text-red-400">Hasil tidak ditemukan.</p></DashboardLayout>;

  const data = [
    { representasi: 'Verbal', skor: jawaban.skor_verbal, fullMark: 100 },
    { representasi: 'Matematik', skor: jawaban.skor_matematik, fullMark: 100 },
    { representasi: 'Grafik', skor: jawaban.skor_grafik, fullMark: 100 },
    { representasi: 'Visual', skor: jawaban.skor_visual, fullMark: 100 },
  ];

  const totalScore = Math.round(
    (jawaban.skor_verbal + jawaban.skor_matematik + jawaban.skor_grafik + jawaban.skor_visual) / 4
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12">
        <Link to={user?.role === 'guru' ? '/dashboard' : '/dashboard-siswa'} className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2">Hasil Evaluasi: {soal?.judul}</h1>
        <p className="text-slate-500 mb-8">Dianalisis secara otomatis berdasarkan 4 representasi fisika.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Radar Chart Section */}
          <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center p-8">
            <div className="w-48 h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="representasi" stroke="#a1a1aa" fontSize={12} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" />
                  <Tooltip contentStyle={{ backgroundColor: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Radar name="Skor Siswa" dataKey="skor" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-1">Skor Akhir</p>
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-secondary-glow">
                {totalScore}
              </h2>
            </div>
          </GlassCard>

          {/* Feedback Section */}
          <div className="lg:col-span-2 space-y-4">
            
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 rounded-full bg-primary-glow mr-3"></span> Verbal
                </h3>
                <span className="text-xl font-bold text-slate-900">{jawaban.skor_verbal}/100</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                {feedbacks.verbal || 'Tidak ada feedback.'}
              </p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 rounded-full bg-secondary-glow mr-3"></span> Matematik
                </h3>
                <span className="text-xl font-bold text-slate-700">{jawaban.skor_matematik}/100</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                {feedbacks.matematik || 'Tidak ada feedback.'}
              </p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 rounded-full bg-accent mr-3"></span> Grafik
                </h3>
                <span className="text-xl font-bold text-accent">{jawaban.skor_grafik}/100</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                {feedbacks.grafik || 'Tidak ada feedback.'}
              </p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 mr-3"></span> Visual / Fisik
                </h3>
                <span className="text-xl font-bold text-emerald-400">{jawaban.skor_visual}/100</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                {feedbacks.visual || 'Tidak ada feedback.'}
              </p>
            </GlassCard>

          </div>
        </div>

        {/* Saran Peningkatan Section (General) */}
        {totalScore < 80 && (
          <GlassCard className="mt-8 border-warning/30 bg-warning/5">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                <span className="text-warning text-xl">💡</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-warning mb-2">Saran Peningkatan Umum</h3>
                <p className="text-slate-600 leading-relaxed">
                  Skor akhir Anda masih di bawah 80. Silakan tinjau kembali bagian representasi yang memiliki skor paling rendah (di bawah 70) pada panel di atas. Anda dapat membaca kembali materi terkait dan melatih representasi tersebut agar pemahaman fisika Anda lebih komprehensif.
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
}
