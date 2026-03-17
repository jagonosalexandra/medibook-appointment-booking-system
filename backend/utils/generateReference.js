import dailyCounterModel from "../models/dailyCounterModel.js"

export const generateReference = async (timezone = 'Asia/Manila') => {
  const dateString = new Date().toLocaleDateString('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/-/g, '')

  const counter = await dailyCounterModel.findOneAndUpdate(
    { date: dateString },
    { $inc: { counter: 1 } },
    { upsert: true, new: true } 
  )

  const sequence = String(counter.counter).padStart(3, '0')
  return `CF-${dateString}-${sequence}`
}