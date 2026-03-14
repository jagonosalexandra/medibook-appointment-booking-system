import React, { useEffect, useState } from 'react'
import StepIndicator from '../components/StepIndicator'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import general_practice from '../assets/icons/general_practice.svg'
import pediatrics from '../assets/icons/pediatrics.svg'
import cardiology from '../assets/icons/cardiology.svg'
import obstetrics from '../assets/icons/obstetrics.svg'
import neurology from '../assets/icons/neurology.svg'
import orthopedics from '../assets/icons/orthopedics.svg'
import check from '../assets/icons/check.svg'
import clock from '../assets/icons/clock.svg'
import calendar from '../assets/icons/calendar.svg'
import info from '../assets/icons/info.svg'
import { fetchAllDoctors } from '../services/doctorService'
import DoctorCard from '../components/DoctorCard'
import { fetchSlots } from '../services/timeslotService'
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";

const defaultClassNames = getDefaultClassNames();

const stepLabels = ['Department', 'Doctor', 'Schedule', 'Details']

const departments = [
  { id: 'general', name: 'General Practice', icon: general_practice, desc: 'Primary care, routine checkups, and general wellness consultation.' },
  { id: 'pedia', name: 'Pediatrics', icon: pediatrics, desc: 'Comprehensive healthcare for infants, children, and adolescents.' },
  { id: 'cardio', name: 'Cardiology', icon: cardiology, desc: 'Specialized heart care, diagnostics, and cardiovascular treatments.' },
  { id: 'obgyn', name: 'Obstetrics & Gynecology', icon: obstetrics, desc: 'Comprehensive reproductive health, pregnancy care, and women’s wellness services.' },
  { id: 'neuro', name: 'Neurology', icon: neurology, desc: 'Diagnosis and treatment of brain, spinal cord, and nervous system disorders.' },
  { id: 'ortho', name: 'Orthopedics', icon: orthopedics, desc: 'Expert care for bones, joints, ligaments, and muscle conditions.' },
];

const Booking = () => {

  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    appointment_type: '',
    visit_reason: ''
  })

  const [doctors, setDoctors] = useState([])
  const [slots, setSlots] = useState([])
  const [date, setDate] = useState(new Date())

  const getDoctors = async () => {
    try {
      const data = await fetchAllDoctors()

      if (formData.department) {
        setDoctors(data.filter(doc => doc.department === formData.department))
      } else {
        setDoctors(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDoctors()
  }, [formData.department])

  const getSlots = async () => {
    const doc = doctors.find(doc => doc.name === formData.doctor)

    if (doc && formData.date) {
      const data = await fetchSlots(doc._id, formData.date)
      console.log(data)
      setSlots(data)
    }
  }

  useEffect(() => {
    getSlots()
  }, [formData.doctor, formData.date, doctors])

  const handleCancel = () => navigate(-1)
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleDateChange = (date) => {
    if (date) {
      setDate(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      setFormData(prev => ({ ...prev, date: formattedDate }));
    }
  }

  const handleChange = (input) => e => {
    setFormData((prev) => ({
      ...prev,
      [input]: e
    }))
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  let stepContent

  switch (step) {
    case 1:
      stepContent = (
        <div>
          <h1 className='text-lg text-primary font-bold'>Select a Department</h1>
          <p className='text-sm text-gray-500'>Please choose the medical department for your appointment.</p>

          <div className='grid grid-cols-3 gap-12 py-8'>
            {departments.map((dept) => {
              const isSelected = formData.department === dept.name;

              return (
                <div
                  key={dept.id}
                  onClick={() => handleChange('department')(dept.name)}
                  className={`relative flex flex-col justify-center gap-3.5 h-[30vh] bg-card rounded-lg px-4 py-8 border-2 transition-all cursor-pointer shadow-md 
                ${isSelected ? 'border-primary outline outline-primary shadow-lg' : 'border-gray-200'}`}
                >
                  {isSelected && (
                    <div className='absolute top-6 right-4 w-7 h-7 bg-primary-dark rounded-full flex items-center justify-center shadow-md'>
                      <img src={check} alt='selected' className='w-4' />
                    </div>
                  )}

                  <div className={`px-2 py-2.5 w-16 flex items-center justify-center rounded-lg transition-colors 
                ${isSelected ? 'bg-primary-dark' : 'bg-primary/10'}`}>
                    <img
                      className={`w-12 transition-all ${isSelected ? 'invert brightness-10' : ''}`}
                      src={dept.icon}
                      alt={dept.name}
                    />
                  </div>

                  <span className={`text-md font-bold transition-colors ${isSelected ? 'text-primary' : 'text-gray-600'}`}>
                    {dept.name}
                  </span>
                  <p className='max-w-xs text-sm text-gray-500 leading-relaxed'>{dept.desc}</p>
                </div>
              );
            })}
          </div>

          <div className='w-full flex justify-between items-center gap-48 mt-32'>
            <div className='w-full max-w-xs'><Button label="Cancel" variant="muted" onClick={handleCancel} fullWidth /></div>
            <div className='w-full max-w-xs'><Button label="Next" variant={!formData.department ? "disabled" : "primary"} onClick={nextStep} fullWidth disabled={!formData.department} /></div>
          </div>
        </div>
      )
      break
    case 2:
      stepContent = (
        <div>
          <h1 className='text-lg text-primary font-bold'>Choose Your Doctor</h1>
          <p className='text-sm text-gray-500'>Choose from our list of specialists</p>

          <div className='grid grid-cols-4 gap-4 py-8'>
            {doctors.map((doc, index) => {
              const isSelected = formData.doctor === doc.name;

              return (
                <div key={index} onClick={() => handleChange('doctor')(doc.name)} className="relative cursor-pointer">
                  {isSelected && (
                    <div className='absolute z-10 top-6 right-4 w-7 h-7 bg-primary-dark rounded-full flex items-center justify-center shadow-md'>
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

          <div className='w-full flex justify-between items-center gap-48'>
            <div className='w-full max-w-xs'><Button label="Back" variant="secondary" onClick={prevStep} fullWidth /></div>
            <div className='w-full max-w-xs'><Button label="Next" variant="primary" onClick={nextStep} fullWidth /></div>
          </div>
        </div>
      )
      break
    case 3:
      stepContent = (
        <div>
          <h1 className='text-lg text-primary font-bold'>Select Date & Time</h1>
          <p className='text-sm text-gray-500'>Choose a convenient slot for your appointment with {formData.doctor}</p>

          <div className='grid grid-cols-[3fr_1fr] gap-8 py-8'>
            {/* LEFT COLUMN */}
            <div className='flex flex-col gap-6'>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                disabled={{ before: new Date() }}
                navLayout="around"
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
                  root: `${defaultClassNames.root} w-full bg-card border-gray-300 rounded-lg shadow-md px-4 py-6`, 
                }}

              />

              <div className='flex flex-col gap-4 px-4 py-6 bg-card border border-gray-300 rounded-lg shadow-md'>
                <span className='flex items-center gap-1.5 text-primary-dark font-semibold'><img className='w-5' src={clock} alt='' />Available Time Slots</span>

                <div className='grid grid-cols-4 gap-4'>
                  {slots.length > 0 ? (
                    [...slots]
                      .sort((a, b) => {
                        const timeA = new Date(`1970/01/01 ${a.time}`);
                        const timeB = new Date(`1970/01/01 ${b.time}`);
                        return timeA - timeB;
                      })
                      .map((slot) => (
                        <button
                          key={slot._id}
                          onClick={() => handleChange('time')(slot.time)}
                          disabled={!slot.isAvailable}
                          className={`py-3 rounded-lg transition-all border-2 
                                      ${!slot.isAvailable ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' :
                              formData.time === slot.time ? 'bg-primary/20 border-primary text-primary font-semibold' :
                                'border-gray-200 hover:border-primary hover:text-primary'}`}
                        >
                          {slot.time}
                        </button>
                      ))
                  ) : (
                    <p className="col-span-4 text-gray-400 italic text-center py-4">No slots found for this date.</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className='flex flex-col gap-8'>
              <div className='border border-gray-200 rounded-xl overflow-hidden'>
                <div className='bg-white p-6'>
                  <span className='font-bold'>Booking Summary</span>
                  <div className='flex flex-col gap-4 pt-2.5'>
                    {(() => {
                      const docObj = doctors.find(d => d.name === formData.doctor);
                      return (
                        <>
                          <div className='flex items-center gap-3'>
                            <img src={docObj?.photoUrl} alt='' className='w-18 aspect-square rounded-full object-cover object-top bg-gray-100' />
                            <div>
                              <p className='font-bold text-lg text-primary'>{formData.doctor || 'Select a doctor'}</p>
                              <p className='text-xs text-gray-500'>{docObj?.department}</p>
                            </div>
                          </div>

                          <ul className='space-y-1 text-sm text-gray-600 pt-3 rounded-lg'>
                            <li className='flex justify-between'><span>Consultation Fee:</span> <span className='font-medium'>${docObj?.fee || '0'}</span></li>
                            <li className='flex justify-between'><span>Duration:</span> <span className='font-medium'>1 Hour</span></li>
                          </ul>
                        </>
                      )
                    })()}
                  </div>
                </div>
                {formData.date && formData.time && (
                  <div className='w-full px-3 py-6 bg-primary/5 text-sm text-gray-600'>
                    <p className='uppercase tracking-wider font-bold mb-2.5'>Selected Appointment</p>
                    <p className='flex items-center gap-1.5'><img className='w-5' src={calendar} alt='' />{formatDisplayDate(formData.date)}</p>
                    <p className='flex items-center gap-1.5'><img className='w-5' src={clock} alt='' />{formData.time}</p>
                  </div>
                )}
              </div>

              <div className='bg-primary/10 border border-primary/30 rounded-lg px-2.5 py-3.5 text-xs'>
                <span className='flex items-center gap-1.5 text-sm text-black font-semibold'><img className='w-5' src={info} alt='' />Cancellations</span>
                <p className='pl-6.5 py-1.5 text-gray-500'>
                  Cancel at least 24 hours in advance for a full refund. Appointments booked within 24 hours are non-refundable.
                </p>
              </div>
            </div>
          </div>

          <div className='w-full flex justify-between items-center gap-48'>
            <div className='w-full max-w-xs'><Button label="Back" variant="secondary" onClick={prevStep} fullWidth /></div>
            <div className='w-full max-w-xs'><Button label="Next" variant="primary" onClick={nextStep} fullWidth /></div>
          </div>
        </div>
      )
      break
  }

  return (
    <div className='px-8 py-10'>
      <p className='text-primary font-semibold uppercase'>Booking</p>
      <StepIndicator steps={stepLabels} currentStep={step} />

      <div className='my-24'>
        {stepContent}
      </div>
    </div>
  )
}

export default Booking