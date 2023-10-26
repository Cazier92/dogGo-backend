import axios from "axios";
import { Weather } from '../models/weather.js'

/* --------------- WeatherAPI --------------- */

const findWeather = async (req, res) => {
  try {
    const weatherData = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=`)
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