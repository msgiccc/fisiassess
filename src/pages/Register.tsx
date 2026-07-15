import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassButton } from '../components/ui/GlassButton';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'guru' | 'siswa'>('siswa');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [otp, setOtp] = useState('');
  const otpRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const initialize = useAuthStore(state => state.initialize);

  // Focus OTP input when entering verify step
  useEffect(() => {
    if (step === 'verify') {
      setTimeout(() => otpRef.current?.focus(), 100);
    }
  }, [step]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nama: name, role },
        }
      });
      if (error) throw error;
      setStep('verify');
      toast.success('Kode verifikasi telah dikirim ke email Anda!');
    } catch (error: any) {
      const msg = typeof error?.message === 'string' ? error.message : error?.message?.message || 'Gagal mendaftar. Silakan coba lagi.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const token = otp.trim();
    if (token.length < 4) {
      toast.error('Masukkan kode verifikasi yang benar.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });

      if (error) throw error;

      await initialize();
      toast.success('Email berhasil diverifikasi! Selamat datang!');

      if (role === 'guru') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard-siswa');
      }
    } catch (error: any) {
      const msg = typeof error?.message === 'string' ? error.message : error?.message?.message || 'Kode verifikasi salah. Silakan coba lagi.';
      toast.error(msg);
      setOtp('');
      otpRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      toast.success('Kode verifikasi baru telah dikirim!');
    } catch (error: any) {
      const msg = typeof error?.message === 'string' ? error.message : error?.message?.message || 'Gagal mengirim ulang kode.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER FORM ---
  if (step === 'register') {
    return (
      <div className="min-h-screen flex w-full font-sans">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-heading text-slate-900 mb-3">Buat Akun</h1>
              <p className="text-sm text-slate-500">Daftar untuk mulai menggunakan FisGrade</p>
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
                    <div className="text-center py-3 border border-slate-200 text-slate-500 peer-checked:bg-slate-900 peer-checked:text-white transition-all text-sm uppercase tracking-wider font-medium rounded-xl">
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
                    <div className="text-center py-3 border border-slate-200 text-slate-500 peer-checked:bg-slate-900 peer-checked:text-white transition-all text-sm uppercase tracking-wider font-medium rounded-xl">
                      Guru
                    </div>
                  </label>
                </div>
              </div>

              <GlassButton type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar'}
              </GlassButton>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-slate-900 underline hover:text-slate-700">
                Masuk
              </Link>
            </div>
          </div>
        </div>

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

  // --- OTP VERIFICATION ---
  return (
    <div className="min-h-screen flex w-full font-sans">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => setStep('register')}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali</span>
          </button>

          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-heading text-slate-900 mb-3">Verifikasi Email</h1>
            <p className="text-sm text-slate-500">
              Kami telah mengirimkan kode verifikasi ke{' '}
              <span className="font-semibold text-slate-900">{email}</span>
            </p>
          </div>

          {/* Flexible OTP Input */}
          <div className="mb-8">
            <div className="flex justify-center">
              <input
                ref={otpRef}
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={e => { if (e.key === 'Enter') handleVerifyOtp(); }}
                placeholder="000000"
                className="glass-input max-w-xs text-center text-2xl font-bold tracking-[0.5em] py-4"
                autoComplete="one-time-code"
              />
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              Masukkan kode verifikasi dari email Anda
            </p>
          </div>

          {/* Verify Button */}
          <GlassButton
            type="button"
            variant="primary"
            className="w-full mb-4"
            disabled={loading || otp.trim().length < 4}
            onClick={handleVerifyOtp}
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi'}
          </GlassButton>

          {/* Resend */}
          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={loading}
              className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Kirim ulang kode</span>
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Tidak menerima email? Periksa folder spam atau pastikan email yang Anda masukkan benar.
          </p>
        </div>
      </div>

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
