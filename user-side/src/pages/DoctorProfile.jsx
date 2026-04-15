import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

  const [docInfo, setDocInfo] = useState(null)
  const [relDoctors, setRelDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDocProfile = async () => {
      try {
        const doctor = await fetchDoctorById(docId)
        setDocInfo(doctor)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    loadDocProfile()
  }, [docId])

  useEffect(() => {
    const loadRelDocs = async () => {
      if (!docInfo) return

      try {
        const doctors = await fetchAllDoctors()
        const relDocs = doctors.filter((doc) => doc.department === docInfo.department && doc._id !== docId)
        setRelDoctors(relDocs)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    loadRelDocs()
  }, [docId, docInfo])

  if (loading) return <LoadingSpinner message="Loading doctor profile..." />
  if (error) return <p className="text-red">{error}</p>

  return (
    <div>
      <div className='flex items-start gap-[6em] bg-secondary p-12'>
        <img className='w-1/3 max-h-[40em] rounded-full border-2 border-border shadow-xl' src={docInfo.photoUrl} alt={docInfo.name} />
        <div className='flex flex-col gap-8 pt-8'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-4xl font-black'>{docInfo.name}</p>
              <p className='text-primary font-bold'>{docInfo.department}</p>
              <p className='flex gap-0.5 items-center text-primary-dark/60 text-sm'>
                <img className='w-4 opacity-60' src={location} alt='' />
                {docInfo.address.street}, {docInfo.address.city} {docInfo.address.state}
              </p>
            </div>
            <Button label='Book appointment' variant='secondary' />
          </div>

          <div className='w-[90%]'>
            <p className='font-bold mb-2.5'>About</p>
            <p className='text-gray-600 whitespace-break-spaces'>{docInfo.bio}</p>
          </div>

          <div className='w-[80%]'>
            <p className='font-bold mb-2.5'>Education and Certifications</p>
            <div className='flex items-center gap-2.5 pb-4'>
              <img className='w-10 h-10 p-1 rounded-lg bg-primary/20' src={education} alt='' />
              <p className='flex flex-col font-bold'>
                Medical School
                <span className='text-gray-600 font-normal'>
                  {docInfo.education}
                </span>
              </p>
            </div>
            <div className='flex items-center gap-2.5'>
              <img className='w-10 h-10 p-1 rounded-lg bg-primary/20' src={award} alt='' />
              <p className='flex flex-col font-bold'>
                Certification
                <ol className='text-sm text-gray-600 font-normal'>
                  {docInfo.certifications.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </p>
            </div>
          </div>

          <div className='w-[80%]'>
            <p className='font-bold mb-2.5'>Specialties and Expertise</p>
            <ol className='grid grid-cols-2 gap-4'>
              {docInfo.specialties.map((item, index) => (
                <li key={index} className='flex items-center gap-1.5 p-2.5 bg-primary/10 rounded-lg font-semibold text-gray-700'>
                  <img className='w-6 h-6 p-0.5 border-2 border-primary-dark rounded-full' src={check} alt='' />
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {relDoctors.length > 0 && (
        <div className='px-12 py-16'>
          <p className='text-3xl font-bold text-center'>Related Doctors</p>
          <div className='grid grid-cols-4 gap-8 py-16'>
            {relDoctors.map(doc => (
              <DoctorCard
                key={doc._id}
                id={doc._id}
                name={doc.name}
                photoUrl={doc.photoUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorProfile