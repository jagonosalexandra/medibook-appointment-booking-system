import React from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

const AppointmentTable = ({ appointments = [], showActions = false }) => {

    const navigate = useNavigate()

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className='bg-card rounded-xl shadow-lg border border-gray-100 overflow-x-auto'>
            <table className='w-full border-collapse'>
                <thead className='bg-gray-50 tracking-wider uppercase text-sm text-gray-500 text-center border-b border-gray-200'>
                    <tr>
                        <th className='pt-3.5 pb-2.5 text-xs md:text-sm'>Patient Name</th>
                        <th className='pt-3.5 pb-2.5 text-sm hidden xl:table-cell'>Doctor</th>
                        <th className='pt-3.5 pb-2.5 text-xs md:text-sm'>Date & Time</th>
                        <th className='pt-3.5 pb-2.5 text-sm hidden md:table-cell'>Department</th>
                        <th className={`${showActions ? 'hidden md:table-cell' : ''} pt-3.5 pb-2.5 text-xs md:text-sm`}>Status</th>
                        {showActions && <th className='pt-3.5 pb-2.5 text-xs md:text-sm'>Actions</th>}
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                    {appointments.map(app => (
                        <tr className='text-center' key={app._id}>
                            <td className='py-2.5 px-2.5 font-semibold'>{app.name}</td>
                            <td className='py-2.5 px-2.5 hidden xl:table-cell'>{app.doctor}</td>
                            <td className='py-2.5'>
                                <span className='block'>{formatDate(app.date)}</span>
                                <span className='text-sm'>{app.time}</span>
                            </td>
                            <td className='py-2.5 px-2.5 hidden md:table-cell'>{app.department}</td>
                            <td className={`${showActions ? 'hidden md:table-cell' : ''} text-sm px-2.5`}>
                                <StatusBadge status={app.status} />
                            </td>
                            {showActions && (
                                <td className='py-3 px-4 text-center'>
                                    <button onClick={() => navigate(`/appointment/${app._id}`)} className='text-primary hover:underline font-semibold'>View</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AppointmentTable