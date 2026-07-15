import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function GlassNavbar() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-lg leading-none font-bold">F</span>
          </div>
          FisiAssess
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Home</Link>
          <Link to="/tentang" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Tentang</Link>
          
          {isAuthenticated ? (
            <Link to={user?.role === 'guru' ? '/dashboard' : '/dashboard-siswa'} className="ml-2">
              <button className="btn-primary py-1.5 px-5 text-sm">
                Dashboard
              </button>
            </Link>
          ) : (
            <div className="flex items-center space-x-4 ml-2">
              <Link to="/login">
                <button className="btn-primary py-1.5 px-5 text-sm">
                  Masuk / Daftar
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>);
}
