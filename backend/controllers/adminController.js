import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

// API to get dashboard data for admin panel
export const adminDashboard = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const [
            doctorCount, 
            totalAppointments, 
            appointmentsToday, 
            appointmentsPending, 
            latestAppointments
        ] = await Promise.all([
            doctorModel.countDocuments({}),
            appointmentModel.countDocuments({}),
            appointmentModel.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
            appointmentModel.countDocuments({ status: 'pending'}),
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