import api from "./api";

export const fetchAppointments = async () => {
    try {
        const response = await api.get('/api/admin/appointments');
        return response.data.appointments
    } catch (error) {
        console.error(error)
    }
}