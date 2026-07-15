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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative font-sans">
      
      <GlassCard className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-slate-900 tracking-tight inline-block mb-2">
            Fisi<span className="text-slate-900">Assess.</span>
          </Link>
          <h2 className="text-xl text-slate-500">Selamat datang kembali</h2>
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

        <p className="mt-8 text-center text-slate-500 text-sm">
          Belum punya akun? <Link to="/register" className="text-slate-900 hover:underline">Daftar sekarang</Link>
        </p>
      </GlassCard>
    </div>
  );
}
