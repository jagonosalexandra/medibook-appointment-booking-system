import React, { useEffect, useState } from 'react'
import StepIndicator from '../components/StepIndicator'
import Button from '../components/Button'
import { data, useNavigate } from 'react-router-dom'
import general_practice from '../assets/icons/general_practice.svg'
import pediatrics from '../assets/icons/pediatrics.svg'
import cardiology from '../assets/icons/cardiology.svg'
import obstetrics from '../assets/icons/obstetrics.svg'
import neurology from '../assets/icons/neurology.svg'
import orthopedics from '../assets/icons/orthopedics.svg'
import check from '../assets/icons/check.svg'
import { fetchAllDoctors } from '../services/doctorService'
import DoctorCard from '../components/DoctorCard'

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

  const handleCancel = () => navigate(-1)
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleChange = (input) => e => {
    setFormData((prev) => ({
      ...prev,
      [input]: e
    }))
  }

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