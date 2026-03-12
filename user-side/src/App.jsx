import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Doctors from './pages/Doctors'
import DoctorProfile from './pages/DoctorProfile'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:id' element={<DoctorProfile />} />
        <Route path='/services' element={<Services />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/confirmation' element={<Confirmation />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/404' element={<NodeIterator />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
