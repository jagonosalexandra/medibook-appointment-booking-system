import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import hero from '../assets/images/hero.jpg'
import Button from '../components/Button'
import { fetchAllDoctors } from '../services/doctorService'
import DoctorCard from '../components/DoctorCard'
import SERVICES from '../constants/services'
import WHY_US from '../constants/whyUs'

const Home = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchAllDoctors()
        setDoctors(data)
      } catch (error) {
        setError(error.message || 'Failed to load doctors')
        console.error('Error loading doctors:', error)
      } finally {
        setLoadingDoctors(false)
      }
    }
    loadDoctors()
  }, [])

  return (
    <div>
      {/* HERO */}
      <div className='relative w-full h-[80vh] lg:h-screen overflow-hidden bg-black'>
        <img className='w-full h-full object-cover object-top' src={hero} alt='Hero' />
        <div className='absolute inset-0 bg-linear-to-t from-white via-white/90 to-transparent md:bg-linear-to-r md:from-white md:via-white/80 md:to-transparent z-10'></div>
        <div className='absolute inset-0 flex flex-col justify-end md:justify-center items-start gap-3 md:gap-4 px-6 sm:px-8 md:px-12 lg:px-24 z-10 pb-12 md:pb-0 max-w-4xl'>
          <h1 className='text-5xl md:text-6xl lg:text-8xl font-black leading-tight text-primary-dark'>
            Your Health, <span className='block text-black'>Simplified.</span>
          </h1>
          <p className='max-w-xs lg:max-w-md text-sm md:text-base text-gray-800 mb-4 md:mb-8 font-medium'>
            Expert care at your fingertips. Book your appointment with our world-class specialists today.
          </p>

          <Button
            label={`Book appointment →`}
            variant='primary'
            onClick={() => navigate('/booking')}
          />
        </div>
      </div>

      {/* SERVICES */}
      <div className='px-6 lg:px-24 py-10 lg:py-16 bg-white'>
        <p className='text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12'>Our Services</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
          {SERVICES.map(({ img, title, desc }) => (
            <div key={title} className='flex flex-col lg:flex-row bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary hover:scale-105 transition-all overflow-hidden'>
              <img className='w-full lg:w-72 h-48 lg:h-64 object-cover object-top' src={img} alt={title} />
              <div className='flex flex-col justify-center gap-4 p-4'>
                <p className='text-md font-bold text-primary-dark'>{title}</p>
                <p className='w-full lg:w-xs text-sm text-gray-500'>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOCTORS */}
      <div className='flex flex-col items-center gap-8 px-6 lg:px-24 py-10 lg:py-12'>
        <p className='text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12'>Meet the Doctors</p>
        {loadingDoctors ? (
          <LoadingSpinner message='Loading doctors...' />
        ) : error ? (
          <p className='text-error text-sm'>{error}</p>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
              {doctors.slice(0, 4).map(doc => (
                <DoctorCard
                  key={doc._id}
                  id={doc._id}
                  name={doc.name}
                  photoUrl={doc.photoUrl}
                  department={doc.department}
                />
              ))}
            </div>
            <button className='bg-primary/5 px-8 py-4 rounded-full cursor-pointer hover:font-bold hover:text-primary active:scale-95 transition-all' onClick={() => navigate('/doctors')}>View All</button>
          </>
        )}
      </div>

      {/* WHY CHOOSE US */}
      <div className='px-6 lg:px-24 py-10 lg:py-16 bg-white'>
        <p className='text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12'>Why Choose Us</p>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6'>
          {WHY_US.map(({ icon, title, desc }) => (
            <div key={title} className='flex flex-col gap-4 bg-card p-4 border border-border hover:border-2 hover:border-primary hover:scale-105 transition-all rounded-xl shadow-lg'>
              <img className='w-12 h-12 p-2 rounded-lg bg-primary/20' src={icon} alt={title} />
              <p className='text-md font-bold'>{title}</p>
              <p className='text-sm text-gray-500'>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home