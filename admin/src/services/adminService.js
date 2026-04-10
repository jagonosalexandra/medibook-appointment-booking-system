import api from './api'

const getDashData = async () => {
    try {
        const { data } = await api.get('/api/admin/dashboard')
        return data.dashData
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

const toggleDoctorActive = async (docId) => {
    try {
        const { data } = await api.post('/api/admin/toggle-doctor', { docId })
        return data
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

const addDoctorSlots = async (slotData) => {
    try {
        const { data } = await api.post('/api/admin/add-slots', slotData)
        return data
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

const getDoctorSlots = async (docId) => {
    try {
        const { data } = await api.get(`/api/admin/get-slots/${docId}`)
        return data.slots
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

const toggleSlot = async (slotId) => {
    try {
        const { data } = await api.post('/api/admin/toggle-slot', { slotId })
        return data
    } catch (error) {
        console.error(error.message)
        throw error
    }
} 

export {
    getDashData,
    toggleDoctorActive,
    addDoctorSlots,
    getDoctorSlots,
    toggleSlot
}