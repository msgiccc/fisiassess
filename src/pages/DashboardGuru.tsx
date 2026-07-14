import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../store/authStore';
import { Users, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardGuru() {
  const { user } = useAuthStore();

  const mockSoal = [
    { id: 1, judul: 'Hukum Newton', kelas: 'X IPA 1', topik: 'Mekanika', status: 'Aktif' },
    { id: 2, judul: 'Gerak Lurus Beraturan', kelas: 'X IPA 2', topik: 'Kinematika', status: 'Aktif' },
    { id: 3, judul: 'Termodinamika Gas Ideal', kelas: 'XI IPA 1', topik: 'Termodinamika', status: 'Draft' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Selamat datang, {user?.name || 'Guru'}</h1>
        <p className="text-gray-400">Berikut adalah ringkasan aktivitas dan soal yang Anda buat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <GlassCard className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="text-primary-glow w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Soal</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
            <Users className="text-secondary-glow w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Siswa</p>
            <p className="text-2xl font-bold">145</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle className="text-accent w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Rata-rata Skor</p>
            <p className="text-2xl font-bold">78.5</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Daftar Soal Terbaru</h2>
          <Link to="/buat-soal" className="text-sm text-primary-glow hover:underline">
            + Buat Soal Baru
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3 px-4 font-medium">Judul Soal</th>
                <th className="pb-3 px-4 font-medium">Kelas</th>
                <th className="pb-3 px-4 font-medium">Topik</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockSoal.map((soal) => (
                <tr key={soal.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">{soal.judul}</td>
                  <td className="py-4 px-4 text-gray-300">{soal.kelas}</td>
                  <td className="py-4 px-4 text-gray-300">{soal.topik}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${soal.status === 'Aktif' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {soal.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => toast('Halaman detail soal segera hadir!', { icon: '🚧' })}
                      className="text-primary-glow text-sm hover:underline"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
