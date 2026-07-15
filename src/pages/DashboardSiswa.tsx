import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { BookOpen, CheckCircle2, TrendingUp, Award, Clock, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardSiswa() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTugas: 0,
    selesai: 0,
    belum: 0,
    rataRataSkor: 0,
    tugasTerbaru: [] as any[],
    skorTertinggi: 0,
    performaArray: [] as number[],
  });

  useEffect(() => {
    if (user?.id) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // Ambil kelas siswa
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
          .select('id, judul, topik, profiles:guru_id ( nama )')
          .eq('aktif', true)
          .in('kelas_id', myClassIds)
          .order('created_at', { ascending: false });

        if (soalError) throw soalError;
        allSoal = data || [];
      }

      // Ambil jawaban siswa
      const { data: jawabanData, error: jawabanError } = await supabase
        .from('assessment_jawaban')
        .select('soal_id, skor_verbal, skor_matematik, skor_grafik, skor_visual')
        .eq('siswa_id', user?.id);

      if (jawabanError) throw jawabanError;

      const jawabanMap = new Map<string, number>();
      let totalSkorAll = 0;
      let skorTertinggi = 0;

      jawabanData?.forEach((j: any) => {
        const rata = Math.round(
          (j.skor_verbal + j.skor_matematik + j.skor_grafik + j.skor_visual) / 4
        );
        jawabanMap.set(j.soal_id, rata);
        totalSkorAll += rata;
        if (rata > skorTertinggi) skorTertinggi = rata;
      });

      const selesai = jawabanMap.size;
      const belum = allSoal.length - selesai;
      const rataRataSkor = selesai > 0 ? Math.round(totalSkorAll / selesai) : 0;

      // 5 tugas terbaru
      const tugasTerbaru = allSoal.slice(0, 5).map((soal: any) => ({
        id: soal.id,
        judul: soal.judul,
        guru: (soal.profiles as any)?.nama || 'Guru',
        skor: jawabanMap.get(soal.id),
        status: jawabanMap.has(soal.id) ? 'Selesai' : 'Belum Dikerjakan',
      }));

      // Performa array untuk visual
      const performaArray = jawabanData?.map((j: any) =>
        Math.round((j.skor_verbal + j.skor_matematik + j.skor_grafik + j.skor_visual) / 4)
      ) || [];

      setStats({
        totalTugas: allSoal.length,
        selesai,
        belum,
        rataRataSkor,
        tugasTerbaru,
        skorTertinggi,
        performaArray,
      });
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal memuat statistik.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Halo, {user?.name || 'Siswa'}! 👋</h1>
        <p className="text-slate-500">Lihat perkembangan belajar fisika Anda.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="text-primary w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-xs">Total Tugas</p>
            <p className="text-2xl font-bold">{loading ? '-' : stats.totalTugas}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-xs">Selesai</p>
            <p className="text-2xl font-bold">{loading ? '-' : stats.selesai}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Clock className="text-amber-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-xs">Belum</p>
            <p className="text-2xl font-bold">{loading ? '-' : stats.belum}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Award className="text-indigo-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-xs">Rata-rata Skor</p>
            <p className="text-2xl font-bold">{loading ? '-' : stats.rataRataSkor}</p>
          </div>
        </GlassCard>
      </div>

      {/* Grafik Performa Mini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Grafik Performa</h2>
          </div>
          {loading ? (
            <p className="text-slate-400 text-sm">Memuat...</p>
          ) : stats.performaArray.length === 0 ? (
            <p className="text-slate-400 text-sm">Belum ada data. Kerjakan tugas Anda!</p>
          ) : (
            <div className="flex items-end space-x-2 h-32">
              {stats.performaArray.slice(-10).map((skor, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md transition-all duration-500 bg-gradient-to-t from-primary to-primary/40"
                    style={{ height: `${skor}%`, minHeight: '4px' }}
                    title={`Skor: ${skor}`}
                  />
                  <span className="text-[10px] text-slate-400 mt-1">{i + 1}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3 text-center">
            {stats.skorTertinggi > 0 && `Skor tertinggi Anda: ${stats.skorTertinggi}`}
          </p>
        </GlassCard>

        {/* Ringkasan Performa */}
        <GlassCard>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Ringkasan</h2>
          </div>
          {loading ? (
            <p className="text-slate-400 text-sm">Memuat...</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Tugas Selesai</span>
                <span className="font-bold text-lg">{stats.selesai}/{stats.totalTugas}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Persentase Penyelesaian</span>
                <span className="font-bold text-lg">
                  {stats.totalTugas > 0 ? Math.round((stats.selesai / stats.totalTugas) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Rata-rata Skor</span>
                <span className="font-bold text-lg">{stats.rataRataSkor}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Skor Tertinggi</span>
                <span className="font-bold text-lg text-emerald-500">{stats.skorTertinggi}</span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Tugas Terbaru */}
      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tugas Terbaru</h2>
          <Link to="/daftar-tugas" className="text-sm text-primary hover:underline font-medium">
            Lihat Semua
          </Link>
        </div>
        {loading ? (
          <p className="text-slate-400 text-sm">Memuat...</p>
        ) : stats.tugasTerbaru.length === 0 ? (
          <p className="text-slate-400 text-sm">Belum ada tugas yang tersedia.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.tugasTerbaru.map((tugas: any) => (
              <div key={tugas.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-900">{tugas.judul}</p>
                  <p className="text-xs text-slate-500">{tugas.guru}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {tugas.status === 'Selesai' ? (
                    <>
                      <span className="text-sm font-semibold text-emerald-500">{tugas.skor}</span>
                      <Link to={`/hasil/${tugas.id}`} className="text-xs text-primary hover:underline">
                        Detail
                      </Link>
                    </>
                  ) : (
                    <Link
                      to={`/kerjakan/${tugas.id}`}
                      className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Kerjakan
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </DashboardLayout>
  );
}
