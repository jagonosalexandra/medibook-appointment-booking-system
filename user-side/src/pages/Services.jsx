import React from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import SERVICES from '../constants/services'

const Services = () => {

  const navigate = useNavigate()


  return (
    <div>
      <PageHeader
        title="Our Services"
        subtitle="Providing world-class healthcare with expert specialists and state-of-the-art technology. Your health journey starts with the right care."
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-6 lg:px-24 py-10 lg:py-16'>
        {SERVICES.map(({ img, title, desc }) => (
          <div key={title} className='flex flex-col bg-card border-2 border-border rounded-xl shadow-lg hover:border-primary transition-all duration-300 overflow-hidden'>
            <img className='w-full h-48 lg:h-64 object-cover object-top' src={img} alt={title} />
            <div className='flex flex-col justify-center items-start gap-4 p-4'>
              <p className='text-md font-bold text-primary-dark'>{title}</p>
              <p className='w-full text-sm text-gray-500 mb-6'>{desc}</p>
              <Button onClick={() => navigate('/booking')} label='Book service' variant='secondary' fullWidth />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Services