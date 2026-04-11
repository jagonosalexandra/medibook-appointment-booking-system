import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addDoctor } from '../services/doctorService'
import DoctorForm from '../components/DoctorForm'

const EMPTY_FORM = {
  name: '', photoUrl: '', department: '', experience: '',
  bio: '', education: '', specialties: [], certifications: [],
  fee: '', address: { street: '', city: '', state: '' },
}

const AddDoctor = () => {
  const navigate = useNavigate()

  const handleAdd = async (formData, image) => {
    if (!formData.name || !formData.department || !formData.department || formData.department === 'Select Department') {
      return toast.error('Please select a department.')
    }
    if (!image) return toast.error("Doctor photo is required.")
    if (!formData.fee || Number(formData.fee) <= 0) {
      return toast.error('Please enter a valid consultation fee.')
    }
    if (!formData.bio) return toast.error('Bio is required.')
    if (!formData.education) return toast.error('Education is required.')

    try {
      const finalData = new FormData()
      Object.keys(formData).forEach(key => {
        if (['address', 'specialties', 'certifications'].includes(key)) {
          finalData.append(key, JSON.stringify(formData[key]))
        } else {
          finalData.append(key, formData[key])
        }
      })
      finalData.append('image', image)

      const response = await addDoctor(finalData)
      if (response.success) {
        toast.success('Doctor added successfully!')
        navigate('/doctors')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add doctor')
    }
  }

  return (
    <DoctorForm
      initialData={EMPTY_FORM}
      onSubmit={handleAdd}
      isAddMode
      onDiscard={() => navigate(-1)}
    />
  )
}

export default AddDoctor