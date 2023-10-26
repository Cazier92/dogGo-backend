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
  rain: {
    isRaining: Boolean,
    intensity: Number // You can use a scale to represent the intensity of rain
  },
  airQuality: {
    index: Number, // You can use a scale to represent the air quality index
    description: String
  },
  extremeHeat: {
    isExtremeHeat: Boolean,
    temperature: Number // You can set a threshold to determine extreme heat
  },
  snow: {
    isSnowing: Boolean,
    intensity: Number // You can use a scale to represent the intensity of snowfall
  },
  thunderstorms: {
    isThunderstorm: Boolean,
    description: String
  }
});

const Weather = mongoose.model('Weather', WeatherSchema);

export { Weather }