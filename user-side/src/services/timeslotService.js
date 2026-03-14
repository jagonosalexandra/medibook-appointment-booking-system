import axios from "axios";

export const fetchSlots = async (docId, date) => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/api/timeslots', {
            params: {docId, date}
        })
        if (response.data.success) {
            return response.data.slots
        } else {
            console.error(response.message)
        }
    } catch (error) {
        console.error(error)
    }
}