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
import BulkEvaluasi from './pages/BulkEvaluasi';
import InputEsaiDashboard from './pages/InputEsaiDashboard';
import BuatRubrikManual from './pages/BuatRubrikManual';
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
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            borderRadius: '1rem',
            fontWeight: '500',
            fontSize: '14px',
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
          <Route path="/input-esai" element={<InputEsaiDashboard />} />
          <Route path="/input-esai/buat" element={<BuatRubrikManual />} />
          <Route path="/input-esai/:id" element={<BulkEvaluasi />} />
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
