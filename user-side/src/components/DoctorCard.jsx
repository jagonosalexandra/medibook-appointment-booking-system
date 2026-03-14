import React from 'react'
import Button from './Button'
import briefcase from '../assets/icons/briefcase.svg'
import money from '../assets/icons/money.svg'

const DoctorCard = ({ name, photoUrl, department, experience, fee, isBookingMode = false, isSelected = false }) => {
  return (
    <div className={`flex flex-col gap-3.5 pb-6 rounded-xl bg-card border-2 transition-all duration-300 shadow-lg overflow-hidden
      ${isBookingMode ? 'h-full' : 'hover:-translate-y-1.5'}
      ${isSelected ? 'border-primary outline outline-primary' : 'border-gray-300'}
    `}>
        <img className='w-full aspect-square object-cover object-top' src={photoUrl} alt={name} />
        
        <div className='px-4'>
            <h3 className='text-lg font-bold text-primary'>{name}</h3>
            <span className='block text-sm font-light text-gray-500'>{department}</span>
        </div>

        {isBookingMode && (
          <div className='px-4 flex flex-col gap-1 text-gray-500'>
            <div className='flex justify-between text-sm'>
              <span className='flex items-center justify-center gap-1.5'><img className='w-5' src={briefcase} alt='' /> Experience:</span>
              <span className='font-medium'>{experience}</span>
            </div>
            <div className='flex justify-between items-start text-sm'>
              <span className='flex items-center justify-center gap-1.5'><img className='w-5' src={money} alt='' /> Consultation Fee:</span>
              <span className='text-lg font-bold text-primary'>${fee}</span>
            </div>
          </div>
        )}
        
        {!isBookingMode && (
          <div className='flex items-center gap-4 px-4 mt-2'>
              <Button label="Profile" variant="secondary" fullWidth />
              <Button label="Book Now" variant="primary" fullWidth />
          </div>
        )}
    </div>
  )
}

export default DoctorCard