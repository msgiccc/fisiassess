import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BuatRubrikManual() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    kunci_verbal: '',
    kunci_matematik: '',
    kunci_grafik: '',
    kunci_visual: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase.from('assessment_soal').insert([
        {
          guru_id: user.id,
          judul: formData.judul,
          soal_text: 'EVALUASI MANUAL VIA EXCEL', // Teks dummy karena tidak dipakai
          kelas: 'MANUAL_EVAL', // Flag penanda khusus
          topik: 'MANUAL',
          kunci_verbal: formData.kunci_verbal,
          kunci_matematik: formData.kunci_matematik,
          kunci_grafik: formData.kunci_grafik,
          kunci_visual: formData.kunci_visual,
          aktif: true
        }
      ]);

      if (error) throw error;

      toast.success('Rubrik manual berhasil dibuat!');
      navigate('/input-esai');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Link to="/input-esai">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm border border-slate-100">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Buat Rubrik Manual</h1>
            <p className="text-slate-500">Tentukan kunci jawaban yang akan digunakan AI untuk menilai file Excel Anda.</p>
          </div>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Rubrik / Tugas</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="Contoh: Tugas Hukum Newton 1"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-800 border-b border-slate-100 pb-2">Kunci Jawaban 4 Representasi</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kunci Representasi Verbal (Penjelasan Konsep)</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={formData.kunci_verbal}
                  onChange={(e) => setFormData({ ...formData, kunci_verbal: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kunci Representasi Matematik (Rumus & Perhitungan)</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={formData.kunci_matematik}
                  onChange={(e) => setFormData({ ...formData, kunci_matematik: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kunci Representasi Grafik (Analisis Grafik)</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={formData.kunci_grafik}
                  onChange={(e) => setFormData({ ...formData, kunci_grafik: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kunci Representasi Visual / Fisik (Gambar / Diagram)</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={formData.kunci_visual}
                  onChange={(e) => setFormData({ ...formData, kunci_visual: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <GlassButton type="submit" variant="primary" disabled={loading}>
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" /> {loading ? 'Menyimpan...' : 'Simpan Rubrik'}
                </span>
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
