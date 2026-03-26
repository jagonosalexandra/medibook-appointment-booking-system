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