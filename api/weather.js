const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.status(405).json({ message: "Method not allowed." });
    return;
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    response.status(500).json({ message: "Weather API key is not configured on the server." });
    return;
  }

  const city = String(request.query.city || "").trim();

  if (!city) {
    response.status(400).json({ message: "Please enter or select a Lebanese city." });
    return;
  }

  const params = new URLSearchParams({
    q: `${city},LB`,
    units: "metric",
    appid: apiKey
  });

  let weatherResponse;

  try {
    weatherResponse = await fetch(`${OPENWEATHER_URL}?${params.toString()}`);
  } catch (error) {
    response.status(502).json({ message: "Could not reach OpenWeather. Please try again." });
    return;
  }

  let data;

  try {
    data = await weatherResponse.json();
  } catch (error) {
    response.status(502).json({ message: "OpenWeather returned an unexpected response." });
    return;
  }

  if (!weatherResponse.ok) {
    if (weatherResponse.status === 404) {
      response.status(404).json({ message: "City not found in Lebanon. Try Beirut, Tripoli, Sidon, Tyre, Zahle, or Baalbek." });
      return;
    }

    if (weatherResponse.status === 401) {
      response.status(401).json({ message: "OpenWeather rejected the API key configured on the server." });
      return;
    }

    response.status(weatherResponse.status).json({ message: data.message || "Weather data could not be loaded right now." });
    return;
  }

  response.status(200).json(data);
};
