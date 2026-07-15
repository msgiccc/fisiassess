import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function BuatSoal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    judul: '',
    topik: '',
    kelas_id: '',
    soal_text: '',
    kunci_verbal: '',
    kunci_matematik: '',
    kunci_grafik: '',
    kunci_visual: '',
  });
  const [activeReps, setActiveReps] = useState({
    verbal: true,
    matematik: true,
    grafik: true,
    visual: true
  });

  useEffect(() => {
    if (user?.id) fetchKelas();
    if (id) fetchSoalForEdit();
  }, [user, id]);

  const fetchSoalForEdit = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_soal')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          judul: data.judul || '',
          topik: data.topik || '',
          kelas_id: data.kelas_id || '',
          soal_text: data.soal_text || '',
          kunci_verbal: data.kunci_verbal || '',
          kunci_matematik: data.kunci_matematik || '',
          kunci_grafik: data.kunci_grafik || '',
          kunci_visual: data.kunci_visual || '',
        });
        setActiveReps({
          verbal: !!data.kunci_verbal,
          matematik: !!data.kunci_matematik,
          grafik: !!data.kunci_grafik,
          visual: !!data.kunci_visual,
        });
      }
    } catch (e) {
      toast.error('Gagal mengambil data soal');
    }
  };

  const fetchKelas = async () => {
    const { data } = await supabase
      .from('classes')
      .select('id, nama_kelas')
      .eq('guru_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setKelasList(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const payload = {
        guru_id: user.id,
        judul: formData.judul,
        topik: formData.topik,
        kelas_id: formData.kelas_id || null,
        soal_text: formData.soal_text,
        kunci_verbal: activeReps.verbal ? formData.kunci_verbal : '',
        kunci_matematik: activeReps.matematik ? formData.kunci_matematik : '',
        kunci_grafik: activeReps.grafik ? formData.kunci_grafik : '',
        kunci_visual: activeReps.visual ? formData.kunci_visual : '',
        aktif: true
      };

      if (id) {
        const { error } = await supabase.from('assessment_soal').update(payload).eq('id', id);
        if (error) throw error;
        toast.success('Soal berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('assessment_soal').insert([payload]);
        if (error) throw error;
        toast.success('Soal berhasil dibuat!');
      }

      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan soal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-heading mb-2">{id ? 'Edit Soal' : 'Buat Soal Baru'}</h1>
          <p className="text-slate-500">{id ? 'Modifikasi detail soal dan rubrik yang sudah ada.' : 'Rancang soal fisika komprehensif beserta rubrik penilaian AI.'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <GlassCard className="space-y-6">
            <h2 className="text-xl font-semibold border-b border-slate-200 pb-4">Informasi Umum</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Judul Soal</label>
                <input 
                  name="judul" 
                  value={formData.judul} 
                  onChange={handleChange}
                  className="glass-input w-full" 
                  placeholder="Contoh: Balok pada Bidang Miring" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Topik</label>
                <input 
                  name="topik" 
                  value={formData.topik} 
                  onChange={handleChange}
                  className="glass-input w-full" 
                  placeholder="Hukum Newton" 
                  required 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2">Tugaskan ke Kelas (Pilih Kelas)</label>
                <select 
                  name="kelas_id" 
                  value={formData.kelas_id} 
                  onChange={handleChange as any}
                  className="glass-input w-full md:w-1/2" 
                  required
                >
                  <option value="" disabled>-- Pilih Kelas --</option>
                  {kelasList.map(k => (
                    <option key={k.id} value={k.id} className="bg-slate-50">{k.nama_kelas}</option>
                  ))}
                </select>
                {kelasList.length === 0 && (
                  <p className="text-red-400 text-xs mt-2">Anda belum membuat kelas. Silakan buat kelas terlebih dahulu di menu Manajemen Kelas.</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Deskripsi Soal</label>
              <textarea 
                name="soal_text" 
                value={formData.soal_text} 
                onChange={handleChange}
                className="glass-input w-full min-h-[120px] py-3" 
                placeholder="Tuliskan narasi soal fisika di sini..." 
                required 
              />
            </div>
          </GlassCard>

          <GlassCard className="space-y-6">
            <h2 className="text-xl font-semibold border-b border-slate-200 pb-4">Kunci Jawaban Representasi</h2>
            <p className="text-sm text-slate-500 -mt-2 mb-4">Pilih representasi mana saja yang akan diujikan, lalu isi kunci jawabannya.</p>

            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.verbal} onChange={(e) => setActiveReps({...activeReps, verbal: e.target.checked})} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Verbal</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.matematik} onChange={(e) => setActiveReps({...activeReps, matematik: e.target.checked})} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Matematik</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.grafik} onChange={(e) => setActiveReps({...activeReps, grafik: e.target.checked})} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Grafik</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.visual} onChange={(e) => setActiveReps({...activeReps, visual: e.target.checked})} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Visual / Fisik</span>
              </label>
            </div>

            <div className="space-y-6">
              {activeReps.verbal && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-primary-glow mr-2"></span> Representasi Verbal
                </label>
                <textarea name="kunci_verbal" value={formData.kunci_verbal} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Penjelasan konsep dengan kata-kata..." required />
              </div>
              )}
              
              {activeReps.matematik && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-secondary-glow mr-2"></span> Representasi Matematik
                </label>
                <textarea name="kunci_matematik" value={formData.kunci_matematik} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Persamaan dan perhitungan..." required />
              </div>
              )}

              {activeReps.grafik && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-accent mr-2"></span> Representasi Grafik
                </label>
                <textarea name="kunci_grafik" value={formData.kunci_grafik} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Deskripsi bentuk kurva/grafik yang benar..." required />
              </div>
              )}

              {activeReps.visual && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></span> Representasi Visual / Fisik
                </label>
                <textarea name="kunci_visual" value={formData.kunci_visual} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Deskripsi Free-Body Diagram atau ilustrasi..." required />
              </div>
              )}
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <GlassButton type="submit" variant="primary" className="flex items-center space-x-2" disabled={loading}>
              <Save className="w-5 h-5" />
              <span>{loading ? 'Menyimpan...' : (id ? 'Update Soal' : 'Simpan Soal')}</span>
            </GlassButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
