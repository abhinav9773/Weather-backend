import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors("*"));

app.get("/weather", async (req, res) => {
  const city = req.query.city?.trim();
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key missing in .env" });
  }

  try {
    const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentURL),
      fetch(forecastURL),
    ]);

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    if (current.cod !== 200 || forecast.cod !== "200") {
      return res.status(404).json({ error: "City not found" });
    }

    res.json({ current, forecast });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Weather API is working!");
});

export default app;
