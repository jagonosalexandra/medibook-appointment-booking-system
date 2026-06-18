// DoctorProfile.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import { fetchAllDoctors, fetchDoctorById } from '../services/doctorService'
import location from '../assets/icons/location.svg'
import award from '../assets/icons/award.svg'
import education from '../assets/icons/education.svg'
import check from '../assets/icons/check-dark.svg'
import DoctorCard from '../components/DoctorCard'

const DoctorProfile = () => {
  const { docId } = useParams()
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [relDoctors, setRelDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDocProfile = async () => {
      try {
        const doctor = await fetchDoctorById(docId)
        setDocInfo(doctor)
      } catch (error) {
        setError(error.message || 'Failed to load doctor profile')
      } finally {
        setLoading(false)
      }
    }
    loadDocProfile()
  }, [docId])

  useEffect(() => {
    if (!docInfo) return
    fetchAllDoctors()
      .then(doctors => {
        setRelDoctors(
          doctors.filter(doc => doc.department === docInfo.department && doc._id !== docId)
        )
      })
      .catch(() => { }) 
  }, [docId, docInfo])

  if (loading) return <LoadingSpinner message='Loading doctor profile...' />
  if (error) return <p className='text-center text-red-500 mt-12'>{error}</p>
  if (!docInfo) return null

  return (
    <div>
      <div className='bg-secondary px-6 lg:px-24 py-10 lg:py-16'>
        <div className='flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16'>

          <img
            className='w-54 h-54 lg:w-64 lg:h-64 xl:w-80 xl:h-80 object-cover object-top rounded-full border-2 border-border shadow-xl shrink-0'
            src={docInfo.photoUrl}
            alt={docInfo.name}
          />

          <div className='flex flex-col gap-8 w-full'>
            <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
              <div>
                <p className='text-3xl lg:text-4xl font-black'>{docInfo.name}</p>
                <p className='text-primary font-bold mt-0.5'>{docInfo.department}</p>
                <p className='flex gap-1 items-center text-primary-dark/60 text-sm mt-1'>
                  <img className='w-4 opacity-60' src={location} alt='' />
                  {docInfo.address.street}, {docInfo.address.city} {docInfo.address.state}
                </p>
              </div>
              <Button
                label='Book Appointment'
                variant='primary'
                onClick={() => navigate(`/booking?doctor=${docId}`)}
              />
            </div>

            <div>
              <p className='font-bold mb-2'>About</p>
              <p className='text-gray-600 leading-relaxed'>{docInfo.bio}</p>
            </div>

            <div>
              <p className='font-bold mb-3'>Education and Certifications</p>
              <div className='flex flex-col gap-4'>
                <div className='flex items-start gap-2.5'>
                  <img className='w-10 h-10 p-1 rounded-lg bg-primary/20 shrink-0' src={education} alt='' />
                  <div>
                    <p className='font-bold text-sm'>Medical School</p>
                    <p className='text-gray-600 text-sm'>{docInfo.education}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2.5'>
                  <img className='w-10 h-10 p-1 rounded-lg bg-primary/20 shrink-0' src={award} alt='' />
                  <div>
                    <p className='font-bold text-sm'>Certifications</p>
                    <ul className='text-sm text-gray-600 space-y-0.5 mt-0.5'>
                      {docInfo.certifications.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className='font-bold mb-3'>Specialties and Expertise</p>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {docInfo.specialties.map((item, index) => (
                  <li
                    key={index}
                    className='flex items-center gap-2 p-2.5 bg-primary/10 rounded-lg font-semibold text-gray-700 text-sm'
                  >
                    <img className='w-5 h-5 p-0.5 border-2 border-primary-dark rounded-full shrink-0' src={check} alt='' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED DOCTORS */}
      {relDoctors.length > 0 && (
        <div className='px-6 lg:px-24 py-12 lg:py-16'>
          <p className='text-2xl lg:text-3xl font-bold text-center mb-10'>
            More in {docInfo.department}
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {relDoctors.map(doc => (
              <DoctorCard
                key={doc._id}
                id={doc._id}
                name={doc.name}
                photoUrl={doc.photoUrl}
                department={doc.department}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorProfile