import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', name: role === 'guru' ? 'Pak Budi' : 'Andi', role });
    navigate(role === 'guru' ? '/dashboard' : '/dashboard-siswa');
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

        <form onSubmit={handleMockLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Login Sebagai</label>
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
              <input type="email" placeholder="Email" className="glass-input w-full" required />
            </div>
            <div>
              <input type="password" placeholder="Password" className="glass-input w-full" required />
            </div>
          </div>

          <GlassButton type="submit" variant="primary" className="w-full text-lg mt-4">
            Masuk
          </GlassButton>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Belum punya akun? <Link to="/register" className="text-primary-glow hover:underline">Daftar sekarang</Link>
        </p>
      </GlassCard>
    </div>
  );
}
