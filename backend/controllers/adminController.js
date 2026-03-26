import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

// API to get dashboard data for admin panel
export const adminDashboard = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]

        const doctors = await doctorModel.find({})
        const appointments = await appointmentModel.find({})

        const [
            doctorCount, 
            totalAppointments, 
            appointmentsToday, 
            appointmentsPending, 
            latestAppointments
        ] = await Promise.all([
            doctorModel.countDocuments({}),
            appointmentModel.countDocuments({}),
            appointmentModel.countDocuments({ date: today }),
            appointmentModel.countDocuments({ status: 'pending '}),
            appointmentModel.find({}).sort({ createdAt: -1 }).limit(10)
        ])

        const dashData = {
            doctors: doctorCount,
            totalAppointments,
            appointmentsToday,
            appointmentsPending,
            latestAppointments
        }
        
        res.json({ success: true, dashData })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}