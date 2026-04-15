import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import hero from '../assets/images/hero.jpg'
import Button from '../components/Button'
import checkup from '../assets/images/checkup.jpeg'
import followup from '../assets/images/followup.jpg'
import patient from '../assets/images/patient.jpeg'
import specialist from '../assets/images/specialist.jpg'
import experts from '../assets/icons/general_practice.svg'
import award from '../assets/icons/award.svg'
import building from '../assets/icons/building.svg'
import schedule from '../assets/icons/calendar-check.svg'
import { fetchAllDoctors } from '../services/doctorService'
import DoctorCard from '../components/DoctorCard'

const Home = () => {
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    fetchAllDoctors().then(data => {
      setDoctors(data)
    })
  }, [])

  return (
    <div>
      {/* HERO */}
      <div className='relative w-full h-screen overflow-hidden'>
        <img className='w-full h-screen object-cover' src={hero} alt='Hero' />
        <div className='absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-2/3 
                  backdrop-blur-2xl bg-white/90
                  mask-[linear-gradient(to_right,white_60%,transparent_100%)]'>
        </div>
        <div className='absolute inset-y-0 left-0 flex flex-col justify-center items-start gap-4 px-8 md:px-16 lg:px-24 z-10'>
          <p className='text-6xl lg:text-8xl font-black leading-tight'>
            Your Health, <span className='block text-primary-dark'>Simplified.</span>
          </p>
          <p className='max-w-md text-sm lg:text-base text-gray-700 mb-8'>
            Expert care at your fingertips. Book your appointment with our world-class specialists today and experience seamless medical services tailored for you.
          </p>

          <Button
            label={`Book appointment \u2192`}
            variant='primary'
            onClick={() => navigate('/booking')}
          />
        </div>
      </div>

      {/* SERVICES */}
      <div className='px-24 py-16 bg-white'>
        <p className='text-xl font-bold text-center mb-8'>Our Services</p>
        <div className='grid grid-cols-2 gap-8'>
          <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary hover:scale-105 transition-all overflow-hidden'>
            <img className='w-72 h-64 object-cover object-top' src={checkup} alt='General Checkup' />
            <div className='flex flex-col justify-center gap-4 p-4'>
              <p className='text-md font-bold text-primary-dark'>General Checkup</p>
              <p className='w-xs text-sm text-gray-500'>A comprehensive wellness exam to monitor your overall health and provide preventive medical screening.</p>
            </div>
          </div>
          <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary hover:scale-105 transition-all overflow-hidden'>
            <img className='w-72 h-64 object-cover object-top' src={followup} alt='Follow-Up' />
            <div className='flex flex-col justify-center gap-4 p-4'>
              <p className='text-md font-bold text-primary-dark'>Follow-Up</p>
              <p className='w-xs text-sm text-gray-500'>A dedicated session to review previous test results, monitor progress, or adjust your ongoing treatment plan.</p>
            </div>
          </div>
          <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary hover:scale-105 transition-all overflow-hidden'>
            <img className='w-72 h-64 object-cover object-top' src={patient} alt='New Patient' />
            <div className='flex flex-col justify-center gap-4 p-4'>
              <p className='text-md font-bold text-primary-dark'>New Patient</p>
              <p className='w-xs text-sm text-gray-500'>An extended initial visit to establish your medical history and perform a baseline health assessment.</p>
            </div>
          </div>
          <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary hover:scale-105 transition-all overflow-hidden'>
            <img className='w-72 h-64 object-cover object-top' src={specialist} alt='Specialist Visit' />
            <div className='flex flex-col justify-center gap-4 p-4'>
              <p className='text-md font-bold text-primary-dark'>Specialist Visit</p>
              <p className='w-xs text-sm text-gray-500'>Expert consultation focused on specific medical concerns requiring targeted diagnostic insights and care.</p>
            </div>
          </div>
        </div>
      </div>

      {/* DOCTORS */}
      <div className='flex flex-col items-center gap-12 px-24 py-16'>
        <p className='text-xl font-bold text-center'>Meet the Doctors</p>
        <div className='grid grid-cols-4 gap-4'>
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
      </div>

      {/* WHY CHOOSE US */}
      <div className='px-24 py-16 bg-white'>
        <p className='text-xl font-bold text-center mb-12'>Why Choose Us</p>
        <div className='grid grid-cols-4 gap-4 min-h-64'>
          <div className='flex flex-col gap-4 bg-card p-4 border border-border hover:border-2 hover:border-primary hover:scale-105 transition-all rounded-xl shadow-lg'>
            <img className='w-12 h-12 p-2 rounded-lg bg-primary/20' src={experts} alt='General Checkup' />
            <p className='text-md font-bold'>Expert Medical Team</p>
            <p className='text-sm text-gray-500'>Access a network of board-certified physicians and experienced healthcare professionals dedicated to providing personalized, high-quality medical care for every patient.</p>
          </div>
          <div className='flex flex-col gap-4 bg-card p-4 border border-border hover:border-2 hover:border-primary hover:scale-105 transition-all rounded-xl shadow-lg'>
            <img className='w-12 h-12 p-2 rounded-lg bg-primary/20' src={award} alt='Follow-Up' />
            <p className='text-md font-bold'>Accredited Excellence</p>
            <p className='text-sm text-gray-500'>We maintain the highest clinical standards as a Joint Commission-accredited facility, ensuring your care is safe, strictly regulated, and held to national benchmarks of excellence.</p>
          </div>
          <div className='flex flex-col gap-4 bg-card p-4 border border-border hover:border-2 hover:border-primary hover:scale-105 transition-all rounded-xl shadow-lg'>
            <img className='w-12 h-12 p-2 rounded-lg bg-primary/20' src={schedule} alt='New Patient' />
            <p className='text-md font-bold'>Seamless Scheduling</p>
            <p className='text-sm text-gray-500'>Skip the waiting room. Our real-time booking system allows you to secure appointment slots instantly, helping you manage your health around your busy schedule.</p>
          </div>
          <div className='flex flex-col gap-4 bg-card p-4 border border-border hover:border-2 hover:border-primary hover:scale-105 transition-all rounded-xl shadow-lg'>
            <img className='w-12 h-12 p-2 rounded-lg bg-primary/20' src={building} alt='Specialist Visit' />
            <p className='text-md font-bold'>Modern Facilities</p>
            <p className='text-sm text-gray-500'>Experience medical care in a clean, professional environment equipped with modern diagnostic tools and comfortable patient lounges designed for your peace of mind.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home