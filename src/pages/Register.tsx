import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleMockRegister = (e: React.FormEvent) => {
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
          <h2 className="text-xl text-gray-400">Buat akun baru</h2>
        </div>

        <form onSubmit={handleMockRegister} className="space-y-6">
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
              <input type="text" placeholder="Nama Lengkap" className="glass-input w-full" required />
            </div>
            <div>
              <input type="text" placeholder={role === 'siswa' ? "NIM / NISN" : "NIP"} className="glass-input w-full" required />
            </div>
            <div>
              <input type="email" placeholder="Email" className="glass-input w-full" required />
            </div>
            <div>
              <input type="password" placeholder="Password" className="glass-input w-full" required />
            </div>
          </div>

          <GlassButton type="submit" variant="primary" className="w-full text-lg mt-4">
            Daftar
          </GlassButton>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Sudah punya akun? <Link to="/login" className="text-primary-glow hover:underline">Masuk di sini</Link>
        </p>
      </GlassCard>
    </div>
  );
}
