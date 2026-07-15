import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex w-full font-sans">
      {/* Left Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-heading text-slate-900 mb-3">Welcome Back!</h1>
            <p className="text-sm text-slate-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Email" 
                className="glass-input w-full text-center" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="glass-input w-full text-center" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>

            <GlassButton type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Login'}
            </GlassButton>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-slate-900 underline hover:text-slate-700">Sign up</Link>
          </div>
        </div>
      </div>

      {/* Right Side: Image Banner */}
      <div className="hidden md:block w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract Gradient" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
