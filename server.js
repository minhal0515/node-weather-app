require('dotenv').config();
require('dotenv').config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.API_KEY;
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  let weather = null;
  let error = null;
  try {
    const response = await axios.get(APIUrl);
    weather = response.data;
  } catch (err) {  // Changed from 'error' to 'err' to avoid shadowing
    error = "City not found. Please try again.";
    if (err.response && err.response.status === 404) {
      error = "City not found. Please try a valid city name.";
    } else if (err.response) {
      error = `API Error: ${err.response.status} - ${err.response.statusText}`;
    } else {
      error = "Network or server error. Please try again later.";
    }
  }
  res.render("index", { weather, error });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
