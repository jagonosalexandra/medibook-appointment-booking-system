import React, { useEffect, useMemo, useState } from 'react'
import StepIndicator from '../components/StepIndicator'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import check from '../assets/icons/check.svg'
import clock from '../assets/icons/clock.svg'
import calendar from '../assets/icons/calendar.svg'
import info from '../assets/icons/info.svg'
import down_arrow from '../assets/icons/down_arrow.svg'
import user from '../assets/icons/user.svg'
import department from '../assets/icons/department.svg'
import { fetchAllDoctors } from '../services/doctorService'
import DoctorCard from '../components/DoctorCard'
import { fetchSlots } from '../services/timeslotService'
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import InputField from '../components/InputField'
import TimeSlotButton from '../components/TimeSlotButton'
import APPOINTMENT_TYPES from '../constants/appointmentTypes'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import Confirmation from './Confirmation'
import DEPARTMENTS from '../constants/departments'
import { validateForm } from '../utils/validators'

const defaultClassNames = getDefaultClassNames();

const stepLabels = ['Department', 'Doctor', 'Schedule', 'Details']

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
  const [errors, setErrors] = useState({})

  const selectedDoctor = doctors.find(d => d.name === formData.doctor);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const data = await fetchAllDoctors()
        setDoctors(
          formData.department
            ? data.filter(doc => doc.department === formData.department)
            : data
        )
      } catch (error) {
        console.error(error)
      }
    }
    getDoctors()
  }, [formData.department])

  useEffect(() => {
    const getSlots = async () => {
      const doc = doctors.find(doc => doc.name === formData.doctor)
      if (doc && formData.date) {
        try {
          const data = await fetchSlots(doc._id, formData.date)
          setSlots(data)
        } catch (error) {
          console.error("Failed to fetch slots:", error)
          setSlots([])
        }
      }
    }
    getSlots()
  }, [formData.doctor, formData.date, doctors])

  const handleCancel = () => navigate(-1)
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => {
    if (step === 3) {
      setFormData(prev => ({ ...prev, time: '', date: '' }))
      setSlots([])
    }
    if (step === 2) {
      setFormData(prev => ({ ...prev, doctor: '' }))
    }
    setStep(prev => prev - 1)
  }

  const isStep4Incomplete = useMemo(
    () => Object.keys(validateForm(formData)).length > 0,
    [formData]
  )

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

  const handleChange = (input) => (value) => {
    setFormData((prev) => ({ ...prev, [input]: value }))

    if (errors[input]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[input]
        return updated
      })
    }
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleNextStep = () => {
    if (step === 4) {
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setErrors({});
    nextStep();
  };

  let stepContent

  switch (step) {
    case 1:
      stepContent = (
        <div>
          <h1 className='text-lg text-primary font-bold'>Select a Department</h1>
          <p className='text-sm text-gray-500'>Please choose the medical department for your appointment.</p>

          <div className='grid grid-cols-3 gap-12 py-8'>
            {DEPARTMENTS.map((dept) => {
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
            {doctors.map((doc) => {
              const isSelected = formData.doctor === doc.name;

              return (
                <div key={doc._id} onClick={() => handleChange('doctor')(doc.name)} className="relative cursor-pointer">
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
            <div className='w-full max-w-xs'><Button label="Next" variant={!formData.doctor ? "disabled" : "primary"} onClick={nextStep} fullWidth disabled={!formData.doctor} /></div>
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
                  root: `${defaultClassNames.root} w-full bg-card border border-gray-300 rounded-lg shadow-md px-4 py-6`,
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
                        <TimeSlotButton
                          key={slot._id}
                          slot={slot}
                          isSelected={formData.time === slot.time}
                          onClick={(selectedTime) => handleChange('time')(selectedTime)}
                        />
                      ))
                  ) : (
                    <p className="col-span-4 text-gray-400 italic text-center py-4">No slots found for this date.</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden p-6 shadow-md'>
              <span className='font-bold'>Booking Summary</span>
              <div className='flex flex-col gap-4 pt-2.5'>
                <div>
                  <div className='flex items-center gap-2.5 py-1.5'>
                    <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg' src={user} alt='' />
                    <p className='text-sm text-gray-500 font-bold'>
                      DOCTOR
                      <span className='block text-md font-medium text-black'>{selectedDoctor?.name}</span>
                    </p>
                  </div>

                  <div className='flex items-center gap-2.5 py-1.5'>
                    <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg' src={department} alt='' />
                    <p className='text-sm text-gray-500 font-bold'>
                      DEPARTMENT
                      <span className='block text-md font-medium text-black'>{selectedDoctor?.department}</span>
                    </p>
                  </div>

                  {formData?.date && formData?.time && (
                    <div className='flex items-center gap-2.5 py-1.5'>
                      <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg' src={clock} alt='' />
                      <p className='text-sm text-gray-500 font-bold'>
                        DATE & TIME
                        <span className='block text-md font-medium text-black'>{formatDisplayDate(formData?.date)}, ${formData?.time}</span>
                      </p>
                    </div>
                  )}

                  < hr className='border-none outline-none h-px bg-gray-300 my-6' />

                  <ul className='space-y-1 text-sm text-gray-600 pt-3 rounded-lg'>
                    <li className='flex justify-between'><span className='text-gray-500'>Consultation Fee:</span> <span className='font-semibold text-black'>${selectedDoctor?.fee || '0'}</span></li>
                    <li className='flex justify-between'><span className='text-gray-500'>Service Fee:</span> <span className='font-semibold text-black'>$5.00</span></li>
                  </ul>

                  <hr className='border-none outline-none h-px bg-gray-300 my-6' />

                  <p className='flex justify-between text-md font-bold'>Total <span className='scale-120 text-primary'>${selectedDoctor?.fee + Number(5.00)}</span></p>
                </div>

                <div className='bg-primary/10 border border-primary/30 rounded-lg px-2.5 py-3.5 mt-4 text-xs'>
                  <span className='flex items-center gap-1.5 text-sm text-black font-semibold'><img className='w-5' src={info} alt='' />Cancellations</span>
                  <p className='pl-6.5 py-1.5 text-gray-500'>
                    Cancel at least 24 hours in advance for a full refund. Appointments booked within 24 hours are non-refundable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full flex justify-between items-center gap-48'>
            <div className='w-full max-w-xs'><Button label="Back" variant="secondary" onClick={prevStep} fullWidth /></div>
            <div className='w-full max-w-xs'><Button label="Next" variant={!formData.date || !formData.time ? "disabled" : "primary"} onClick={nextStep} fullWidth disabled={!formData.date || !formData.time} /></div>
          </div>
        </div>
      )
      break
    case 4:
      stepContent = (
        <div>
          <h1 className='text-lg text-primary font-bold'>Patient Information</h1>
          <p className='text-sm text-gray-500'>Please provide your details to finalize your appointment booking.</p>

          <div className='grid grid-cols-[3fr_1fr] gap-8 py-8'>
            <div className='bg-card px-4 py-2.5 border border-gray-300 rounded-lg shadow-md max-h-fit'>
              <div className='grid grid-cols-2'>
                <InputField
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="e.g. John Doe"
                  error={errors.name}
                  required
                />

                <InputField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="e.g. john.doe@example.com"
                  error={errors.email}
                  required
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="+1 (555) 000-0000"
                  error={errors.phone}
                  required
                />

                <div className='flex flex-col w-full gap-1.5 px-2 py-3.5'>
                  <Listbox value={formData.appointment_type} onChange={(val) => setFormData(prev => ({ ...prev, appointment_type: val }))}>
                    <Label>Appointment Type</Label>
                    <div className='relative'>
                      <ListboxButton className={({ open }) => `flex justify-between items-center w-full cursor-pointer rounded-lg border border-border px-1.5 py-2.5 text-left text-gray-700 ${open ? 'outline outline-primary/15' : ''} transition-all`}>
                        <span className='block truncate'>
                          {formData.appointment_type || "Select appointment type"}
                        </span>
                        <img src={down_arrow} alt='' />
                      </ListboxButton>

                      <ListboxOptions transition className='absolute z-10 mt-1 w-full overflow-auto rounded-lg bg-white px-1.5 py-2.5 text-base shadow-lg ring-2 ring-primary ring-opacity-5 focus:outline-none'>
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
                  {errors.appointment_type && <p className="text-error text-xs px-2">{errors.appointment_type}</p>}
                </div>

                <label className='col-span-2 flex flex-col gap-1.5 w-full px-2 py-3.5'>
                  Reason for Visit
                  <textarea
                    className='border border-border focus:outline-2 focus:outline-primary rounded-lg px-1.5 py-2.5 resize-none' 
                    rows={10}
                    name='reason-for-visit'
                    placeholder='Briefly describe your symptoms or reason for the visit...'
                    value={formData.visit_reason}
                    onChange={(e) => handleChange('visit_reason')(e.target.value)}
                  ></textarea>
                </label>
              </div>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden p-6 shadow-md'>
              <span className='font-bold'>Booking Summary</span>
              <div className='flex flex-col gap-4 pt-2.5'>
                <div>
                  <div className='flex items-center gap-2.5 py-1.5'>
                    <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg' src={user} alt='' />
                    <p className='text-sm text-gray-500 font-bold'>
                      DOCTOR
                      <span className='block text-md font-medium text-black'>{selectedDoctor?.name}</span>
                    </p>
                  </div>

                  <div className='flex items-center gap-2.5 py-1.5'>
                    <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg' src={department} alt='' />
                    <p className='text-sm text-gray-500 font-bold'>
                      DEPARTMENT
                      <span className='block text-md font-medium text-black'>{selectedDoctor?.department}</span>
                    </p>
                  </div>

                  <div className='flex items-center gap-2.5 py-1.5'>
                    <img className='w-10 px-2.5 py-3 bg-primary/20 rounded-lg' src={clock} alt='' />
                    <p className='text-sm text-gray-500 font-bold'>
                      DATE & TIME
                      <span className='block text-md font-medium text-black'>{formatDisplayDate(formData?.date)}, {formData?.time}</span>
                    </p>
                  </div>

                  <hr className='border-none outline-none h-px bg-gray-300 my-4' />

                  <ul className='space-y-1 text-sm text-gray-600 pt-3 rounded-lg'>
                    <li className='flex justify-between'><span className='text-gray-500'>Consultation Fee:</span> <span className='font-semibold text-black'>${selectedDoctor?.fee || '0'}</span></li>
                    <li className='flex justify-between'><span className='text-gray-500'>Service Fee:</span> <span className='font-semibold text-black'>$5.00</span></li>
                  </ul>

                  <hr className='border-none outline-none h-px bg-gray-300 my-4' />

                  <p className='flex justify-between text-md font-bold'>Total <span className='scale-120 text-primary'>${selectedDoctor?.fee + Number(5.00)}</span></p>
                </div>

                <div className='bg-primary/10 border border-primary/30 rounded-lg px-2.5 py-3.5 mt-4 text-xs'>
                  <span className='flex items-center gap-1.5 text-sm text-black font-semibold'><img className='w-5' src={info} alt='' />Cancellations</span>
                  <p className='pl-6.5 py-1.5 text-gray-500'>
                    Cancel at least 24 hours in advance for a full refund. Appointments booked within 24 hours are non-refundable.
                  </p>
                </div>
              </div>
            </div>
          </div>


          <div className='w-full flex justify-between items-center gap-48'>
            <div className='w-full max-w-xs'><Button label="Back" variant="secondary" onClick={prevStep} fullWidth /></div>
            <div className='w-full max-w-xs'><Button label="Next" variant={isStep4Incomplete ? "disabled" : "primary"} onClick={handleNextStep} fullWidth disabled={isStep4Incomplete} /></div>
          </div>
        </div>
      )
      break
    case 5:
      return <Confirmation formData={formData} />
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