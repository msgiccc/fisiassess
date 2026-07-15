import { Link } from 'react-router-dom';
import { GlassButton } from './GlassButton';
import { useAuthStore } from '../../store/authStore';

export function GlassNavbar() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-heading uppercase text-slate-900 tracking-tight">
          Fisi<span className="text-slate-500">Assess</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider">Beranda</Link>
          <Link to="/tentang" className="text-sm text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider">Tentang</Link>
          {isAuthenticated ? (
            <Link to={user?.role === 'guru' ? '/dashboard' : '/dashboard-siswa'}>
              <GlassButton className="px-6 py-2 border-slate-900 text-slate-900 uppercase text-xs tracking-widest font-bold hover:bg-slate-900 hover:text-slate-900">
                Dashboard
              </GlassButton>
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm text-slate-900 font-medium hover:text-slate-600 transition-colors uppercase tracking-wider">
                Masuk
              </Link>
              <Link to="/register">
                <GlassButton className="px-6 py-2 bg-slate-900 text-slate-900 hover:bg-slate-800 uppercase text-xs tracking-widest font-bold">
                  Daftar
                </GlassButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>);
}
