import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Users, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DetailSoalGuru() {
  const { id } = useParams();
  const [soal, setSoal] = useState<any>(null);
  const [jawabanList, setJawabanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      // Fetch data soal
      const { data: soalData, error: soalError } = await supabase
        .from('assessment_soal')
        .select('*')
        .eq('id', id)
        .single();
        
      if (soalError) throw soalError;
      setSoal(soalData);

      // Fetch jawaban siswa untuk soal ini
      const { data: jawabanData, error: jawabanError } = await supabase
        .from('assessment_jawaban')
        .select(`
          *,
          profiles:siswa_id (nama, nim)
        `)
        .eq('soal_id', id)
        .order('created_at', { ascending: false });

      if (jawabanError) throw jawabanError;

      // Hitung skor rata-rata untuk masing-masing siswa
      const formattedJawaban = jawabanData?.map((j: any) => ({
        ...j,
        totalSkor: Math.round((j.skor_verbal + j.skor_matematik + j.skor_grafik + j.skor_visual) / 4)
      })) || [];

      setJawabanList(formattedJawaban);

    } catch (error: any) {
      console.error(error);
      toast.error('Gagal memuat detail tugas.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLayout><p className="p-8 text-slate-500">Memuat data tugas...</p></DashboardLayout>;
  }

  if (!soal) {
    return <DashboardLayout><p className="p-8 text-red-400">Tugas tidak ditemukan.</p></DashboardLayout>;
  }

  const rataRataTugas = jawabanList.length > 0 
    ? Math.round(jawabanList.reduce((acc, curr) => acc + curr.totalSkor, 0) / jawabanList.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold">Detail Tugas: {soal.judul}</h1>
        </div>
        <p className="text-slate-500 mb-8">Topik: {soal.topik} | Kelas: {soal.kelas || 'Semua Kelas'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GlassCard className="flex items-center space-x-4 border-l-4 border-l-primary-glow">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="text-slate-900 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Siswa yang Mengumpulkan</p>
              <p className="text-2xl font-bold">{jawabanList.length}</p>
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center space-x-4 border-l-4 border-l-accent">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Trophy className="text-accent w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Rata-rata Skor Kelas</p>
              <p className="text-2xl font-bold">{rataRataTugas}</p>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <h2 className="text-xl font-semibold mb-6">Daftar Pengumpulan Siswa</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="pb-3 px-4 font-medium">Nama Siswa</th>
                  <th className="pb-3 px-4 font-medium">NIM/NISN</th>
                  <th className="pb-3 px-4 font-medium text-center">Verbal</th>
                  <th className="pb-3 px-4 font-medium text-center">Matematik</th>
                  <th className="pb-3 px-4 font-medium text-center">Grafik</th>
                  <th className="pb-3 px-4 font-medium text-center">Visual</th>
                  <th className="pb-3 px-4 font-medium text-center text-slate-900">Total Skor</th>
                </tr>
              </thead>
              <tbody>
                {jawabanList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">Belum ada siswa yang mengerjakan tugas ini.</td>
                  </tr>
                ) : (
                  jawabanList.map((j) => {
                    let namaExcel = null;
                    if (!j.profiles?.nama && j.feedback) {
                      try {
                        const parsed = JSON.parse(j.feedback);
                        if (parsed.nama_excel) namaExcel = parsed.nama_excel + ' (Excel)';
                      } catch (e) {}
                    }
                    
                    return (
                      <tr key={j.id} className="border-b border-white/5 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-medium">{j.profiles?.nama || namaExcel || 'Siswa Tanpa Nama'}</td>
                        <td className="py-4 px-4 text-slate-500">{j.profiles?.nim || '-'}</td>
                        <td className="py-4 px-4 text-center text-slate-900">{j.skor_verbal}</td>
                        <td className="py-4 px-4 text-center text-slate-700">{j.skor_matematik}</td>
                        <td className="py-4 px-4 text-center text-accent">{j.skor_grafik}</td>
                        <td className="py-4 px-4 text-center text-emerald-400">{j.skor_visual}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-900 text-lg">{j.totalSkor}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
