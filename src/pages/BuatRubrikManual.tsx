import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Save, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

type RubrikLevel = { s100: string; s75: string; s50: string; s25: string; s0: string };

export default function BuatRubrikManual() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [judul, setJudul] = useState('');
  
  const [activeReps, setActiveReps] = useState({
    verbal: true,
    matematik: true,
    grafik: true,
    visual: true
  });

  const [rubriks, setRubriks] = useState<Record<string, RubrikLevel>>({
    verbal: { s100: '', s75: '', s50: '', s25: '', s0: '' },
    matematik: { s100: '', s75: '', s50: '', s25: '', s0: '' },
    grafik: { s100: '', s75: '', s50: '', s25: '', s0: '' },
    visual: { s100: '', s75: '', s50: '', s25: '', s0: '' }
  });

  const [openTab, setOpenTab] = useState<string | null>('verbal');

  useEffect(() => {
    if (id) fetchRubrikForEdit();
  }, [id]);

  const parseRubrik = (text: string) => {
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

  const fetchRubrikForEdit = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_soal')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setJudul(data.judul || '');
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
      toast.error('Gagal mengambil data rubrik');
    }
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

  const formatRubrik = (rep: string) => {
    const r = rubriks[rep];
    return `Skor 100:\n${r.s100}\n\nSkor 75:\n${r.s75}\n\nSkor 50:\n${r.s50}\n\nSkor 25:\n${r.s25}\n\nSkor 0:\n${r.s0}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validasi minimum 1 representasi aktif
    if (!activeReps.verbal && !activeReps.matematik && !activeReps.grafik && !activeReps.visual) {
      toast.error('Pilih setidaknya 1 representasi untuk dinilai.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        guru_id: user.id,
        judul: judul,
        soal_text: 'EVALUASI MANUAL VIA EXCEL',
        topik: 'MANUAL_EVAL',
        kunci_verbal: activeReps.verbal ? formatRubrik('verbal') : '',
        kunci_matematik: activeReps.matematik ? formatRubrik('matematik') : '',
        kunci_grafik: activeReps.grafik ? formatRubrik('grafik') : '',
        kunci_visual: activeReps.visual ? formatRubrik('visual') : '',
        aktif: true
      };

      if (id) {
        const { error } = await supabase.from('assessment_soal').update(payload).eq('id', id);
        if (error) throw error;
        toast.success('Rubrik manual bertingkat berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('assessment_soal').insert([payload]);
        if (error) throw error;
        toast.success('Rubrik manual bertingkat berhasil dibuat!');
      }

      navigate('/input-esai');
    } catch (error: any) {
      toast.error(error.message);
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
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center space-x-4">
          <Link to="/input-esai">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm border border-slate-100">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Buat Rubrik Manual</h1>
            <p className="text-slate-500">Tentukan kriteria bertingkat yang akan digunakan AI untuk menilai file Excel Anda.</p>
          </div>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Evaluasi Manual</label>
              <input
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="Contoh: Evaluasi Ulangan Harian Dinamika"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Pilih Representasi yang Dinilai</label>
              <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={activeReps.verbal} onChange={(e) => setActiveReps({...activeReps, verbal: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                  <span className="font-semibold text-slate-700">Verbal</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={activeReps.matematik} onChange={(e) => setActiveReps({...activeReps, matematik: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                  <span className="font-semibold text-slate-700">Matematik</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={activeReps.grafik} onChange={(e) => setActiveReps({...activeReps, grafik: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                  <span className="font-semibold text-slate-700">Grafik</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={activeReps.visual} onChange={(e) => setActiveReps({...activeReps, visual: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                  <span className="font-semibold text-slate-700">Visual / Fisik</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-slate-800 border-b border-slate-100 pb-2 mb-4">Pengaturan Rubrik Bertingkat</h3>
              {renderRubrikForm('verbal', 'Representasi Verbal', 'bg-primary-glow')}
              {renderRubrikForm('matematik', 'Representasi Matematik', 'bg-secondary-glow')}
              {renderRubrikForm('grafik', 'Representasi Grafik', 'bg-accent')}
              {renderRubrikForm('visual', 'Representasi Visual / Fisik', 'bg-emerald-400')}
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
