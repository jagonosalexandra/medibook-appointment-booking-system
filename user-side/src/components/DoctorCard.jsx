import React from 'react'
import Button from './Button'

const DoctorCard = ({ name, photoUrl, department }) => {
  return (
    <div className='flex flex-col gap-3.5 pb-6 rounded-xl bg-card border border-gray-300 contain-content overflow-hidden hover:-translate-y-1.5 transition-all duration-300 shadow-lg'>
        <img className='w-full aspect-square object-cover object-top' src={photoUrl} alt={name} />
        
        <div className='px-4 text-lg font-bold text-primary'>
            {name}
            <span className='block text-sm font-light text-gray-500'>{department}</span>
        </div>
        
        <div className='flex items-center gap-4 px-4'>
            <Button
                label="Profile"
                variant="secondary"
                fullWidth
            />
            <Button
                label="Book Now"
                variant="primary"
                fullWidth
            />
        </div>
    </div>
  )
}

export default DoctorCard