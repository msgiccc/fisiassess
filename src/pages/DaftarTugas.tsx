import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Play, CheckCircle2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DaftarTugas() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [tugasList, setTugasList] = useState<any[]>([]);
  const [filter, setFilter] = useState<'semua' | 'belum' | 'selesai'>('semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.id) fetchTugas();
  }, [user]);

  const fetchTugas = async () => {
    try {
      const { data: myClasses, error: classError } = await supabase
        .from('class_members')
        .select('kelas_id')
        .eq('siswa_id', user?.id);

      if (classError) throw classError;
      const myClassIds = myClasses?.map(c => c.kelas_id) || [];

      let allSoal: any[] = [];
      if (myClassIds.length > 0) {
        const { data, error: soalError } = await supabase
          .from('assessment_soal')
          .select(`id, judul, topik, created_at, profiles:guru_id ( nama )`)
          .eq('aktif', true)
          .in('kelas_id', myClassIds)
          .order('created_at', { ascending: false });

        if (soalError) throw soalError;
        allSoal = data || [];
      }

      const { data: jawabanData, error: jawabanError } = await supabase
        .from('assessment_jawaban')
        .select('soal_id, skor_verbal, skor_matematik, skor_grafik, skor_visual, created_at')
        .eq('siswa_id', user?.id);

      if (jawabanError) throw jawabanError;

      const jawabanMap = new Map<string, any>();
      jawabanData?.forEach((j: any) => {
        jawabanMap.set(j.soal_id, {
          skor: Math.round((j.skor_verbal + j.skor_matematik + j.skor_grafik + j.skor_visual) / 4),
          dikerjakan: j.created_at,
        });
      });

      const formatted = allSoal.map((soal: any) => ({
        id: soal.id,
        judul: soal.judul,
        topik: soal.topik,
        guru: (soal.profiles as any)?.nama || 'Guru',
        createdAt: soal.created_at,
        status: jawabanMap.has(soal.id) ? 'Selesai' : 'Belum Dikerjakan',
        skor: jawabanMap.get(soal.id)?.skor || null,
        dikerjakan: jawabanMap.get(soal.id)?.dikerjakan || null,
      }));

      setTugasList(formatted);
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal memuat daftar tugas.');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = tugasList.filter(t => {
    if (filter === 'belum' && t.status !== 'Belum Dikerjakan') return false;
    if (filter === 'selesai' && t.status !== 'Selesai') return false;
    if (search && !t.judul.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Daftar Tugas</h1>
        <p className="text-slate-500">Semua tugas fisika yang tersedia untuk Anda.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari tugas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          {(['semua', 'belum', 'selesai'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'semua' ? 'Semua' : f === 'belum' ? 'Belum Dikerjakan' : 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <p className="text-slate-500">Memuat daftar tugas...</p>
      ) : filteredList.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-slate-400 text-lg mb-2">Tidak ada tugas ditemukan</p>
          <p className="text-slate-400 text-sm">
            {search ? 'Coba ubah kata kunci pencarian.' : 'Belum ada tugas yang ditugaskan ke kelas Anda.'}
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map(tugas => (
            <GlassCard key={tugas.id} className="relative overflow-hidden">
              {tugas.status === 'Selesai' && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-900 px-4 py-1 text-xs font-bold rounded-bl-xl">
                  Selesai
                </div>
              )}

              <h3 className="text-xl font-bold mb-1 mt-2">{tugas.judul}</h3>
              <div className="flex items-center space-x-3 text-sm text-slate-500 mb-4">
                <span>Guru: {tugas.guru}</span>
                {tugas.topik && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span>{tugas.topik}</span>
                  </>
                )}
              </div>

              {tugas.status === 'Belum Dikerjakan' ? (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-amber-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse" />
                    Belum dikerjakan
                  </div>
                  <Link to={`/kerjakan/${tugas.id}`}>
                    <GlassButton variant="primary" className="flex items-center space-x-2 px-4 py-2 text-sm">
                      <span>Kerjakan</span>
                      <Play className="w-4 h-4 fill-current" />
                    </GlassButton>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-2 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Skor: {tugas.skor}</span>
                  </div>
                  <Link
                    to={`/hasil/${tugas.id}`}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Lihat Hasil
                  </Link>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
