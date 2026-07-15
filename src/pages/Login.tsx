import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const initialize = useAuthStore(state => state.initialize);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await initialize();
      
      // Determine redirect based on profile role (fallback to dashboard-siswa)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else if (profile?.role === 'guru') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard-siswa');
      }
      
      toast.success('Berhasil login!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal login.');
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
          <h2 className="text-xl text-gray-400">Selamat datang kembali</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
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
                placeholder="Password" 
                className="glass-input w-full" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <GlassButton type="submit" variant="primary" className="w-full text-lg mt-4" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </GlassButton>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Belum punya akun? <Link to="/register" className="text-primary-glow hover:underline">Daftar sekarang</Link>
        </p>
      </GlassCard>
    </div>
  );
}
