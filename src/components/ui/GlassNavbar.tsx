import { Link } from 'react-router-dom';
import { GlassButton } from './GlassButton';
import { useAuthStore } from '../../store/authStore';

export function GlassNavbar() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-heading text-primary tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">✦</span>
          </div>
          FisiAssess
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full transition-colors">Home</Link>
          <Link to="/tentang" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">About Us</Link>
          <Link to="/kelas" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Courses</Link>
          
          {isAuthenticated ? (
            <Link to={user?.role === 'guru' ? '/dashboard' : '/dashboard-siswa'} className="ml-4">
              <button className="bg-secondary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary-glow transition-all shadow-md shadow-secondary/20">
                Dashboard
              </button>
            </Link>
          ) : (
            <div className="flex items-center space-x-4 ml-4">
              <Link to="/login">
                <button className="bg-secondary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary-glow transition-all shadow-md shadow-secondary/20">
                  Sign In
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>);
}
