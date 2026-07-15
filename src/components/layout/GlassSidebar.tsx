import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, PlusCircle, Users, Settings, LogOut, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export function GlassSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuGuru = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Buat Soal', path: '/buat-soal', icon: PlusCircle },
    { name: 'Kelas & Siswa', path: '/kelas', icon: Users },
    { name: 'Pengaturan', path: '#', icon: Settings },
  ];

  const menuSiswa = [
    { name: 'Dashboard', path: '/dashboard-siswa', icon: Home },
    { name: 'Daftar Tugas', path: '#', icon: FileText },
    { name: 'Pengaturan', path: '#', icon: Settings },
  ];

  const menu = user?.role === 'guru' ? menuGuru : menuSiswa;

  return (
    <aside className="w-64 glass-effect min-h-[calc(100vh-2rem)] m-4 rounded-3xl p-6 flex flex-col hidden md:flex">
      <div className="mb-10 text-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          Fisi<span className="text-primary-glow">Assess.</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          const isMock = item.path === '#';
          const Icon = item.icon;
          
          return isMock ? (
            <button
              key={item.name}
              onClick={() => toast('Fitur ini masih dalam tahap pengembangan.', { icon: '🚧' })}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 text-left"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-glow/20 text-primary-glow border border-primary-glow/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/10 mt-6">
        <div className="flex items-center space-x-3 px-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || 'Guest'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
