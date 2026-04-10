import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Appointments from './pages/Appointments'
import AppointmentDetail from './pages/AppointmentDetail'
import Doctors from './pages/Doctors';
import AddDoctor from './pages/AddDoctor';
import EditDoctorProfile from './pages/EditDoctorProfile';
import TimeSlots from './pages/TimeSlots';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <ToastContainer />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={
          <ProtectedRoute>
            <Navbar />
            <div className='flex items-start'>
              <Sidebar />
              <div className='flex-1 flex flex-col'>
                <Routes>
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/' element={<Navigate to='/dashboard' replace />} />
                  <Route path='/appointments' element={<Appointments />} />
                  <Route path='/appointment/:appId' element={<AppointmentDetail />} />
                  <Route path='/doctors' element={<Doctors />} />
                  <Route path='/doctor/new' element={<AddDoctor />} />
                  <Route path='/doctor/:docId' element={<EditDoctorProfile />} />
                  <Route path='/time-slots' element={<TimeSlots />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App