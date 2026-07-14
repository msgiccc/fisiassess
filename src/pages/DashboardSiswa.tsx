import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { useAuthStore } from '../store/authStore';
import { Play, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardSiswa() {
  const { user } = useAuthStore();

  const mockTugas = [
    { id: 1, judul: 'Hukum Newton (Dinamika Partikel)', guru: 'Pak Budi', status: 'Belum Dikerjakan', deadline: 'Besok, 23:59' },
    { id: 2, judul: 'Gerak Parabola', guru: 'Pak Budi', status: 'Selesai', skor: 85 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Halo, {user?.name || 'Siswa'}!</h1>
        <p className="text-gray-400">Siap untuk berlatih soal fisika hari ini?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mockTugas.map(tugas => (
          <GlassCard key={tugas.id} className="relative overflow-hidden">
            {tugas.status === 'Selesai' && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-xs font-bold rounded-bl-xl">
                Selesai
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-1 mt-2">{tugas.judul}</h3>
            <p className="text-sm text-gray-400 mb-6">Guru: {tugas.guru}</p>
            
            {tugas.status === 'Belum Dikerjakan' ? (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-warning flex items-center">
                  <span className="w-2 h-2 rounded-full bg-warning mr-2 animate-pulse" />
                  Tenggat: {tugas.deadline}
                </div>
                <Link to={`/kerjakan/${tugas.id}`}>
                  <GlassButton variant="primary" className="flex items-center space-x-2 px-4 py-2 text-sm">
                    <span>Kerjakan</span>
                    <Play className="w-4 h-4 fill-current" />
                  </GlassButton>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Skor: {tugas.skor}</span>
                </div>
                <Link to={`/hasil/${tugas.id}`} className="text-sm text-primary-glow hover:underline">
                  Lihat Hasil Detail
                </Link>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
