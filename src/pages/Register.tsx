import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register with Supabase Auth and pass profile data as metadata
      // A trigger in Supabase will automatically insert this into the profiles table
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama: name,
            nim: nim,
            role: role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // If session is null, it means email verification is required
        if (!authData.session) {
          setVerificationRequired(true);
        } else {
          // If somehow email verification is off, go to login
          toast.success('Pendaftaran berhasil! Silakan login.');
          navigate('/login');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  if (verificationRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hero-glow rounded-full blur-[100px] opacity-40 pointer-events-none" />
        
        <GlassCard className="w-full max-w-md relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <MailCheck className="text-slate-900 w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Verifikasi Email</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Link verifikasi telah dikirimkan ke <strong className="text-slate-900">{email}</strong>. 
            Silakan cek kotak masuk (atau spam) email Anda dan klik link tersebut untuk mengaktifkan akun.
          </p>
          
          <div className="space-y-4">
            <GlassButton 
              variant="primary" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Jika sudah diverifikasi, klik di sini untuk Login
            </GlassButton>
            <button 
              onClick={() => setVerificationRequired(false)}
              className="text-slate-500 text-sm hover:text-slate-900 transition-colors"
            >
              Ganti email pendaftaran
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative font-sans">
      
      <GlassCard className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-slate-900 tracking-tight inline-block mb-2">
            Fisi<span className="text-slate-900">Assess.</span>
          </Link>
          <h2 className="text-xl text-slate-500">Buat akun baru</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Daftar Sebagai</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('siswa')}
                className={`py-2 rounded-xl border transition-all ${role === 'siswa' ? 'bg-primary-glow/20 border-primary-glow text-slate-900' : 'glass-effect text-slate-500 hover:text-slate-900'}`}
              >
                Siswa
              </button>
              <button
                type="button"
                onClick={() => setRole('guru')}
                className={`py-2 rounded-xl border transition-all ${role === 'guru' ? 'bg-secondary-glow/20 border-secondary-glow text-slate-900' : 'glass-effect text-slate-500 hover:text-slate-900'}`}
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

        <p className="mt-8 text-center text-slate-500 text-sm">
          Sudah punya akun? <Link to="/login" className="text-slate-900 hover:underline">Masuk di sini</Link>
        </p>
      </GlassCard>
    </div>
  );
}
