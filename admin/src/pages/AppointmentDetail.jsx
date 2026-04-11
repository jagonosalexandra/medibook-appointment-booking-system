import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { fetchAppointmentById, updateAppointment } from '../services/appointmentService'
import close from '../assets/icons/close.svg'
import user from '../assets/icons/user.svg'
import booking_info from '../assets/icons/booking_info.svg'
import doctor from '../assets/icons/doctor.svg'
import clock from '../assets/icons/clock.svg'
import paper from '../assets/icons/paper-fold.svg'
import Button from '../components/Button'

const AppointmentDetail = () => {
    const { appId } = useParams()
    const navigate = useNavigate()

    const [appInfo, setAppInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [selectStatus, setSelectStatus] = useState("")
    const [notes, setNotes] = useState("")

    useEffect(() => {
        const fetchAppInfo = async () => {
            try {
                const appointment = await fetchAppointmentById(appId)
                setAppInfo(appointment)
            } catch (error) {
                setError("Failed to load appointment detail")
                toast.error("Failed to load appointment detail")
            } finally {
                setLoading(false)
            }
        }
        fetchAppInfo()
    }, [appId])

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        })
    }

    const handleStatusUpdate = async () => {
        try {
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
        } catch (error) {
            console.error("Failed to update status: ", error)
            toast.error(error.message || "Failed to update appointment");
        }
    }

    if (loading) return <LoadingSpinner message="Loading appointment detail..." />
    if (error) return <p className="text-red">{error}</p>
    if (!appInfo) return null

    return appInfo && (
        <div className='w-full h-screen flex flex-col gap-6 lg:gap-8 px-4 lg:px-12 py-6 lg:py-8 overflow-y-auto'>
            <div className='flex flex-col justify-between items-start gap-4 relative'>
                <div>
                    <p className='text-xs uppercase font-medium text-gray-500 mb-1.5'>Appointment Details</p>
                </div>
                <div className='flex flex-wrap items-center gap-3'>
                    <h1 className='text-3xl lg:text-4xl font-black'>{appInfo.referenceNumber}</h1>
                    <StatusBadge status={appInfo.status} />
                </div>
                <button onClick={() => navigate(-1)} className='absolute right-0 cursor-pointer shrink-0'>
                    <img className='w-7 lg:w-8' src={close} alt='close' />
                </button>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-6 lg:gap-8'>

                <div className='flex flex-col gap-6 lg:gap-8'>
                    {/* PATIENT INFO */}
                    <div className='bg-card border border-gray-300 py-3 rounded-xl shadow-lg'>
                        <h2 className='flex items-center gap-2.5 px-4 pb-1.5 border-b border-gray-200 text-primary-dark text-md font-bold'>
                            <img className='w-5' src={user} alt='' />
                            Patient Information
                        </h2>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 py-4'>
                            <p className='flex flex-col gap-1 font-medium'>
                                <strong className='text-xs uppercase text-gray-500'>Full Name</strong>
                                {appInfo.name}
                            </p>
                            <p className='flex flex-col gap-1 font-medium'>
                                <strong className='text-xs uppercase text-gray-500'>Contact Number</strong>
                                {appInfo.phone}
                            </p>
                            <p className='flex flex-col gap-1 font-medium'>
                                <strong className='text-xs uppercase text-gray-500'>Email Address</strong>
                                {appInfo.email}
                            </p>
                        </div>
                    </div>

                    {/* BOOKING INFO */}
                    <div className='bg-card border border-gray-300 py-3 rounded-lg shadow-xl'>
                        <h2 className='flex items-center gap-2.5 px-4 pb-1.5 border-b border-gray-200 text-primary-dark text-md font-bold'>
                            <img className='w-5' src={booking_info} alt='' />
                            Booking Information
                        </h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 py-4'>
                            <div className='flex items-center gap-2.5'>
                                <img className='w-12 bg-primary/20 px-1.5 py-2 rounded-lg shrink-0' src={doctor} alt='' />
                                <div className='flex flex-col'>
                                    <strong className='text-xs uppercase text-gray-500 py-1'>Doctor</strong>
                                    <span className='font-extrabold'>{appInfo.doctor}</span>
                                    <span className='text-sm text-gray-500'>{appInfo.department}</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <img className='w-12 bg-primary/20 px-1.5 py-2 rounded-lg shrink-0' src={clock} alt='' />
                                <div className='flex flex-col'>
                                    <strong className='text-xs uppercase text-gray-500 py-1'>Date & Time</strong>
                                    <span className='font-extrabold'>{formatDate(appInfo.date)}</span>
                                    <span className='text-sm text-gray-500'>{appInfo.time}</span>
                                </div>
                            </div>
                            <p className='flex flex-col gap-1 font-medium'>
                                <strong className='text-xs uppercase text-gray-500'>Visit Type</strong>
                                {appInfo.appointmentType}
                            </p>
                            <p className='flex flex-col gap-1 font-medium'>
                                <strong className='text-xs uppercase text-gray-500'>Appointment Fee</strong>
                                ${appInfo.fee}
                            </p>
                            {appInfo.reasonForVisit && (
                                <div className='flex flex-col gap-2 col-span-1 sm:col-span-2'>
                                    <strong className='text-xs uppercase text-gray-500'>Reason for Visit</strong>
                                    <span className='bg-gray-100 px-4 py-3.5 rounded-md text-gray-600'>
                                        {appInfo.reasonForVisit}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col bg-card border border-gray-100 rounded-lg shadow-lg h-fit'>
                    <h2 className='flex items-center gap-2.5 px-4 py-2 border-b border-gray-200 text-primary-dark text-md font-bold'>
                        <img className='w-5' src={paper} alt='' />
                        Internal Remarks
                    </h2>
                    <div className='p-4'>
                        {appInfo.adminNotes ? (
                            <p className='text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-4 border-primary'>
                                "{appInfo.adminNotes}"
                            </p>
                        ) : (
                            <p className='text-sm text-gray-400 italic'>No remarks added yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end pb-4'>
                {appInfo.status !== 'confirmed' && (
                    <Button
                        label='Confirm Appointment'
                        variant='primary'
                        onClick={() => { setSelectStatus('confirmed'); setShowModal(true); }}
                    />
                )}
                {appInfo.status !== 'cancelled' && (
                    <Button
                        label='Cancel Appointment'
                        variant='secondary'
                        onClick={() => { setSelectStatus('cancelled'); setShowModal(true); }}
                    />
                )}
            </div>

            {showModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200'>
                        <h2 className='text-2xl font-bold mb-2'>{selectStatus === 'confirmed' ? 'Confirm' : 'Cancel'} Appointment</h2>
                        <p className='text-gray-500 mb-4 text-sm'>Add an internal remark for this action.</p>
                        <textarea
                            className='w-full border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-primary outline-none transition-all resize-none'
                            placeholder='Type your remarks here...'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <div className='flex gap-3 mt-6'>
                            <Button
                                label='Discard'
                                variant='muted'
                                onClick={() => setShowModal(false)}
                                fullWidth
                            />
                            <Button
                                label='Save & Update'
                                variant='primary'
                                onClick={handleStatusUpdate}
                                fullWidth
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AppointmentDetail