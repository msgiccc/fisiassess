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
    <aside className="w-64 bg-white min-h-[calc(100vh-2rem)] m-4 rounded-none md:rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col hidden md:flex">
      <div className="mb-10 text-center">
        <Link to="/" className="text-2xl font-bold font-heading uppercase tracking-tight text-slate-900">
          Fisi<span className="text-slate-500">Assess</span>
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
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-none transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-left"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm uppercase tracking-wider">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-none transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-200 mt-6">
        <div className="flex items-center space-x-3 px-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white shadow-sm">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate uppercase">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{user?.role || 'Guest'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-none text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all uppercase tracking-wider text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
