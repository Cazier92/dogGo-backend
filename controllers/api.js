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
        tz_id: weatherData.location.tz_id,
        localtime_epoch: weatherData.location.localtime_epoch,
        localtime: weatherData.location.localtime
      },
      temp_c: weatherData.current.temp_c,
      temp_f: weatherData.current.temp_f,
      condition: weatherData.current.condition.text,
      code: weatherData.current.condition.code
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