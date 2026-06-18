import React from 'react'
import check from '../assets/icons/check-dark.svg'
import user from '../assets/icons/user.svg'
import department from '../assets/icons/department.svg'
import clock from '../assets/icons/clock.svg'
import money from '../assets/icons/money.svg'
import info from '../assets/icons/info.svg'
import id_badge from '../assets/icons/id-badge.svg'
import paper from '../assets/icons/paper-fold.svg'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

const Confirmation = ({ formData, onBookAnother }) => {
    const navigate = useNavigate()

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return ''
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        })
    }

    return (
        <div className='flex flex-col justify-center items-center gap-8 px-6 py-10 pb-16'>

            <div className='flex flex-col items-center justify-center gap-1 text-center'>
                <div className='bg-primary/20 rounded-full w-18 p-3'>
                    <img className='p-1 border-4 border-primary-dark rounded-full' src={check} alt='' />
                </div>

                <h1 className='text-xl font-bold mt-2'>Booking Request Received!</h1>
                <p className='text-sm text-gray-500 max-w-sm'>
                    Your appointment request has been submitted. Our team will review and confirm it shortly.
                </p>

                <div className='flex items-center gap-2 mt-3'>
                    <span className='w-2 h-2 rounded-full bg-yellow animate-pulse' />
                    <span className='text-xs font-bold text-yellow uppercase tracking-wide'>Pending Confirmation</span>
                </div>

                <p className='bg-primary/10 border border-primary/20 text-primary font-semibold px-3 py-1.5 mt-4 rounded-full uppercase text-sm'>
                    Reference: {formData.referenceNumber}
                </p>
            </div>

            <div className='bg-card rounded-lg overflow-hidden w-full max-w-md shadow-lg'>
                <div className='bg-primary text-white font-bold p-4'>
                    <h2>Appointment Summary</h2>
                </div>

                <div className='flex flex-col gap-3.5 px-4 py-6'>
                    <div className='flex items-center gap-4'>
                        <img className='w-12 px-2.5 py-3 bg-primary/20 rounded-lg shrink-0' src={user} alt='' />
                        <p className='text-sm text-gray-500 font-bold'>
                            DOCTOR
                            <span className='block text-md font-medium text-black'>{formData.doctor}</span>
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <img className='w-12 px-2.5 py-3 bg-primary/20 rounded-lg shrink-0' src={department} alt='' />
                        <p className='text-sm text-gray-500 font-bold'>
                            DEPARTMENT
                            <span className='block text-md font-medium text-black'>{formData.department}</span>
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <img className='w-12 px-2.5 py-3 bg-primary/20 rounded-lg shrink-0' src={clock} alt='' />
                        <p className='text-sm text-gray-500 font-bold'>
                            DATE & TIME
                            <span className='block text-md font-medium text-black'>
                                {formatDisplayDate(formData.date)}, {formData.time}
                            </span>
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <img className='w-12 px-2.5 py-3 bg-primary/20 rounded-lg shrink-0' src={money} alt='' />
                        <p className='text-sm text-gray-500 font-bold'>
                            FEE
                            <span className='block text-md font-medium text-black'>${formData.fee}</span>
                        </p>
                    </div>
                </div>

                <div className='bg-primary/5 border-t border-primary/10 px-4 py-4 text-sm'>
                    <h2 className='text-primary font-bold mb-2'>What Happens Next</h2>

                    <div className='flex gap-2.5 text-xs pt-1.5 text-gray-600'>
                        <img className='w-4 shrink-0' src={info} alt='' />
                        <p>You'll receive a confirmation email or call once our team reviews and approves your request.</p>
                    </div>

                    <div className='flex gap-2.5 text-xs pt-1.5 text-gray-600'>
                        <img className='w-4 shrink-0' src={id_badge} alt='' />
                        <p>Bring a valid government-issued ID and your insurance card to your visit.</p>
                    </div>

                    <div className='flex gap-2.5 text-xs pt-1.5 text-gray-600'>
                        <img className='w-4 shrink-0' src={paper} alt='' />
                        <p>Have your referral forms or previous medical history ready if applicable.</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
                <Button label='Return to Home' variant='secondary' onClick={() => navigate('/')} />
                <Button label='Book Another Appointment' variant='primary' onClick={onBookAnother} />
            </div>
        </div>
    )
}

export default Confirmation