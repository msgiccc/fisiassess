import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Users, Copy, Plus, Check, Trash2, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManajemenKelas() {
  const { user } = useAuthStore();
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [namaKelas, setNamaKelas] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // State untuk modal Hapus Kelas
  const [classToDelete, setClassToDelete] = useState<any | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) fetchKelas();
  }, [user]);

  const fetchKelas = async () => {
    try {
      setLoading(true);
      // Fetch classes for this teacher
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_members (count)
        `)
        .eq('guru_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKelasList(data || []);
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal mengambil daftar kelas.');
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = () => {
    // Menghasilkan UUID v4 (sangat unik dan sulit ditebak) 
    // Contoh: 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed
    return crypto.randomUUID();
  };

  const handleBuatKelas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKelas.trim()) return;

    try {
      setIsCreating(true);
      const kodeInvite = generateInviteCode();
      
      const { error } = await supabase
        .from('classes')
        .insert([
          {
            guru_id: user?.id,
            nama_kelas: namaKelas,
            kode_invite: kodeInvite
          }
        ]);

      if (error) throw error;
      
      toast.success('Kelas berhasil dibuat!');
      setNamaKelas('');
      fetchKelas(); // Refresh list
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal membuat kelas.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = (kode: string) => {
    const inviteLink = `${window.location.origin}/join/${kode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedId(kode);
    toast.success('Link invite berhasil disalin!');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) return;
    if (deleteConfirmText !== classToDelete.nama_kelas) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classToDelete.id);

      if (error) throw error;

      toast.success(`Kelas ${classToDelete.nama_kelas} berhasil dihapus.`);
      setClassToDelete(null);
      setDeleteConfirmText('');
      fetchKelas(); // Refresh list
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal menghapus kelas.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manajemen Kelas & Siswa</h1>
        <p className="text-slate-500">Buat kelas baru dan bagikan link invite kepada siswa Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Buat Kelas */}
        <div className="lg:col-span-1">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-slate-900" /> Buat Kelas Baru
            </h2>
            <form onSubmit={handleBuatKelas} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Nama Kelas</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Fisika X IPA 1" 
                  className="glass-input w-full"
                  value={namaKelas}
                  onChange={e => setNamaKelas(e.target.value)}
                  required 
                />
              </div>
              <GlassButton type="submit" variant="primary" className="w-full" disabled={isCreating}>
                {isCreating ? 'Membuat...' : 'Buat Kelas'}
              </GlassButton>
            </form>
          </GlassCard>
        </div>

        {/* Daftar Kelas */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6">Daftar Kelas Saya</h2>
            
            {loading ? (
              <p className="text-center text-slate-500 py-8">Memuat kelas...</p>
            ) : kelasList.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Anda belum membuat kelas satupun.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kelasList.map((kelas) => (
                  <div key={kelas.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100 transition-colors">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-start justify-between">
                      <span className="truncate pr-2">{kelas.nama_kelas}</span>
                      <button 
                        onClick={() => { setClassToDelete(kelas); setDeleteConfirmText(''); }}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Hapus Kelas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{kelas.class_members[0].count} Siswa Tergabung</span>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="text-xs text-slate-500 truncate max-w-[200px]" title={kelas.kode_invite}>
                        Kode: <span className="text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded">{kelas.kode_invite.split('-')[0]}...</span>
                      </div>
                      <button
                        onClick={() => handleCopyLink(kelas.kode_invite)}
                        className="text-slate-900 hover:text-slate-900 transition-colors p-2 rounded-lg bg-primary/10 hover:bg-primary/30"
                        title="Salin Link Invite"
                      >
                        {copiedId === kelas.kode_invite ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

      </div>

      {/* Modal Konfirmasi Hapus Kelas */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setClassToDelete(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Hapus Kelas?</h2>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-sm text-red-200">
              <p className="font-bold mb-1">Peringatan Keras!</p>
              <p>
                Menghapus kelas ini juga akan <strong>menghapus semua soal/tugas</strong> yang pernah dibuat untuk kelas ini, 
                serta <strong>seluruh data jawaban siswa</strong> yang sudah mengumpulkan tugas tersebut secara permanen.
              </p>
            </div>

            <p className="text-sm text-slate-600 mb-2">
              Untuk mengonfirmasi penghapusan, silakan ketik ulang nama kelas:
              <br /><strong className="text-slate-900 select-none">{classToDelete.nama_kelas}</strong>
            </p>

            <input 
              type="text" 
              className="glass-input w-full border-red-500/50 focus:border-red-500 focus:ring-red-500 mb-6"
              placeholder="Ketik nama kelas di sini..."
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />

            <div className="flex space-x-3">
              <GlassButton 
                variant="primary" 
                className="flex-1 bg-slate-100 hover:bg-white/20 text-slate-900" 
                onClick={() => setClassToDelete(null)}
              >
                Batal
              </GlassButton>
              <GlassButton 
                variant="primary" 
                className="flex-1 bg-red-600 hover:bg-red-700 text-slate-900 border-red-500/50" 
                onClick={handleDeleteClass}
                disabled={deleteConfirmText !== classToDelete.nama_kelas || isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

    </DashboardLayout>
  );
}
