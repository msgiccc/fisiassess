import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardGuru from './pages/DashboardGuru';
import DashboardSiswa from './pages/DashboardSiswa';
import BuatSoal from './pages/BuatSoal';
import KerjakanSoal from './pages/KerjakanSoal';
import HasilSoal from './pages/HasilSoal';
import Tentang from './pages/Tentang';

function App() {
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
        <Route path="/dashboard" element={<DashboardGuru />} />
        <Route path="/dashboard-siswa" element={<DashboardSiswa />} />
        <Route path="/buat-soal" element={<BuatSoal />} />
        <Route path="/kerjakan/:id" element={<KerjakanSoal />} />
        <Route path="/hasil/:id" element={<HasilSoal />} />
        <Route path="/tentang" element={<Tentang />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
