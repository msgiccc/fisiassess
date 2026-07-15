import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JoinKelas() {
  const { kode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [kelasData, setKelasData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);

  useEffect(() => {
    if (kode) fetchKelasInfo();
  }, [kode]);

  const fetchKelasInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, nama_kelas, profiles:guru_id(nama)')
        .eq('kode_invite', kode)
        .single();

      if (error || !data) throw new Error('Kelas tidak ditemukan atau link tidak valid.');
      
      setKelasData(data);
    } catch (error: any) {
      setErrorStr(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      // Save intent to localStorage so we can redirect back here after login
      localStorage.setItem('redirectAfterLogin', `/join/${kode}`);
      toast('Silakan login atau daftar terlebih dahulu sebagai Siswa.', { icon: 'ℹ️' });
      navigate('/login');
      return;
    }

    if (user.role !== 'siswa') {
      toast.error('Hanya akun Siswa yang dapat bergabung ke kelas.');
      return;
    }

    try {
      setJoining(true);
      
      const { error } = await supabase
        .from('class_members')
        .insert([
          { kelas_id: kelasData.id, siswa_id: user.id }
        ]);

      if (error) {
        // Handle unique violation (already joined)
        if (error.code === '23505') {
          toast.success(`Anda sudah tergabung di kelas ${kelasData.nama_kelas}.`);
          navigate('/dashboard-siswa');
          return;
        }
        throw error;
      }

      toast.success(`Berhasil bergabung ke kelas ${kelasData.nama_kelas}!`);
      navigate('/dashboard-siswa');
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal bergabung ke kelas.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hero-glow rounded-full blur-[100px] opacity-40 pointer-events-none" />
      
      <GlassCard className="w-full max-w-md relative z-10 text-center p-8">
        <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight inline-block mb-8">
          Fisi<span className="text-slate-900">Assess.</span>
        </Link>

        {errorStr ? (
          <div>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Gagal Bergabung</h2>
            <p className="text-slate-500 mb-6">{errorStr}</p>
            <GlassButton onClick={() => navigate('/')} className="w-full">
              Kembali ke Beranda
            </GlassButton>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Users className="text-slate-900 w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Undangan Kelas</h2>
            <p className="text-slate-500 mb-6">
              Guru <strong className="text-slate-900">{kelasData.profiles.nama}</strong> mengundang Anda untuk bergabung ke kelas:
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 mb-8 inline-block">
              <p className="text-xl font-bold text-slate-900">{kelasData.nama_kelas}</p>
            </div>

            <GlassButton 
              variant="primary" 
              className="w-full text-lg py-3" 
              onClick={handleJoin}
              disabled={joining}
            >
              {joining ? 'Memproses...' : 'Bergabung ke Kelas'}
            </GlassButton>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
