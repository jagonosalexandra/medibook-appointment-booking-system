import React from 'react'

const StatsCard = ({ name, count, icon, color }) => {
  return (
    <div className='flex flex-col gap-4 w-85 p-4 relative bg-card border border-gray-200 rounded-xl shadow-lg'>
        <p className='text-sm text-gray-600'>{name}</p>
        <p className='text-4xl font-bold'>{count}</p>
        <img 
            className='w-12 p-1.5 rounded-xl absolute top-3.5 right-3.5' 
            style={{ backgroundColor: `${color}5A` }}
            src={icon} 
            alt='' 
        />
    </div>
  )
}

export default StatsCard