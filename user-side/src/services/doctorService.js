import axios from "axios";

export const fetchAllDoctors = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/api/doctors');
        if (response.data.success) {
            return response.data.doctors;
        } else {
            console.error(response.message)
        }
    } catch (error) {
        console.error(error)
    }
}