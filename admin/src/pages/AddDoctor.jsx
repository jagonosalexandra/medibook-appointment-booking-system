import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addDoctor } from '../services/doctorService'
import DoctorForm from '../components/DoctorForm'

const AddDoctor = () => {
  const navigate = useNavigate()
  const emptyForm = {
    name: '', photoUrl: '', department: '', experience: '',
    bio: '', education: '', specialties: [], certifications: [],
    fee: '', address: { line1: '', city: '', state: '' },
  }

  const handleAdd = async (formData, image) => {
    if (!formData.name || !formData.department || !image) {
      return toast.error('Name, Department, and Photo are required.')
    }
    try {
      const finalData = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'address' || key === 'specialties' || key === 'certifications') {
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

  return <DoctorForm initialData={emptyForm} onSubmit={handleAdd} isAddMode={true} onDiscard={() => navigate(-1)} />
}

export default AddDoctor