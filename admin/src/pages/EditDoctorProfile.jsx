import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchAllDoctors, updateDoctor } from '../services/doctorService'
import DoctorForm from '../components/DoctorForm'

const EditDoctorProfile = () => {
  const { docId } = useParams()
  const [docInfo, setDocInfo] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const loadDoc = async () => {
      try {
        const doctors = await fetchAllDoctors()
        const found = doctors.find(d => d._id === docId)
        if (found) setDocInfo(found)
      } catch (e) { toast.error('Error loading doctor') }
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
        setIsEditing(false)
        setDocInfo(formData)
      }
    } catch (e) { toast.error('Update failed') }
  }

  if (!docInfo) return <div className="p-10">Loading...</div>

  return (
    <DoctorForm 
      initialData={docInfo} 
      onSubmit={handleUpdate} 
      isAddMode={false} 
      isEditing={isEditing} 
      setIsEditing={setIsEditing} 
      onDiscard={() => setIsEditing(false)}
    />
  )
}

export default EditDoctorProfile