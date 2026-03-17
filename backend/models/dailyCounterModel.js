import mongoose from 'mongoose'

const dailyCounterSchema = new mongoose.Schema({
  date:    { type: String, required: true, unique: true },
  counter: { type: Number, default: 0 }
})

const dailyCounterModel = mongoose.models.dailyCounter || mongoose.model('dailyCounter', dailyCounterSchema)

export default dailyCounterModel