import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchDoctorById, updateDoctor } from '../services/doctorService'
import DoctorForm from '../components/DoctorForm'
import LoadingSpinner from '../components/LoadingSpinner'

const EditDoctorProfile = () => {
  const { docId } = useParams()
  const [docInfo, setDocInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDoc = async () => {
      try {
        const doctor = await fetchDoctorById(docId)
        setDocInfo(doctor)
      } catch (error) {
        setError('Failed to load doctor profile')
        toast.error('Error loading doctor profile')
      } finally {
        setLoading(false)
      }
    }
    loadDoc()
  }, [docId])

  const handleUpdate = async (formData, image) => {
    try {
      const finalData = new FormData()
      Object.keys(formData).forEach(key => {
        if (['address', 'specialties', 'certifications'].includes(key)) {
          finalData.append(key, JSON.stringify(formData[key]))
        } else if (key !== 'photoUrl') {
          finalData.append(key, formData[key])
        }
      })
      if (image) finalData.append('image', image)

      const response = await updateDoctor(docId, finalData)
      if (response.success) {
        toast.success('Profile updated!')
        const refreshed = await fetchDoctorById(docId)
        setDocInfo(refreshed)
      }
    } catch (error) {
      toast.error(error.message || 'Update failed')
    }
  }

  if (loading) return <LoadingSpinner message='Loading doctor profile...' />
  if (error) return <p className="text-center text-red mt-12">{error}</p>
  if (!docInfo) return null

  return (
    <DoctorForm
      initialData={docInfo}
      onSubmit={handleUpdate}
      onDiscard={() => window.history.back()}
    />
  )
}

export default EditDoctorProfile