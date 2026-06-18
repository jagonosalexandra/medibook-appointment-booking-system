// DoctorCard.jsx
import React from 'react'
import Button from './Button'
import briefcase from '../assets/icons/briefcase.svg'
import money from '../assets/icons/money.svg'
import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ id, name, photoUrl, department, experience, fee, isBookingMode = false, isSelected = false }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={isBookingMode ? undefined : () => navigate(`/doctor/${id}`)}
      className={`flex flex-col gap-3.5 pb-6 rounded-xl bg-card border-2 transition-all duration-300 shadow-lg overflow-hidden
                ${isBookingMode
          ? 'cursor-pointer'
          : 'cursor-pointer hover:-translate-y-1.5'  
        }
                ${isSelected
          ? 'border-primary ring-2 ring-primary/30'  
          : 'border-gray-200 hover:border-primary/50'
        }`}
    >
      <img
        className='w-full aspect-square object-cover object-top'
        loading='lazy'
        src={photoUrl}
        alt={name}
      />

      <div className='px-4'>
        <h3 className='text-lg font-bold text-primary'>{name}</h3>
        <span className='block text-sm font-light text-gray-500'>{department}</span>
      </div>

      {isBookingMode && (
        <div className='px-4 flex flex-col gap-1 text-gray-500'>
          <div className='flex justify-between text-sm'>
            <span className='flex items-center gap-1.5'>
              <img className='w-5' src={briefcase} alt='' /> Experience:
            </span>
            <span className='font-medium'>{experience} Years</span>
          </div>
          <div className='flex justify-between items-center text-sm'>
            <span className='flex items-center gap-1.5'>
              <img className='w-5' src={money} alt='' /> Fee:
            </span>
            <span className='text-lg font-bold text-primary'>${fee}</span>
          </div>
        </div>
      )}

      {!isBookingMode && (
        <div className='flex items-center gap-3 px-4 mt-auto'>
          <Button
            label='Profile'
            variant='secondary'
            fullWidth
            onClick={(e) => {
              e.stopPropagation()  
              navigate(`/doctor/${id}`)
            }}
          />
          <Button
            label='Book Now'
            variant='primary'
            fullWidth
            onClick={(e) => {
              e.stopPropagation()   
              navigate(`/booking?doctor=${id}`)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DoctorCard