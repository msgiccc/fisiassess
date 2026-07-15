import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

type RubrikLevel = { s100: string; s75: string; s50: string; s25: string; s0: string };

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
  });
  const [activeReps, setActiveReps] = useState({
    verbal: true,
    matematik: true,
    grafik: true,
    visual: true
  });
  const [openTab, setOpenTab] = useState<string | null>('verbal');

  const [rubriks, setRubriks] = useState<Record<string, RubrikLevel>>({
    verbal: { s100: '', s75: '', s50: '', s25: '', s0: '' },
    matematik: { s100: '', s75: '', s50: '', s25: '', s0: '' },
    grafik: { s100: '', s75: '', s50: '', s25: '', s0: '' },
    visual: { s100: '', s75: '', s50: '', s25: '', s0: '' }
  });

  useEffect(() => {
    if (user?.id) fetchKelas();
    if (id) fetchSoalForEdit();
  }, [user, id]);

  const parseRubrik = (text: string): RubrikLevel => {
    if (!text) return { s100: '', s75: '', s50: '', s25: '', s0: '' };
    const parts = text.split(/Skor 100:|Skor 75:|Skor 50:|Skor 25:|Skor 0:/);
    return {
      s100: parts[1] ? parts[1].trim() : '',
      s75: parts[2] ? parts[2].trim() : '',
      s50: parts[3] ? parts[3].trim() : '',
      s25: parts[4] ? parts[4].trim() : '',
      s0: parts[5] ? parts[5].trim() : ''
    };
  };

  const formatRubrik = (rep: string) => {
    const r = rubriks[rep];
    return `Skor 100:\n${r.s100}\n\nSkor 75:\n${r.s75}\n\nSkor 50:\n${r.s50}\n\nSkor 25:\n${r.s25}\n\nSkor 0:\n${r.s0}`;
  };

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
        });
        setActiveReps({
          verbal: !!data.kunci_verbal,
          matematik: !!data.kunci_matematik,
          grafik: !!data.kunci_grafik,
          visual: !!data.kunci_visual,
        });
        setRubriks({
          verbal: parseRubrik(data.kunci_verbal),
          matematik: parseRubrik(data.kunci_matematik),
          grafik: parseRubrik(data.kunci_grafik),
          visual: parseRubrik(data.kunci_visual)
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

  const handleRubrikChange = (rep: string, level: keyof RubrikLevel, value: string) => {
    setRubriks(prev => ({
      ...prev,
      [rep]: {
        ...prev[rep],
        [level]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!activeReps.verbal && !activeReps.matematik && !activeReps.grafik && !activeReps.visual) {
      toast.error('Pilih setidaknya 1 representasi untuk dinilai.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        guru_id: user.id,
        judul: formData.judul,
        topik: formData.topik,
        kelas_id: formData.kelas_id || null,
        soal_text: formData.soal_text,
        kunci_verbal: activeReps.verbal ? formatRubrik('verbal') : '',
        kunci_matematik: activeReps.matematik ? formatRubrik('matematik') : '',
        kunci_grafik: activeReps.grafik ? formatRubrik('grafik') : '',
        kunci_visual: activeReps.visual ? formatRubrik('visual') : '',
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

  const renderRubrikForm = (rep: string, title: string, colorClass: string) => {
    if (!activeReps[rep as keyof typeof activeReps]) return null;
    
    const isOpen = openTab === rep;
    
    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 bg-white">
        <button 
          type="button"
          onClick={() => setOpenTab(isOpen ? null : rep)}
          className={`w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors ${isOpen ? 'border-b border-slate-200' : ''}`}
        >
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
            <span className="font-bold text-slate-700">Rubrik: {title}</span>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        
        {isOpen && (
          <div className="p-6 space-y-6">
            {[
              { level: 's100', label: 'Skor 100 (Sangat Baik / Lengkap)' },
              { level: 's75', label: 'Skor 75 (Baik / Sebagian Besar Benar)' },
              { level: 's50', label: 'Skor 50 (Cukup / Setengah Benar)' },
              { level: 's25', label: 'Skor 25 (Kurang / Hanya Sedikit Benar)' },
              { level: 's0', label: 'Skor 0 (Salah Total / Kosong)' }
            ].map(item => (
              <div key={item.level}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{item.label}</label>
                <textarea
                  required
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                  placeholder="Kriteria & Contoh Jawaban..."
                  value={rubriks[rep][item.level as keyof RubrikLevel]}
                  onChange={(e) => handleRubrikChange(rep, item.level as keyof RubrikLevel, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
            <h2 className="text-xl font-semibold border-b border-slate-200 pb-4">Rubrik Penilaian Representasi</h2>
            <p className="text-sm text-slate-500 -mt-2 mb-4">Pilih representasi mana saja yang akan dinilai, lalu isi rubrik bertingkat untuk masing-masingnya.</p>

            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.verbal} onChange={(e) => { if (!openTab) setOpenTab('verbal'); setActiveReps({...activeReps, verbal: e.target.checked}) }} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Verbal</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.matematik} onChange={(e) => { if (!openTab) setOpenTab('matematik'); setActiveReps({...activeReps, matematik: e.target.checked}) }} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Matematik</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.grafik} onChange={(e) => { if (!openTab) setOpenTab('grafik'); setActiveReps({...activeReps, grafik: e.target.checked}) }} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Grafik</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={activeReps.visual} onChange={(e) => { if (!openTab) setOpenTab('visual'); setActiveReps({...activeReps, visual: e.target.checked}) }} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="font-semibold text-slate-700">Visual / Fisik</span>
              </label>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-slate-800 border-b border-slate-100 pb-2 mb-4">Rubrik Bertingkat Setiap Representasi</h3>
              {renderRubrikForm('verbal', 'Representasi Verbal', 'bg-primary-glow')}
              {renderRubrikForm('matematik', 'Representasi Matematik', 'bg-secondary-glow')}
              {renderRubrikForm('grafik', 'Representasi Grafik', 'bg-accent')}
              {renderRubrikForm('visual', 'Representasi Visual / Fisik', 'bg-emerald-400')}
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
