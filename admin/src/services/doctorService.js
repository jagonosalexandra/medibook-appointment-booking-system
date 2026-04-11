import api from "./api";

export const fetchAllDoctors = async () => {
    try {
        const response = await api.get('/api/admin/doctors');
        if (response.data.success) {
            return response.data.doctors;
        } else {
            console.error(response.data.message)
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchDoctorById = async (docId) => {
    try {
        const response = await api.get(`/api/admin/doctor/${docId}`)
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

export const addDoctor = async (doctorData) => {
    try {
        const response = await api.post('/api/admin/add-doctor', doctorData)
        if (response.data.success) {
            return response.data
        } else {
            throw new Error(response.data.message || 'Failed to add doctor')
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Server error while updating doctor";
        throw new Error(message)
    }
}

export const updateDoctor = async (docId, updatedData) => {
    try {
        const response = await api.put(`/api/admin/update-doctor/${docId}`, updatedData);

        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to update doctor profile");
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Server error while updating doctor";
        throw new Error(message)
    }
}