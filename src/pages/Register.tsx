import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassButton } from '../components/ui/GlassButton';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama: name,
            role: role,
          }
        }
      });

      if (error) throw error;
      
      toast.success('Registrasi berhasil! Silakan periksa email Anda untuk verifikasi.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* Left Side: Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-heading text-slate-900 mb-3">Create an Account</h1>
            <p className="text-sm text-slate-500">Enter your details to register</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="glass-input w-full text-center" 
                value={name}
                onChange={e => setName(e.target.value)}
                required 
              />
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
              
              <div className="flex gap-4 pt-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="siswa"
                    className="hidden peer"
                    checked={role === 'siswa'}
                    onChange={() => setRole('siswa')}
                  />
                  <div className="text-center py-3 border border-slate-200 text-slate-500 peer-checked:bg-slate-900 peer-checked:text-white transition-all text-sm uppercase tracking-wider font-medium">
                    Siswa
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="guru"
                    className="hidden peer"
                    checked={role === 'guru'}
                    onChange={() => setRole('guru')}
                  />
                  <div className="text-center py-3 border border-slate-200 text-slate-500 peer-checked:bg-slate-900 peer-checked:text-white transition-all text-sm uppercase tracking-wider font-medium">
                    Guru
                  </div>
                </label>
              </div>
            </div>

            <GlassButton type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Sign Up'}
            </GlassButton>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-slate-900 underline hover:text-slate-700">Log in</Link>
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
