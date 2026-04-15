import api from "./api";

export const fetchAllDoctors = async () => {
    try {
        const response = await api.get('/api/doctors');
        if (response.data.success) {
            return response.data.doctors;
        } else {
            console.error(response.message)
        }
    } catch (error) {
        console.error(error)
    }
}

export const fetchDoctorById = async (docId) => {
    try {
        const response = await api.get(`/api/doctors/${docId}`)
        if (response.data.success) {
            return response.data.doctor
        } else {
            throw new Error(response.data.message || "Failed to fetch doctor")
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Server error"
        throw new Error(message)
    }
}