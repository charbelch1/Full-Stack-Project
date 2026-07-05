const OPENWEATHER_CONFIG = {
  API_URL: "/api/weather"
};

const LEBANESE_WEATHER_CITIES = [
  "Aley",
  "Anjar",
  "Baalbek",
  "Batroun",
  "Beirut",
  "Beit Mery",
  "Bint Jbeil",
  "Bsharri",
  "Byblos",
  "Chouf",
  "Deir el Qamar",
  "Ehden",
  "Faraya",
  "Halba",
  "Harissa",
  "Hasbaya",
  "Hermel",
  "Jeita",
  "Jounieh",
  "Kfardebian",
  "Marjayoun",
  "Nabatieh",
  "Sidon",
  "Tripoli",
  "Tyre",
  "Zahle",
  "Zgharta"
];

class TrieNode {
  constructor() {
    this.children = new Map();
    this.value = null;
  }
}

class CityTrie {
  constructor(cities) {
    this.root = new TrieNode();
    cities.forEach((city) => this.insert(city));
  }

  insert(city) {
    let currentNode = this.root;

    this.normalize(city).split("").forEach((character) => {
      if (!currentNode.children.has(character)) {
        currentNode.children.set(character, new TrieNode());
      }

      currentNode = currentNode.children.get(character);
    });

    currentNode.value = city;
  }

  suggest(prefix, limit = 6) {
    const normalizedPrefix = this.normalize(prefix);

    if (!normalizedPrefix) {
      return [];
    }

    let currentNode = this.root;

    for (const character of normalizedPrefix) {
      if (!currentNode.children.has(character)) {
        return [];
      }

      currentNode = currentNode.children.get(character);
    }

    const suggestions = [];
    this.collect(currentNode, suggestions, limit);
    return suggestions;
  }

  collect(node, suggestions, limit) {
    if (suggestions.length >= limit) {
      return;
    }

    if (node.value) {
      suggestions.push(node.value);
    }

    for (const childNode of node.children.values()) {
      this.collect(childNode, suggestions, limit);

      if (suggestions.length >= limit) {
        return;
      }
    }
  }

  normalize(value) {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
}

class WeatherCityAutocomplete {
  constructor(input, suggestionsList, cities) {
    this.input = input;
    this.suggestionsList = suggestionsList;
    this.cityTrie = new CityTrie(cities);
    this.suggestions = [];
    this.activeIndex = -1;

    this.init();
  }

  init() {
    if (!this.input || !this.suggestionsList) {
      return;
    }

    this.input.addEventListener("input", () => this.handleInput());
    this.input.addEventListener("keydown", (event) => this.handleKeydown(event));
    this.input.addEventListener("blur", () => {
      window.setTimeout(() => this.close(), 150);
    });
  }

  handleInput() {
    this.suggestions = this.cityTrie.suggest(this.input.value);
    this.activeIndex = -1;
    this.render();
  }

  handleKeydown(event) {
    if (this.suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.suggestions.length;
      this.render();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.suggestions.length) % this.suggestions.length;
      this.render();
    }

    if (event.key === "Enter" && this.activeIndex >= 0) {
      event.preventDefault();
      this.selectCity(this.suggestions[this.activeIndex]);
    }

    if (event.key === "Escape") {
      this.close();
    }
  }

  render() {
    if (this.suggestions.length === 0) {
      this.close();
      return;
    }

    this.suggestionsList.innerHTML = this.suggestions
      .map((city, index) => `
        <li role="option" aria-selected="${index === this.activeIndex}">
          <button class="weather-suggestion${index === this.activeIndex ? " is-active" : ""}" type="button" data-city="${city}">
            ${city}
          </button>
        </li>
      `)
      .join("");

    this.suggestionsList.querySelectorAll(".weather-suggestion").forEach((button) => {
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
        this.selectCity(button.dataset.city);
      });
    });

    this.suggestionsList.hidden = false;
    this.input.setAttribute("aria-expanded", "true");
  }

  selectCity(city) {
    this.input.value = city;
    this.close();
    this.input.focus();
  }

  close() {
    this.suggestionsList.innerHTML = "";
    this.suggestionsList.hidden = true;
    this.input.setAttribute("aria-expanded", "false");
    this.activeIndex = -1;
  }
}

class WeatherService {
  constructor(config) {
    this.apiUrl = config.API_URL;
  }

  async getCurrentWeather(city) {
    const params = new URLSearchParams({
      city
    });

    let response;

    try {
      response = await fetch(`${this.apiUrl}?${params.toString()}`);
    } catch (error) {
      throw new Error("Network error. Check your internet connection and try again.");
    }

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Weather data was received in an unexpected format.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Weather data could not be loaded right now. Please try again.");
    }

    return data;
  }
}

class WeatherPage {
  constructor(weatherService) {
    this.weatherService = weatherService;
    this.form = document.querySelector("#weatherForm");
    this.cityInput = document.querySelector("#weatherCity");
    this.citySuggestions = document.querySelector("#weatherCitySuggestions");
    this.submitButton = document.querySelector("#weatherSubmit");
    this.loadingState = document.querySelector("#weatherLoading");
    this.helpState = document.querySelector("#weatherHelpState");
    this.errorState = document.querySelector("#weatherError");
    this.errorMessage = document.querySelector("#weatherErrorMessage");
    this.resultCard = document.querySelector("#weatherResult");
    this.cityName = document.querySelector("#weatherCityName");
    this.condition = document.querySelector("#weatherCondition");
    this.temperature = document.querySelector("#weatherTemperature");
    this.humidity = document.querySelector("#weatherHumidity");
    this.windSpeed = document.querySelector("#weatherWind");

    this.init();
  }

  init() {
    if (!this.hasRequiredElements()) {
      return;
    }

    this.form.addEventListener("submit", (event) => this.handleSubmit(event));
    new WeatherCityAutocomplete(this.cityInput, this.citySuggestions, LEBANESE_WEATHER_CITIES);
    this.showHelpState();
  }

  hasRequiredElements() {
    return Boolean(
      this.form &&
      this.cityInput &&
      this.citySuggestions &&
      this.submitButton &&
      this.loadingState &&
      this.helpState &&
      this.errorState &&
      this.errorMessage &&
      this.resultCard &&
      this.cityName &&
      this.condition &&
      this.temperature &&
      this.humidity &&
      this.windSpeed
    );
  }

  async handleSubmit(event) {
    event.preventDefault();

    const city = this.cityInput.value.trim();

    if (!city) {
      this.showError("Please enter or select a Lebanese city.");
      this.cityInput.focus();
      return;
    }

    this.showLoadingState();

    try {
      const weatherData = await this.weatherService.getCurrentWeather(city);
      this.showWeatherResult(weatherData);
    } catch (error) {
      this.showError(error.message || "Weather data could not be loaded right now. Please try again.");
    }
  }

  showHelpState() {
    this.helpState.hidden = false;
    this.loadingState.hidden = true;
    this.errorState.hidden = true;
    this.resultCard.hidden = true;
    this.setButtonLoading(false);
  }

  showLoadingState() {
    this.helpState.hidden = true;
    this.loadingState.hidden = false;
    this.errorState.hidden = true;
    this.resultCard.hidden = true;
    this.setButtonLoading(true);
  }

  showError(message) {
    this.helpState.hidden = true;
    this.loadingState.hidden = true;
    this.errorState.hidden = false;
    this.resultCard.hidden = true;
    this.errorMessage.textContent = message;
    this.setButtonLoading(false);
  }

  showWeatherResult(data) {
    if (!this.isValidWeatherData(data)) {
      this.showError("Weather data was incomplete. Please try another Lebanese city.");
      return;
    }

    const weather = data.weather?.[0];

    this.cityName.textContent = data.name;
    this.condition.textContent = weather ? this.toTitleCase(weather.description) : "Current conditions";
    this.temperature.textContent = `${Math.round(data.main.temp)}\u00B0C`;
    this.humidity.textContent = `${data.main.humidity}%`;
    this.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;

    this.helpState.hidden = true;
    this.loadingState.hidden = true;
    this.errorState.hidden = true;
    this.resultCard.hidden = false;
    this.setButtonLoading(false);
  }

  isValidWeatherData(data) {
    return Boolean(
      data &&
      data.name &&
      data.main &&
      Number.isFinite(data.main.temp) &&
      Number.isFinite(data.main.humidity) &&
      data.wind &&
      Number.isFinite(data.wind.speed)
    );
  }

  setButtonLoading(isLoading) {
    this.submitButton.disabled = isLoading;
    this.submitButton.textContent = isLoading ? "Loading..." : "Check weather";
  }

  toTitleCase(value) {
    return value.replace(/\w\S*/g, (word) => (
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#weatherForm")) {
    const weatherService = new WeatherService(OPENWEATHER_CONFIG);
    new WeatherPage(weatherService);
  }
});
