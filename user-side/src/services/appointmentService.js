import api from './api'

export const createAppointment = async (formData) => {
  try {
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      docId: formData.docId,
      doctor: formData.doctor,
      department: formData.department,
      date: formData.date,
      time: formData.time,
      appointmentType: formData.appointment_type,
      fee: formData.fee,
      reasonForVisit: formData.visit_reason || '',
    }

    const response = await api.post('/api/appointments/create-appointment', payload)
    return response.data  
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to create appointment'
    throw new Error(message)
  }
}