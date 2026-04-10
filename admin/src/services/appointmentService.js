import api from "./api";

export const fetchAppointments = async () => {
    try {
        const response = await api.get('/api/admin/appointments');
        return response.data.appointments
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchAppointmentById = async (appId) => {
    try {
        const response = await api.get(`/api/admin/appointment/${appId}`)
        return response.data.appointment
    } catch (error) {
        console.error('Error fetching appointment: ', error)
        throw error
    }
}

export const updateAppointment = async (appId, updateData) => {
    try {
        const response = await api.put(`/api/admin/update-appointment/${appId}`, updateData)
        return response.data
    } catch (error) {
        console.error("Error, updating appointment: ", error)
        throw error
    }
}