import { Weather } from '../models/weather.js'
import { v2 as cloudinary } from 'cloudinary'

/* ------------------ WEATHER ------------------ */
//* Get/Indexing Functions

async function index (req, res) {
  try {
    const weather = await Weather.find({})
    res.json(weather)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export {
  index
}