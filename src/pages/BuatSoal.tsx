import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Save } from 'lucide-react';

export default function BuatSoal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    judul: '',
    topik: '',
    soal_text: '',
    kunci_verbal: '',
    kunci_matematik: '',
    kunci_grafik: '',
    kunci_visual: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    navigate('/dashboard');
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
                <textarea name="kunci_verbal" onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Penjelasan konsep dengan kata-kata..." required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-secondary-glow mr-2"></span> Representasi Matematik
                </label>
                <textarea name="kunci_matematik" onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Persamaan dan perhitungan..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-accent mr-2"></span> Representasi Grafik
                </label>
                <textarea name="kunci_grafik" onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Deskripsi bentuk kurva/grafik yang benar..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></span> Representasi Visual / Fisik
                </label>
                <textarea name="kunci_visual" onChange={handleChange} className="glass-input w-full min-h-[100px]" placeholder="Deskripsi Free-Body Diagram atau ilustrasi..." required />
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <GlassButton type="submit" variant="primary" className="flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Simpan Soal</span>
            </GlassButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
