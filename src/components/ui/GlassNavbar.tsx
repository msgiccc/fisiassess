import { Link } from 'react-router-dom';
import { GlassButton } from './GlassButton';

export function GlassNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-effect rounded-full px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          Fisi<span className="text-primary-glow">Assess.</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <Link to="/tentang" className="hover:text-white transition-colors">Tentang</Link>
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-white hover:text-primary-glow transition-colors">
            Login
          </Link>
          <Link to="/register">
            <GlassButton variant="primary" className="text-sm px-5 py-2">
              Daftar
            </GlassButton>
          </Link>
        </div>
      </div>
    </nav>
  );
}
