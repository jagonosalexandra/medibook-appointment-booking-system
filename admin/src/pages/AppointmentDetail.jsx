import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAToken } from '../services/adminService'
import { fetchAppointments } from '../services/appointmentService'
import user from '../assets/icons/user.svg'
import calendar from '../assets/icons/calendar.svg'
import doctor from '../assets/icons/doctor.svg'
import clock from '../assets/icons/clock.svg'
import quick from '../assets/icons/quick.svg'
import paper from '../assets/icons/paper-fold.svg'
import check from '../assets/icons/check.svg'
import reschedule from '../assets/icons/calendar-edit.svg'
import cancel from '../assets/icons/cancel.svg'
import print from '../assets/icons/print.svg'

const AppointmentDetail = () => {
    const { appId } = useParams()

    const [appInfo, setAppInfo] = useState(null)

    useEffect(() => {
        const fetchAppInfo = async () => {
            const aToken = getAToken()
            if (aToken) {
                const appointments = await fetchAppointments()
                console.log(appId)
                const appInfo = appointments.find(app => app._id === appId)
                console.log(appInfo)
                setAppInfo(appInfo)
            }
        }
        fetchAppInfo()
    }, [appId])

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return appInfo && (
        <div className='w-full flex flex-col gap-8 h-screen overflow-y-auto'>

            <div className='px-12 py-4 bg-card border-b border-gray-300'>
                <h1 className='text-xs uppercase font-medium text-gray-500'>
                    Appointment Details
                    <span className='flex items-center gap-4 pt-1.5 text-4xl font-bold text-black'>
                        {appInfo.referenceNumber}
                        <span 
                            className={`${appInfo.status === 'pending' ? 'bg-yellow/30 text-yellow font-bold' : ''}
                                    ${appInfo.status === 'cancelled' ? 'bg-red/30 text-red font-bold' : ''}
                                    ${appInfo.status === 'confirmed' ? 'bg-success/30 text-success font-bold' : ''}
                                    px-4 py-1 text-xs uppercase rounded-full`}
                        >
                            {appInfo.status}
                        </span>
                    </span>
                </h1>
            </div>

            <div className='grid grid-cols-[3fr_1fr] gap-8 px-12 py-4\2'>

                <div className='flex flex-col gap-8'>
                    <div className='bg-card border border-gray-300 py-3 rounded-xl shadow-lg'>
                        <h2 className='flex items-center gap-2.5 px-4 pb-1.5 border-b border-gray-200 text-primary-dark text-md font-bold'><img className='w-5' src={user} alt='' /> Patient Information</h2>

                        <div className='grid grid-cols-2 justify-between gap-5 px-4 py-4'>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Full Name</strong> {appInfo.name}</p>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Contact Number</strong> {appInfo.phone}</p>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Email Address</strong> {appInfo.email}</p>
                        </div>
                    </div>

                    <div className='bg-card border border-gray-300 py-3 rounded-lg shadow-xl'>
                        <h2 className='flex items-center gap-2.5 px-4 pb-1.5 border-b border-gray-200 text-primary-dark text-md font-bold'><img className='w-5' src={calendar} alt='' />Booking Information</h2>

                        <div className='grid grid-cols-2 justify-between gap-5 px-4 py-4'>
                            <p className='flex items-center gap-2.5'>
                                <img className='w-12 bg-primary/20 px-1.5 py-2 rounded-lg' src={doctor} alt='' />
                                <div className='flex flex-col'>
                                    <strong className='text-xs uppercase text-gray-500 py-1'>Doctor</strong>
                                    <span className='text-md font-extrabold'>{appInfo.doctor}</span>
                                    <span className='text-sm text-gray-500'>{appInfo.department}</span>
                                </div>
                            </p>
                            <p className='flex items-center gap-2.5'>
                                <img className='w-12 bg-primary/20 px-1.5 py-2 rounded-lg' src={clock} alt='' />
                                <div className='flex flex-col'>
                                    <strong className='text-xs uppercase text-gray-500 py-1'>Date & Time</strong>
                                    <span className='text-md font-extrabold'>{formatDate(appInfo.date)}</span>
                                    <span className='text-sm text-gray-500'>{appInfo.time}</span>
                                </div>
                            </p>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Visit Type</strong> {appInfo.appointmentType}</p>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Appointment Fee</strong>${appInfo.fee}</p>

                            {appInfo.reasonForVisit === "" ? "" : (
                                <p className='flex flex-col gap-2 col-span-2'>
                                    <strong className='text-xs uppercase text-gray-500'>Reason for Visit</strong> 
                                    <span className='bg-gray-100 px-4 py-3.5 rounded-md text-gray-600'>{appInfo.reasonForVisit}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-8'>
                    <div className='bg-card border border-gray-300 rounded-xl shadow-lg px-5 py-1.5'>
                        <h2 className='flex items-center gap-2.5 py-2.5 text-primary-dark text-md font-bold'><img className='w-5' src={quick} alt='' />Quick Actions</h2>

                        <button className='w-full flex items-center gap-2.5 px-1.5 py-2 border border-yellow/30 bg-yellow/20 text-yellow font-semibold my-2 rounded-lg cursor-pointer active:scale-95 hover:brightness-110'>
                            <img className='w-5' src={reschedule} alt='' />
                            Reschedule
                        </button>
                        <button className='w-full flex items-center gap-2.5 px-1.5 py-2 border border-success/20 bg-success/30 text-success font-semibold my-2 rounded-lg cursor-pointer active:scale-95 hover:brightness-110'>
                            <img className='w-5' src={check} alt='' />
                            Confirm Appointment
                        </button>
                        <button className='w-full flex items-center gap-2.5 px-1.5 py-2 border border-red/30 bg-red/20 text-red font-semibold my-2 rounded-lg cursor-pointer active:scale-95 hover:brightness-110'>
                            <img className='w-5' src={cancel} alt='' />
                            Cancel Appointment
                        </button>
                        <button className='w-full flex items-center gap-2.5 px-1.5 py-2 border border-gray-300 bg-gray-100 text-gray-700 font-semibold my-2 rounded-lg cursor-pointer active:scale-95 hover:brightness-110'>
                            <img className='w-5' src={print} alt='' />
                            Print Summary
                        </button>
                    </div>

                    {appInfo.adminNotes && (
                        <div className='bg-card border border-gray-100 rounded-lg shadow-lg'>
                            <h2 className='flex items-center gap-2.5 px-2.5 py-1.5 border-b border-gray-200 text-primary-dark text-md font-bold'><img className='w-5' src={paper} alt='' />Internal Remarks</h2>

                            {/* Admin note here */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AppointmentDetail