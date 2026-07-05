# Lebanon Weather & Travel Explorer

## Name

Charbel Chehade

## Project Description

Lebanon Weather & Travel Explorer is a front-end university project for exploring Lebanese travel destinations and checking current weather for Lebanese cities.

The project includes a Home page, searchable Destinations page, Weather page using a public API, and About / Engineering Log page. It uses semantic HTML5, CSS3, Bootstrap 5, Flexbox, vanilla JavaScript, ES6 classes, responsive design, curated local data, and API integration.

## API Used

The project uses the OpenWeather Current Weather API through a Vercel serverless function in `api/weather.js`.

The frontend calls `/api/weather?city=CityName`, and the serverless function reads the private key from the `WEATHER_API_KEY` environment variable. This keeps the weather API key hidden from the browser and safe for GitHub.

In Vercel, add this environment variable before deployment:

- `WEATHER_API_KEY`

For local API testing, use Vercel local development or test after deployment. A basic static server will load the pages, but it will not run the `/api/weather` serverless function.

The weather page displays city name, temperature, condition, humidity, and wind speed.

## Custom Requirement

My custom requirement is a collapsible sidebar menu on smaller screens.

The sidebar is visible on large screens and collapses behind a menu button on smaller screens. It opens and closes smoothly, updates `aria-expanded`, closes when a mobile navigation link is clicked, and supports Escape key closing. It is implemented with an ES6 class in `assets/js/sidebar.js`.

## Curated Local Data

Destination data is stored in `assets/js/data.js` and includes real Lebanese places such as Baalbek, Jeita Grotto, Byblos, Cedars of God, Tyre, Batroun, Beiteddine, Qadisha Valley, Anjar, Raouche, and others.

Each item includes structured fields such as region, city, category, description, best season, visit time, image, tags, coordinates, and featured status.

## Project Evidence Screenshots

Capture real screenshots after final testing and save them in `evidence/`:

- `mobile_screenshots/` 
- `tab_screenshots/` 
- `desktop_screenshots/` 

## AI-Use Appendix

AI tool used: OpenAI ChatGPT.

ChatGPT mainly helped with project planning, requirement review, sidebar improvement ideas, and description of destinations.

Example prompts included:

- "Create the initial project structure only."
- "Write a complete description for the main cities in lebanon at least 20 cities. Using this output format"
 ```json
{
  "id": "baalbek-roman-temples",
  "name": "Baalbek Roman Temples",
  "region": "Baalbek-Hermel",
  "city": "Baalbek",
  "category": "Archaeological Site",
  "shortDescription": "A monumental Roman temple complex in the Bekaa Valley, known for the Temple of Bacchus and massive stone architecture.",
  "bestSeason": "Spring and autumn",
  "estimatedVisitHours": 3,
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Temple_of_Bacchus%2C_Baalbek%2C_Lebanon_%2849890013476%29.jpg/330px-Temple_of_Bacchus%2C_Baalbek%2C_Lebanon_%2849890013476%29.jpg",
  "tags": ["unesco", "roman", "history", "bekaa"],
  "latitude": 34.006336,
  "longitude": 36.207322,
  "featured": true
}
```
- "Add OpenWeather API integration to weather.html using vanilla JavaScript ES6 classes."

What needed correction:

- README placeholder sections needed to be replaced with specific content.
- The top navigation duplicated the sidebar and was removed.
- A weather temperature placeholder had an encoding issue.
- The first city suggestion approach used `datalist`; it was later changed to Trie-based autocomplete.
- API key handling needed review to avoid publishing private credentials.

I reviewed, edited, and adapted the project to match personal preferences and university requirements.
