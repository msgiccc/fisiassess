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
    { name: 'Dashboard', path: '/dashboard', icon: Home, isDivider: false },
    { name: 'Buat Soal', path: '/buat-soal', icon: PlusCircle, isDivider: false },
    { name: 'Kelas & Siswa', path: '/kelas', icon: Users, isDivider: false },
    { name: 'Divider', path: '', icon: null, isDivider: true },
    { name: 'Input Esai', path: '/input-esai', icon: FileText, isDivider: false },
    { name: 'Pengaturan', path: '#', icon: Settings, isDivider: false },
  ];

  const menuSiswa = [
    { name: 'Dashboard', path: '/dashboard-siswa', icon: Home, isDivider: false },
    { name: 'Daftar Tugas', path: '#', icon: FileText, isDivider: false },
    { name: 'Pengaturan', path: '#', icon: Settings, isDivider: false },
  ];

  const menu = user?.role === 'guru' ? menuGuru : menuSiswa;

  return (
    <aside className="w-64 bg-white min-h-[calc(100vh-2rem)] m-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col hidden md:flex">
      <div className="mb-10 text-center">
        <Link to="/" className="text-2xl font-bold font-heading tracking-tight text-slate-900">
          Fis<span className="text-primary">Grade</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item, index) => {
          if (item.isDivider) {
            return (
              <div key={`divider-${index}`} className="my-4 border-t border-slate-200 border-dashed" />
            );
          }

          const isActive = location.pathname.startsWith(item.path) && item.path !== '#';
          const isMock = item.path === '#';
          const Icon = item.icon!;
          
          return isMock ? (
            <button
              key={item.name}
              onClick={() => toast('Fitur ini masih dalam tahap pengembangan.', { icon: '🚧' })}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-slate-500 hover:text-primary hover:bg-primary/5 text-left"
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-500 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-100 mt-6">
        <div className="flex items-center space-x-3 px-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-md shadow-primary/20">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate capitalize">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{user?.role || 'Guest'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all tracking-wide text-sm font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
