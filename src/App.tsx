import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardGuru from './pages/DashboardGuru';
import DashboardSiswa from './pages/DashboardSiswa';
import BuatSoal from './pages/BuatSoal';
import KerjakanSoal from './pages/KerjakanSoal';
import HasilSoal from './pages/HasilSoal';
import DetailSoalGuru from './pages/DetailSoalGuru';
import ManajemenKelas from './pages/ManajemenKelas';
import JoinKelas from './pages/JoinKelas';
import Tentang from './pages/Tentang';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
          }
        }} 
      />
      <Router>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/join/:kode" element={<JoinKelas />} />
        
        {/* Protected Routes untuk Guru */}
        <Route element={<ProtectedRoute allowedRoles={['guru']} />}>
          <Route path="/dashboard" element={<DashboardGuru />} />
          <Route path="/buat-soal" element={<BuatSoal />} />
          <Route path="/soal/:id" element={<DetailSoalGuru />} />
          <Route path="/kelas" element={<ManajemenKelas />} />
        </Route>

        {/* Protected Routes untuk Siswa */}
        <Route element={<ProtectedRoute allowedRoles={['siswa']} />}>
          <Route path="/dashboard-siswa" element={<DashboardSiswa />} />
          <Route path="/kerjakan/:id" element={<KerjakanSoal />} />
        </Route>

        {/* Protected Routes untuk Keduanya */}
        <Route element={<ProtectedRoute />}>
          <Route path="/hasil/:id" element={<HasilSoal />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
