import React from 'react'
import PageHeader from '../components/PageHeader'
import checkup from '../assets/images/checkup.jpeg'
import followup from '../assets/images/followup.jpg'
import patient from '../assets/images/patient.jpeg'
import specialist from '../assets/images/specialist.jpg'
import Button from '../components/Button'

const Services = () => {
  return (
    <div className='px-8 py-10 pb-16'>
      <PageHeader
        title="Our Services"
        subtitle="Providing world-class healthcare with expert specialists and state-of-the-art technology. Your health journey starts with the right care."
      />

      <div className='grid grid-cols-2 gap-8 py-16'>
        <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary transition-all overflow-hidden'>
          <img className='w-72 h-64 object-cover object-top' src={checkup} alt='General Checkup' />
          <div className='flex flex-col justify-center items-start gap-4 p-4'>
            <p className='text-md font-bold text-primary-dark'>General Checkup</p>
            <p className='w-xs text-sm text-gray-500 mb-6'>A comprehensive wellness exam to monitor your overall health and provide preventive medical screening.</p>
            <Button label='Book service' variant='secondary' />
          </div>
        </div>
        <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary transition-all overflow-hidden'>
          <img className='w-72 h-64 object-cover object-top' src={followup} alt='Follow-Up' />
          <div className='flex flex-col justify-center items-start gap-4 p-4'>
            <p className='text-md font-bold text-primary-dark'>Follow-Up</p>
            <p className='w-xs text-sm text-gray-500 mb-6'>A dedicated session to review previous test results, monitor progress, or adjust your ongoing treatment plan.</p>
            <Button label='Book service' variant='secondary' />
          </div>
        </div>
        <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary transition-all overflow-hidden'>
          <img className='w-72 h-64 object-cover object-top' src={patient} alt='New Patient' />
          <div className='flex flex-col justify-center items-start gap-4 p-4'>
            <p className='text-md font-bold text-primary-dark'>New Patient</p>
            <p className='w-xs text-sm text-gray-500 mb-6'>An extended initial visit to establish your medical history and perform a baseline health assessment.</p>
            <Button label='Book service' variant='secondary' />
          </div>
        </div>
        <div className='flex bg-card border border-border rounded-xl shadow-lg hover:border-2 hover:border-primary transition-all overflow-hidden'>
          <img className='w-72 h-64 object-cover object-top' src={specialist} alt='Specialist Visit' />
          <div className='flex flex-col justify-center items-start gap-4 p-4'>
            <p className='text-md font-bold text-primary-dark'>Specialist Visit</p>
            <p className='w-xs text-sm text-gray-500 mb-6'>Expert consultation focused on specific medical concerns requiring targeted diagnostic insights and care.</p>
            <Button label='Book service' variant='secondary' />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Services