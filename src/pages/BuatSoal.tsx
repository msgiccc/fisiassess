import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function BuatSoal() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    topik: '',
    kelas: '',
    soal_text: '',
    kunci_verbal: '',
    kunci_matematik: '',
    kunci_grafik: '',
    kunci_visual: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('assessment_soal').insert([
        {
          guru_id: user.id,
          judul: formData.judul,
          topik: formData.topik,
          kelas: formData.kelas,
          soal_text: formData.soal_text,
          kunci_verbal: formData.kunci_verbal,
          kunci_matematik: formData.kunci_matematik,
          kunci_grafik: formData.kunci_grafik,
          kunci_visual: formData.kunci_visual,
          aktif: true
        }
      ]);

      if (error) throw error;
      
      toast.success('Berhasil menyimpan soal!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Gagal menyimpan soal. Pastikan skema tabel assessment_soal sudah ada.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <h1 className="text-3xl font-bold mb-2">Buat Soal Baru</h1>
        <p className="text-gray-400 mb-8">Masukkan deskripsi soal dan kunci jawaban untuk setiap representasi.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <GlassCard className="space-y-6">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Informasi Umum</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Judul Soal</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Topik</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Kelas (Opsional)</label>
                <input 
                  name="kelas" 
                  value={formData.kelas} 
                  onChange={handleChange}
                  className="glass-input w-full md:w-1/2" 
                  placeholder="Contoh: X MIPA 1" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Soal</label>
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
            <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Kunci Jawaban 4 Representasi</h2>
            <p className="text-sm text-gray-400 -mt-2 mb-4">Kunci ini akan digunakan AI untuk mengevaluasi jawaban siswa.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-primary-glow mr-2"></span> Representasi Verbal
                </label>
                <textarea name="kunci_verbal" value={formData.kunci_verbal} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Penjelasan konsep dengan kata-kata..." required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-secondary-glow mr-2"></span> Representasi Matematik
                </label>
                <textarea name="kunci_matematik" value={formData.kunci_matematik} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Persamaan dan perhitungan..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-accent mr-2"></span> Representasi Grafik
                </label>
                <textarea name="kunci_grafik" value={formData.kunci_grafik} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Deskripsi bentuk kurva/grafik yang benar..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></span> Representasi Visual / Fisik
                </label>
                <textarea name="kunci_visual" value={formData.kunci_visual} onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Deskripsi Free-Body Diagram atau ilustrasi..." required />
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <GlassButton type="submit" variant="primary" className="flex items-center space-x-2" disabled={loading}>
              <Save className="w-5 h-5" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Soal'}</span>
            </GlassButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
