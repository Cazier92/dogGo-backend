import mongoose from 'mongoose'

const WeatherSchema = new mongoose.Schema({
  location: {
    name: String,
    region: String,
    country: String,
    lat: Number,
    lon: Number,
    tz_id: String,
    localtime_epoch: Number,
    localtime: String
  },
  temp_c: Number,
  temp_f: Number,
  condition: String,
  code: Number
});

const Weather = mongoose.model('Weather', WeatherSchema);

export { Weather }