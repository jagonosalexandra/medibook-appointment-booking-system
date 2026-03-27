import React from 'react'
import { useNavigate } from 'react-router-dom'

const AppointmentTable = ({ appointments, showActions = false }) => {

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
        <div className='bg-card rounded-xl shadow-lg border border-gray-100'>
            <table className='w-full border-collapse'>
                <thead className='bg-gray-50 tracking-wider uppercase text-sm text-gray-500 text-center border-b border-gray-200'>
                    <tr>
                        <th className='pt-3.5 pb-2.5'>Patient Name</th>
                        <th className='pt-3.5 pb-2.5'>Doctor</th>
                        <th className='pt-3.5 pb-2.5'>Date & Time</th>
                        <th className='pt-3.5 pb-2.5'>Department</th>
                        <th className='pt-3.5 pb-2.5'>Status</th>
                        {showActions && <th className='pt-3.5 pb-2.5'>Actions</th>}
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                    {appointments.map(app => (
                        <tr className='text-center' key={app._id}>
                            <td className='py-2.5 px-2.5 font-semibold'>{app.name}</td>
                            <td className='py-2.5 px-2.5'>{app.doctor}</td>
                            <td className='py-2.5'>
                                <span className='block'>{formatDate(app.date)}</span>
                                <span>{app.time}</span>
                            </td>
                            <td className='py-2.5 px-2.5'>{app.department}</td>
                            <td className='text-sm px-2.5'>
                                <span
                                    className={`${app.status === 'pending' ? 'bg-yellow/30 text-yellow font-bold' : ''}
                                    ${app.status === 'cancelled' ? 'bg-red/30 text-red font-bold' : ''}
                                    ${app.status === 'confirmed' ? 'bg-success/30 text-success font-bold' : ''}
                                    px-5 py-1 uppercase rounded-full`}
                                >
                                    {app.status}
                                </span>
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