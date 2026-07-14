import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Register() {
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const initialize = useAuthStore(state => state.initialize);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert into profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { id: authData.user.id, nama: name, nim, role }
          ]);

        if (profileError) {
          // If profile fails, log the error but still try to initialize
          console.error('Profile creation error:', profileError);
          toast.error('Gagal membuat profil pengguna. Pastikan skema database sudah dikonfigurasi.');
        } else {
          toast.success('Pendaftaran berhasil!');
        }

        await initialize();
        navigate(role === 'guru' ? '/dashboard' : '/dashboard-siswa');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hero-glow rounded-full blur-[100px] opacity-40 pointer-events-none" />
      
      <GlassCard className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-white tracking-tight inline-block mb-2">
            Fisi<span className="text-primary-glow">Assess.</span>
          </Link>
          <h2 className="text-xl text-gray-400">Buat akun baru</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Daftar Sebagai</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('siswa')}
                className={`py-2 rounded-xl border transition-all ${role === 'siswa' ? 'bg-primary-glow/20 border-primary-glow text-white' : 'glass-effect text-gray-400 hover:text-white'}`}
              >
                Siswa
              </button>
              <button
                type="button"
                onClick={() => setRole('guru')}
                className={`py-2 rounded-xl border transition-all ${role === 'guru' ? 'bg-secondary-glow/20 border-secondary-glow text-white' : 'glass-effect text-gray-400 hover:text-white'}`}
              >
                Guru
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="glass-input w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                required 
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder={role === 'siswa' ? "NIM / NISN" : "NIP"} 
                className="glass-input w-full"
                value={nim}
                onChange={e => setNim(e.target.value)}
                required 
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                className="glass-input w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password (min. 6 karakter)" 
                className="glass-input w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>
          </div>

          <GlassButton type="submit" variant="primary" className="w-full text-lg mt-4" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </GlassButton>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Sudah punya akun? <Link to="/login" className="text-primary-glow hover:underline">Masuk di sini</Link>
        </p>
      </GlassCard>
    </div>
  );
}
