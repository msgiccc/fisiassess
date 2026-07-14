import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function HasilSoal() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const data = [
    { representasi: 'Verbal', skor: 85, fullMark: 100 },
    { representasi: 'Matematik', skor: 90, fullMark: 100 },
    { representasi: 'Grafik', skor: 65, fullMark: 100 },
    { representasi: 'Visual', skor: 75, fullMark: 100 },
  ];

  const totalScore = Math.round((85 + 90 + 65 + 75) / 4);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12">
        <Link to={user?.role === 'guru' ? '/dashboard' : '/dashboard-siswa'} className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2">Hasil Evaluasi AI: Hukum Newton</h1>
        <p className="text-gray-400 mb-8">Dianalisis secara otomatis berdasarkan 4 representasi fisika.</p>

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
              <p className="text-gray-400 text-sm mb-1">Skor Akhir</p>
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
                <span className="text-xl font-bold text-primary-glow">85/100</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl">
                Jawaban sudah baik. Anda berhasil mengidentifikasi bahwa terdapat gaya berat dan gaya normal. Namun, penjelasan mengenai gaya gesek (karena bidang licin maka tidak ada) sebaiknya ditegaskan.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 rounded-full bg-secondary-glow mr-3"></span> Matematik
                </h3>
                <span className="text-xl font-bold text-secondary-glow">90/100</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl">
                Penurunan rumus \( \Sigma F = m \cdot a \) dan komponen gaya \( w \sin \theta = m \cdot a \) sangat tepat. Perhitungan matematis percepatan \( a = 10 \cdot \sin 30^\circ = 5 \) m/s² sepenuhnya benar.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 rounded-full bg-accent mr-3"></span> Grafik
                </h3>
                <span className="text-xl font-bold text-accent">65/100</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl">
                Anda menyebutkan bahwa kecepatan bertambah, namun kurang tepat dalam mendeskripsikan bentuk kurvanya. Karena percepatannya konstan, seharusnya grafik v-t berupa garis lurus miring ke atas (linear), bukan kurva lengkung (eksponensial).
              </p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 mr-3"></span> Visual / Fisik
                </h3>
                <span className="text-xl font-bold text-emerald-400">75/100</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl">
                Arah gaya normal tegak lurus bidang miring dan gaya berat lurus ke bawah sudah tepat. Tapi Anda lupa memproyeksikan gaya berat menjadi w_x dan w_y dalam deskripsi diagram gaya.
              </p>
            </GlassCard>

          </div>
        </div>

        {/* Saran Peningkatan Section */}
        <GlassCard className="mt-8 border-warning/30 bg-warning/5">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
              <span className="text-warning text-xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-warning mb-2">Saran Peningkatan</h3>
              <p className="text-gray-300 leading-relaxed">
                Anda perlu melatih kembali pemahaman pada <strong className="text-white">Representasi Grafik</strong>. Pelajari kembali materi tentang gerak lurus dengan percepatan konstan (GLBB) dan bagaimana bentuk grafiknya terhadap waktu. Berlatihlah menggambar grafik hubungan $v-t$ agar lebih terbiasa membedakan percepatan konstan (garis linear) dan percepatan berubah (kurva lengkung).
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
