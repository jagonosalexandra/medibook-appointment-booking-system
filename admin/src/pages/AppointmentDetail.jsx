import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAToken } from '../services/adminService'
import { fetchAppointments, updateAppointment } from '../services/appointmentService'
import close from '../assets/icons/close.svg'
import user from '../assets/icons/user.svg'
import calendar from '../assets/icons/calendar.svg'
import doctor from '../assets/icons/doctor.svg'
import clock from '../assets/icons/clock.svg'
import paper from '../assets/icons/paper-fold.svg'
import check from '../assets/icons/check.svg'
import cancel from '../assets/icons/cancel.svg'

const AppointmentDetail = () => {
    const { appId } = useParams()

    const navigate = useNavigate()

    const [appInfo, setAppInfo] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [selectStatus, setSelectStatus] = useState("")
    const [notes, setNotes] = useState("")

    useEffect(() => {
        const fetchAppInfo = async () => {
            const aToken = getAToken()
            if (aToken) {
                const appointments = await fetchAppointments()
                const foundApp = appointments.find(app => app._id === appId)
                setAppInfo(foundApp)
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

    const handleStatusUpdate = async () => {
        try {
            const aToken = getAToken()
            if (aToken) {
                const response = await updateAppointment(appId, {
                    status: selectStatus,
                    adminNotes: notes
                })

                if (response.success) {
                    toast.success(`Appointment ${selectStatus} successfully!`)
                    setAppInfo(prev => ({
                        ...prev,
                        status: selectStatus,
                        adminNotes: notes
                    }))
                    setShowModal(false)
                    setNotes("")
                }
            }
        } catch (error) {
            console.error("Failed to update status: ", error)
            toast.error(error.message || "Failed to update appointment");
        }
    }

    return appInfo && (
        <div className='w-full flex flex-col gap-8 h-screen overflow-y-auto'>
            <div className='flex justify-between items-start px-12 py-4 bg-card border-b border-gray-300'>
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

                <button onClick={() => navigate(-1)} className='cursor-pointer'>
                    <img className='w-8' src={close} alt='close' />
                </button>
            </div>

            <div className={`px-12 py-4 gap-8 ${appInfo.adminNotes ? 'grid grid-cols-[3fr_1fr]' : 'flex flex-col'}`}>

                <div className='flex flex-col gap-8'>
                    {/* PATIENT INFO */}
                    <div className='bg-card border border-gray-300 py-3 rounded-xl shadow-lg'>
                        <h2 className='flex items-center gap-2.5 px-4 pb-1.5 border-b border-gray-200 text-primary-dark text-md font-bold'><img className='w-5' src={user} alt='' /> Patient Information</h2>
                        <div className='grid grid-cols-2 justify-between gap-5 px-4 py-4'>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Full Name</strong> {appInfo.name}</p>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Contact Number</strong> {appInfo.phone}</p>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Email Address</strong> {appInfo.email}</p>
                        </div>
                    </div>

                    {/* BOOKING INFO */}
                    <div className='bg-card border border-gray-300 py-3 rounded-lg shadow-xl'>
                        <h2 className='flex items-center gap-2.5 px-4 pb-1.5 border-b border-gray-200 text-primary-dark text-md font-bold'><img className='w-5' src={calendar} alt='' />Booking Information</h2>
                        <div className='grid grid-cols-2 justify-between gap-5 px-4 py-4'>
                            <div className='flex items-center gap-2.5'>
                                <img className='w-12 bg-primary/20 px-1.5 py-2 rounded-lg' src={doctor} alt='' />
                                <div className='flex flex-col'>
                                    <strong className='text-xs uppercase text-gray-500 py-1'>Doctor</strong>
                                    <span className='text-md font-extrabold'>{appInfo.doctor}</span>
                                    <span className='text-sm text-gray-500'>{appInfo.department}</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <img className='w-12 bg-primary/20 px-1.5 py-2 rounded-lg' src={clock} alt='' />
                                <div className='flex flex-col'>
                                    <strong className='text-xs uppercase text-gray-500 py-1'>Date & Time</strong>
                                    <span className='text-md font-extrabold'>{formatDate(appInfo.date)}</span>
                                    <span className='text-sm text-gray-500'>{appInfo.time}</span>
                                </div>
                            </div>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Visit Type</strong> {appInfo.appointmentType}</p>
                            <p className='flex flex-col gap-1 text-md font-medium'><strong className='text-xs uppercase text-gray-500'>Appointment Fee</strong>${appInfo.fee}</p>
                            {appInfo.reasonForVisit && (
                                <div className='flex flex-col gap-2 col-span-2'>
                                    <strong className='text-xs uppercase text-gray-500'>Reason for Visit</strong>
                                    <span className='bg-gray-100 px-4 py-3.5 rounded-md text-gray-600'>{appInfo.reasonForVisit}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {appInfo.adminNotes && (
                    <div className='flex flex-col gap-8'>
                        <div className='flex flex-col bg-card border border-gray-100 rounded-lg shadow-lg'>
                            <h2 className='flex items-center gap-2.5 px-4 py-2 border-b border-gray-200 text-primary-dark text-md font-bold'><img className='w-5' src={paper} alt='' />Internal Remarks</h2>
                            <div className='p-4'>
                                <p className='text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-4 border-primary'>
                                    "{appInfo.adminNotes}"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex gap-4 items-end ml-auto px-12 py-1.5'>
                <button
                    onClick={() => { setSelectStatus('confirmed'); setShowModal(true); }}
                    className='flex items-center justify-center gap-2.5 px-4 py-3 border border-success/20 bg-success/30 text-success font-bold rounded-lg cursor-pointer active:scale-95 transition-all hover:brightness-110'
                >
                    <img className='w-5' src={check} alt='' /> Confirm Appointment
                </button>
                <button
                    onClick={() => { setSelectStatus('cancelled'); setShowModal(true); }}
                    className='flex items-center justify-center gap-2.5 px-4 py-3 border border-red/30 bg-red/20 text-red font-bold rounded-lg cursor-pointer active:scale-95 transition-all hover:brightness-110'
                >
                    <img className='w-5' src={cancel} alt='' /> Cancel Appointment
                </button>
            </div>

            {showModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200'>
                        <h2 className='text-2xl font-bold mb-2'>{selectStatus === 'confirmed' ? 'Confirm' : 'Cancel'} Appointment</h2>
                        <p className='text-gray-500 mb-4 text-sm'>Add an internal remark for this action.</p>
                        <textarea
                            className='w-full border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-primary outline-none transition-all'
                            placeholder='Type your remarks here...'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <div className='flex gap-3 mt-6'>
                            <button onClick={() => setShowModal(false)} className='flex-1 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'>Discard</button>
                            <button onClick={handleStatusUpdate} className={`flex-1 py-2.5 font-bold text-white rounded-lg transition-all active:scale-95 ${selectStatus === 'confirmed' ? 'bg-success' : 'bg-red'}`}>Save & Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AppointmentDetail