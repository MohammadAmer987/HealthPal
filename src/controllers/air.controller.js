import axios from "axios";
import { getLocationByName } from "../models/Location.js";

export const getAirPollution = async (req, res) => {
  try {
    const city = req.params.city;

    // 1) جلب اللوكيشن من الداتابيس
    const location = await getLocationByName(city);
    if (!location)
      return res.status(404).json({ message: "City not found" });

    const { lat, lon } = location;

    // 2) استدعاء API الخارجي
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data.list[0];

    // AQI meaning guide
    const AQI_TEXT = {
      1: "Good — الهواء ممتاز",
      2: "Fair — مقبول",
      3: "Moderate — متوسط وقد يضر الحساسين",
      4: "Poor — سيء، تجنب المجهود",
      5: "Very Poor — خطير على الجميع"
    };

    res.json({
      city: location.name,
      coordinates: { lat, lon },

      aqi: data.main.aqi,
      aqi_text: AQI_TEXT[data.main.aqi],

      pollutants: {
        pm25: data.components.pm2_5,
        pm10: data.components.pm10,
        co: data.components.co,
        no2: data.components.no2,
        o3: data.components.o3,
        so2: data.components.so2,
      },

      recommendation:
        data.main.aqi <= 2
          ? "الوضع آمن"
          : data.main.aqi === 3
          ? "الأطفال وكبار السن يجب أن يقللوا النشاط الخارجي"
          : "الخروج غير آمن — ارتدِ كمامة وتجنب المجهود!"
    });

  } catch (err) {
    console.error("Air Pollution Error:", err);
    res.status(500).json({ message: "Failed to fetch air pollution data" });
  }
};
