import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { supabase } from '../lib/supabase';
import { PlusCircle, FileText, ChevronRight, Edit, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function InputEsaiDashboard() {
  const { user } = useAuthStore();
  const [rubriks, setRubriks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRubriks();
  }, [user]);

  const fetchRubriks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('assessment_soal')
        .select('*')
        .eq('guru_id', user.id)
        .eq('topik', 'MANUAL_EVAL')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRubriks(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const moveToOnline = async (id: string) => {
    if (!window.confirm('Yakin ingin memindahkan rubrik ini menjadi Soal Online biasa?')) return;
    try {
      const { error } = await supabase
        .from('assessment_soal')
        .update({ topik: 'Umum' })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Rubrik berhasil dipindahkan ke mode Soal Online!');
      fetchRubriks();
    } catch (e: any) {
      toast.error('Gagal memindahkan: ' + e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Input Esai (Evaluasi Manual)</h1>
            <p className="text-slate-500">Buat rubrik dan unggah file Excel untuk mengevaluasi jawaban siswa secara massal.</p>
          </div>
          <Link to="/input-esai/buat">
            <GlassButton variant="primary">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Buat Rubrik Baru
              </span>
            </GlassButton>
          </Link>
        </div>

        <GlassCard className="p-8">
          <h2 className="text-xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Daftar Rubrik Manual Anda
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl w-full"></div>
              ))}
            </div>
          ) : rubriks.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Belum ada rubrik manual</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Anda belum membuat rubrik untuk evaluasi Excel. Buat rubrik pertama Anda sekarang.
              </p>
              <Link to="/input-esai/buat">
                <GlassButton variant="primary">Buat Rubrik Pertama</GlassButton>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {rubriks.map((rubrik) => (
                <div key={rubrik.id} className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-300">
                  <div className="flex-1">
                    <Link to={`/input-esai/${rubrik.id}`}>
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">
                        {rubrik.judul}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Dibuat pada: {new Date(rubrik.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => moveToOnline(rubrik.id)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                      title="Pindahkan ke Soal Online"
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                    <Link 
                      to={`/input-esai/edit/${rubrik.id}`}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title="Edit Rubrik"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <Link to={`/input-esai/${rubrik.id}`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors ml-2">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
