import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { User, Lock, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pengaturan() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    nama: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setForm({
        nama: data?.nama || user?.name || '',
      });
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      toast.error('Nama tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nama: form.nama.trim() })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local auth store
      updateUser({ name: form.nama.trim() });

      toast.success('Profil berhasil diperbarui!');
    } catch (e: any) {
      toast.error('Gagal memperbarui profil: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('Konfirmasi sandi tidak cocok.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;
      toast.success('Sandi berhasil diubah!');
      setPasswordForm({ current: '', newPassword: '', confirm: '' });
    } catch (e: any) {
      toast.error('Gagal mengubah sandi: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pengaturan</h1>
          <p className="text-slate-500">Kelola profil dan keamanan akun Anda.</p>
        </div>

        {/* Profile */}
        <GlassCard className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Profil</h2>
          </div>

          {loadingData ? (
            <p className="text-slate-400 text-sm">Memuat profil...</p>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={e => setForm({ ...form, nama: e.target.value })}
                  className="glass-input w-full"
                  placeholder="Nama Anda"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Shield className="w-4 h-4" />
                  <span>Role: <span className="font-semibold capitalize">{user?.role || '-'}</span></span>
                </div>
                <GlassButton type="submit" variant="primary" disabled={loading} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Menyimpan...' : 'Simpan Profil'}</span>
                </GlassButton>
              </div>
            </form>
          )}
        </GlassCard>

        {/* Password */}
        <GlassCard className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold">Ubah Sandi</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Sandi Baru</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="glass-input w-full"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Konfirmasi Sandi Baru</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className={`glass-input w-full ${
                  passwordForm.confirm && passwordForm.confirm !== passwordForm.newPassword
                    ? 'border-red-400 focus:border-red-500'
                    : ''
                }`}
                placeholder="Ketik ulang sandi baru"
                required
                minLength={6}
              />
              {passwordForm.confirm && passwordForm.confirm !== passwordForm.newPassword && (
                <p className="text-red-400 text-xs mt-1">Sandi tidak cocok.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <GlassButton type="submit" disabled={loading} className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Mengubah...' : 'Ubah Sandi'}</span>
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
