import axios from "axios";
import { Weather } from '../models/weather.js'

/* --------------- WeatherAPI --------------- */

const findWeather = async (req, res) => {
  try {
    const profile = await profile.findById(req.user.profile)
    const weatherInfo = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${profile.location}`)
    const weatherData = weatherInfo.data

    const generatedWeather = {
      location: {
        name: weatherData.location.name,
        region: weatherData.location.region,
        country: weatherData.location.country,
        lat: weatherData.location.lat,
        lon: weatherData.location.lon,
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
    }

    const userWeather = await Weather.create(generatedWeather)

  } catch (error) {
    res.status(500).json(error)
  }
}

// get
const index = async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'An error occused while retrieving the weather data.' })
  }
}

// show


export { index, }