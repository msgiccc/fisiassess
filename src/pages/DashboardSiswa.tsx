import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Play, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardSiswa() {
  const { user } = useAuthStore();
  const [soalList, setSoalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSoal();
    }
  }, [user]);

  const fetchSoal = async () => {
    try {
      // Ambil ID kelas yang diikuti siswa
      const { data: myClasses, error: classError } = await supabase
        .from('class_members')
        .select('kelas_id')
        .eq('siswa_id', user?.id);

      if (classError) throw classError;

      const myClassIds = myClasses?.map(c => c.kelas_id) || [];

      let soalData: any[] = [];

      if (myClassIds.length > 0) {
        // Ambil semua soal aktif yang ditugaskan ke kelas siswa
        const { data, error: soalError } = await supabase
          .from('assessment_soal')
          .select(`
            id,
            judul,
            guru_id,
            profiles:guru_id ( nama )
          `)
          .eq('aktif', true)
          .in('kelas_id', myClassIds)
          .order('created_at', { ascending: false });

        if (soalError) throw soalError;
        soalData = data || [];
      }

      // Ambil riwayat jawaban siswa
      const { data: jawabanData, error: jawabanError } = await supabase
        .from('assessment_jawaban')
        .select('soal_id, skor_verbal, skor_matematik, skor_grafik, skor_visual')
        .eq('siswa_id', user?.id);

      if (jawabanError) throw jawabanError;

      const jawabanMap = new Map();
      jawabanData?.forEach(jawaban => {
        const totalSkor = Math.round(
          (jawaban.skor_verbal + jawaban.skor_matematik + jawaban.skor_grafik + jawaban.skor_visual) / 4
        );
        jawabanMap.set(jawaban.soal_id, totalSkor);
      });

      const formattedList = soalData?.map(soal => ({
        id: soal.id,
        judul: soal.judul,
        guru: (soal.profiles as any)?.nama || 'Guru',
        status: jawabanMap.has(soal.id) ? 'Selesai' : 'Belum Dikerjakan',
        skor: jawabanMap.get(soal.id),
      })) || [];

      setSoalList(formattedList);
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal mengambil data tugas dari database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Halo, {user?.name || 'Siswa'}!</h1>
        <p className="text-slate-500">Siap untuk berlatih soal fisika hari ini?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {loading ? (
          <p className="text-slate-500">Memuat daftar tugas...</p>
        ) : soalList.length === 0 ? (
          <p className="text-slate-500">Belum ada tugas yang tersedia.</p>
        ) : (
          soalList.map(tugas => (
            <GlassCard key={tugas.id} className="relative overflow-hidden">
              {tugas.status === 'Selesai' && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-900 px-4 py-1 text-xs font-bold rounded-bl-xl">
                  Selesai
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-1 mt-2">{tugas.judul}</h3>
              <p className="text-sm text-slate-500 mb-6">Guru: {tugas.guru}</p>
              
              {tugas.status === 'Belum Dikerjakan' ? (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-warning flex items-center">
                    <span className="w-2 h-2 rounded-full bg-warning mr-2 animate-pulse" />
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
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Skor Rata-rata: {tugas.skor}</span>
                  </div>
                  <Link to={`/hasil/${tugas.id}`} className="text-sm text-slate-900 hover:underline">
                    Lihat Hasil Detail
                  </Link>
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
