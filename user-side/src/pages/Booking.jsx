import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

// components 
import LoadingSpinner from '../components/LoadingSpinner'
import DoctorCard from '../components/DoctorCard'
import StepIndicator from '../components/StepIndicator'
import StepNav from '../components/StepNav'
import Button from '../components/Button'
import TimeSlotButton from '../components/TimeSlotButton'
import InputField from '../components/InputField'
import BookingSummary from '../components/BookingSummary'
import Confirmation from './Confirmation'

// assets
import check from '../assets/icons/check.svg'
import clock from '../assets/icons/clock.svg'
import down_arrow from '../assets/icons/down_arrow.svg'

// constants
import APPOINTMENT_TYPES from '../constants/appointmentTypes'
import DEPARTMENTS from '../constants/departments'

// services
import { createAppointment } from '../services/appointmentService'
import { fetchAllDoctors, fetchDoctorById } from '../services/doctorService'
import { fetchSlots } from '../services/timeslotService'

// utils
import { validateForm } from '../utils/validators'

const defaultClassNames = getDefaultClassNames()
const stepLabels = ['Department', 'Doctor', 'Schedule', 'Details']

const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0
    const [time, period] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)

    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0
    return hours * 60 + minutes
}

const Booking = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const preselectedDoctorId = searchParams.get('doctor')

    const initialFormData = {
        department: '',
        docId: '',
        doctor: '',
        date: '',
        time: '',
        name: '',
        phone: '',
        email: '',
        appointmentType: '',
        reasonForVisit: '',
        fee: 0,
        referenceNumber: ''
    }

    const [formData, setFormData] = useState(initialFormData)
    const [doctors, setDoctors] = useState([])
    const [slots, setSlots] = useState([])
    const [date, setDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [step, setStep] = useState(preselectedDoctorId ? 0 : 1)

    const selectedDoctor = doctors.find(d => d._id === formData.docId)

    useEffect(() => {
        if (!preselectedDoctorId) return

        const preFill = async () => {
            try {
                const doc = await fetchDoctorById(preselectedDoctorId)
                const baseFee = Number(doc.fee) || 0
                setDoctors([doc])
                setFormData(prev => ({
                    ...prev,
                    department: doc.department,
                    docId: doc._id,
                    doctor: doc.name,
                    fee: baseFee + 5
                }))
                setStep(3)
            } catch (error) {
                console.error('Failed to load selected doctor: ', error)
                setStep(1)
            }
        }
        preFill()
    }, [preselectedDoctorId])

    useEffect(() => {
        if (preselectedDoctorId) return
        const getDoctors = async () => {
            setIsLoading(true)
            try {
                const data = await fetchAllDoctors()
                setDoctors(
                    formData.department
                        ? data.filter(doc => doc.department === formData.department)
                        : data
                )
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        getDoctors()
    }, [formData.department, preselectedDoctorId])

    useEffect(() => {
        const getSlots = async () => {
            if (formData.docId && formData.date) {
                setIsLoading(true)
                try {
                    const data = await fetchSlots(formData.docId, formData.date)
                    const sorted = [...data].sort(
                        (a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
                    )
                    setSlots(sorted)
                } catch (error) {
                    console.error('Failed to fetch slots:', error)
                    setSlots([])
                } finally {
                    setIsLoading(false)
                }
            }
        }
        getSlots()
    }, [formData.docId, formData.date])

    const handleBookAnother = () => {
        setFormData(initialFormData)
        setDoctors([])
        setSlots([])
        setDate(new Date())
        setErrors({})
        setSubmitError('')
        setStep(1)
        navigate('/booking', { replace: true })
    }

    const handleCancel = () => navigate(-1)

    const nextStep = () => {
        setErrors({})
        setStep(prev => prev + 1)
    }

    const prevStep = () => {
        if (step === 3) {
            setFormData(prev => ({ ...prev, time: '', date: '' }))
            setDate(new Date())
            setSlots([])

            if (preselectedDoctorId) {
                navigate(-1)
                return
            }
        }
        if (step === 2) {
            setFormData(prev => ({ ...prev, doctor: '', docId: '' }))
        }
        setErrors({})
        setStep(prev => prev - 1)
    }

    const isStep4Incomplete = useMemo(
        () => Object.keys(validateForm(formData)).length > 0,
        [formData]
    )

    const handleDateChange = (date) => {
        if (!date) return
        setDate(date)
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        setFormData(prev => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }))
    }

    const handleChange = (input) => (value) => {
        setFormData(prev => ({ ...prev, [input]: value }))
        if (errors[input]) {
            setErrors(prev => { const u = { ...prev }; delete u[input]; return u })
        }
    }

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return ''
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        })
    }

    const handleSubmit = async () => {
        const validationErrors = validateForm(formData)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setIsSubmitting(true)
        setSubmitError('')
        try {
            const result = await createAppointment(formData)
            const appointmentData = result.data || result
            if (appointmentData?.referenceNumber) {
                setFormData(prev => ({ ...prev, referenceNumber: appointmentData.referenceNumber }))
                setStep(5)
            } else {
                throw new Error('Reference number missing from server response.')
            }
        } catch (error) {
            console.error('Submission Error:', error)
            setSubmitError(error.message || 'Something went wrong while booking.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (step === 0) return <LoadingSpinner message='Preparing your booking...' />

    if (step === 5) return <Confirmation formData={formData} onBookAnother={handleBookAnother} />

    let stepContent

    switch (step) {
        case 1:
            stepContent = (
                <div>
                    <h1 className='text-lg text-primary font-bold'>Select a Department</h1>
                    <p className='text-sm text-gray-500'>Please choose the medical department for your appointment.</p>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8'>
                        {DEPARTMENTS.map((dept) => {
                            const isSelected = formData.department === dept.name
                            return (
                                <div
                                    key={dept.id}
                                    onClick={() => handleChange('department')(dept.name)}
                                    className={`relative flex flex-col justify-center gap-3.5 bg-card rounded-lg px-4 py-8 border-2 transition-all cursor-pointer shadow-md
                                        ${isSelected ? 'border-primary ring-2 ring-primary/20 shadow-lg' : 'border-gray-200 hover:border-primary/40'}`}
                                >
                                    {isSelected && (
                                        <div className='absolute top-4 right-4 w-7 h-7 bg-primary-dark rounded-full flex items-center justify-center shadow-md'>
                                            <img src={check} alt='selected' className='w-4' />
                                        </div>
                                    )}
                                    <div className={`px-2 py-2.5 w-16 flex items-center justify-center rounded-lg transition-colors ${isSelected ? 'bg-primary-dark' : 'bg-primary/10'}`}>
                                        <img className={`w-12 transition-all ${isSelected ? 'invert brightness-10' : ''}`} src={dept.icon} alt={dept.name} />
                                    </div>
                                    <span className={`text-md font-bold transition-colors ${isSelected ? 'text-primary' : 'text-gray-600'}`}>
                                        {dept.name}
                                    </span>
                                    <p className='text-sm text-gray-500 leading-relaxed'>{dept.desc}</p>
                                </div>
                            )
                        })}
                    </div>

                    <StepNav
                        onBack={handleCancel}
                        backLabel='Cancel'
                        onNext={nextStep}
                        nextDisabled={!formData.department}
                    />
                </div>
            )
            break

        case 2:
            stepContent = (
                <div>
                    <h1 className='text-lg text-primary font-bold'>Choose Your Doctor</h1>
                    <p className='text-sm text-gray-500'>Choose from our list of specialists</p>

                    {isLoading ? (
                        <div className='py-16'>
                            <LoadingSpinner message='Loading doctors...' />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-8'>
                            {doctors.map((doc) => {
                                const isSelected = formData.docId === doc._id
                                const baseFee = Number(doc.fee) || 0
                                return (
                                    <div
                                        key={doc._id}
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            docId: doc._id,
                                            doctor: doc.name,
                                            fee: baseFee + 5
                                        }))}
                                        className='relative cursor-pointer'
                                    >
                                        {isSelected && (
                                            <div className='absolute z-10 top-4 right-4 w-7 h-7 bg-primary-dark rounded-full flex items-center justify-center shadow-md'>
                                                <img src={check} alt='selected' className='w-4' />
                                            </div>
                                        )}
                                        <DoctorCard
                                            name={doc.name}
                                            photoUrl={doc.photoUrl}
                                            department={doc.department}
                                            experience={doc.experience}
                                            fee={doc.fee}
                                            isBookingMode={true}
                                            isSelected={isSelected}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <StepNav onBack={prevStep} onNext={nextStep} nextDisabled={!formData.docId} />
                </div>
            )
            break

        case 3:
            stepContent = (
                <div>
                    <h1 className='text-lg text-primary font-bold'>Select Date & Time</h1>
                    <p className='text-sm text-gray-500'>Choose a convenient slot for your appointment with {formData.doctor}</p>

                    <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 py-8'>
                        <div className='flex flex-col gap-6'>
                            <DayPicker
                                mode='single'
                                selected={date}
                                onSelect={handleDateChange}
                                disabled={{ before: new Date() }}
                                navLayout='around'
                                classNames={{
                                    today: `text-primary-dark font-semibold`,
                                    selected: `bg-primary rounded-full text-white`,
                                    months: `w-full`,
                                    month_grid: `table w-full mt-2.5 justify-between`,
                                    caption_label: `text-lg`,
                                    weekdays: `flex justify-between items-center w-full`,
                                    weekday: `w-10 h-10`,
                                    week: `flex justify-between w-full`,
                                    day: `w-10 h-10`,
                                    chevron: `fill-primary`,
                                    root: `${defaultClassNames.root} w-full bg-card border border-gray-300 rounded-lg shadow-md px-4 py-6`,
                                }}
                            />

                            <div className='flex flex-col gap-4 px-4 py-6 bg-card border border-gray-300 rounded-lg shadow-md'>
                                <span className='flex items-center gap-1.5 text-primary-dark font-semibold'>
                                    <img className='w-5' src={clock} alt='' />Available Time Slots
                                </span>

                                {isLoading ? (
                                    <div className='py-8'>
                                        <LoadingSpinner message='Loading available slots...' />
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                                        {slots.length > 0 ? (
                                            slots.map((slot) => (
                                                <TimeSlotButton
                                                    key={slot._id}
                                                    slot={slot}
                                                    isSelected={formData.time === slot.time}
                                                    onClick={(selectedTime) => handleChange('time')(selectedTime)}
                                                />
                                            ))
                                        ) : (
                                            <p className='col-span-4 text-gray-400 italic text-center py-4'>
                                                No slots available for this date.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='hidden lg:block'>
                            <BookingSummary
                                selectedDoctor={selectedDoctor}
                                formData={formData}
                                formatDisplayDate={formatDisplayDate}
                            />
                        </div>
                    </div>

                    <StepNav onBack={prevStep} onNext={nextStep} nextDisabled={!formData.date || !formData.time} />
                </div>
            )
            break

        case 4:
            stepContent = (
                <div>
                    <h1 className='text-lg text-primary font-bold'>Patient Information</h1>
                    <p className='text-sm text-gray-500'>Please provide your details to finalize your appointment booking.</p>

                    <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 py-8'>
                        <div className='bg-card px-4 py-2.5 border border-gray-300 rounded-lg shadow-md'>
                            <div className='grid grid-cols-1 sm:grid-cols-2'>
                                <InputField
                                    label='Full Name'
                                    type='text'
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    placeholder='e.g. John Doe'
                                    error={errors.name}
                                    required
                                />
                                <InputField
                                    label='Email'
                                    type='email'
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    placeholder='e.g. john.doe@example.com'
                                    error={errors.email}
                                    required
                                />
                                <InputField
                                    label='Phone Number'
                                    type='tel'
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    placeholder='+1 (555) 000-0000'
                                    error={errors.phone}
                                    required
                                />

                                {/* Appointment Type */}
                                <div className='flex flex-col w-full gap-1.5 px-2 py-3.5'>
                                    <Listbox
                                        value={formData.appointmentType}
                                        onChange={(val) => setFormData(prev => ({ ...prev, appointmentType: val }))}
                                    >
                                        <Label className='font-medium'>Appointment Type</Label>
                                        <div className='relative'>
                                            <ListboxButton className={({ open }) =>
                                                `flex justify-between items-center w-full cursor-pointer rounded-lg border border-border px-1.5 py-2.5 text-left text-gray-700 transition-all ${open ? 'outline outline-primary/15' : ''}`
                                            }>
                                                <span className='block truncate'>
                                                    {formData.appointmentType || 'Select appointment type'}
                                                </span>
                                                <img src={down_arrow} alt='' />
                                            </ListboxButton>
                                            <ListboxOptions className='absolute z-10 mt-1 w-full overflow-auto rounded-lg bg-white px-1.5 py-2.5 text-base shadow-lg ring-2 ring-primary/10 focus:outline-none'>
                                                {APPOINTMENT_TYPES.map((type) => (
                                                    <ListboxOption
                                                        key={type.id}
                                                        value={type.label}
                                                        className={({ selected }) =>
                                                            `relative cursor-pointer select-none rounded-lg py-2.5 pl-4 pr-4 transition-colors ${selected ? 'text-primary font-semibold bg-primary/15' : ''} hover:bg-primary/5`
                                                        }
                                                    >
                                                        {type.label}
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                    {errors.appointmentType && (
                                        <p className='text-red-500 text-xs px-2'>{errors.appointmentType}</p>
                                    )}
                                </div>

                                {/* Reason for Visit */}
                                <label className='col-span-1 sm:col-span-2 flex flex-col gap-1.5 w-full px-2 py-3.5'>
                                    <span className='font-medium'>Reason for Visit</span>
                                    <textarea
                                        className='border border-border focus:outline-2 focus:outline-primary rounded-lg px-1.5 py-2.5 resize-none'
                                        rows={6}
                                        placeholder='Briefly describe your symptoms or reason for the visit...'
                                        value={formData.reasonForVisit}
                                        onChange={(e) => handleChange('reasonForVisit')(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='hidden lg:block'>
                            <BookingSummary
                                selectedDoctor={selectedDoctor}
                                formData={formData}
                                formatDisplayDate={formatDisplayDate}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col items-end gap-3'>
                        {submitError && <p className='text-red-500 text-sm w-full text-center'>{submitError}</p>}
                        <StepNav
                            onBack={prevStep}
                            onNext={handleSubmit}
                            nextLabel={isSubmitting ? 'Booking...' : 'Book Appointment'}
                            nextDisabled={isStep4Incomplete || isSubmitting}
                        />
                    </div>
                </div>
            )
            break

        default:
            stepContent = null
    }

    return (
        <div className='px-6 lg:px-24 py-10'>
            <p className='text-primary font-semibold uppercase tracking-wide'>Booking</p>
            <StepIndicator steps={stepLabels} currentStep={step} />
            <div className='mt-10 mb-16'>
                {stepContent}
            </div>
        </div>
    )
}

export default Booking