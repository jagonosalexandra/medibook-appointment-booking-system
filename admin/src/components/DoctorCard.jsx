import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

const DoctorCard = ({ docId, name, photoUrl, department, isActive, onToggleStatus }) => {
  const navigate = useNavigate()

  const handleToggleClick = (e) => {
    e.stopPropagation()
    onToggleStatus(docId)
  }

  return (
    <div
      onClick={() => navigate(`/doctor/${docId}`)}
      className='flex flex-col gap-3.5 pb-6 rounded-xl bg-white border-2 border-gray-200 transition-all duration-300 hover:border-primary hover:shadow-xl cursor-pointer overflow-hidden'
    >
      <img
        className='w-full aspect-square object-cover object-top'
        src={photoUrl}
        alt={name}
      />

      <div className='px-4'>
        <h3 className='text-md font-bold text-primary-dark truncate'>{name}</h3>
        <span className='block text-xs font-light text-gray-500'>{department}</span>
      </div>



      <div className='px-4 mt-auto text-sm'>
        <Button
          label={isActive ? "Deactivate" : "Activate"}
          variant={isActive ? "muted" : "primary"}
          onClick={handleToggleClick}
          fullWidth
        />
      </div>
    </div>
  )
}

export default DoctorCard