import { destinations } from "./data.js";

export class DestinationExplorer {
  constructor(destinationList) {
    this.destinations = Array.isArray(destinationList) ? destinationList : [];
    this.searchInput = document.querySelector("#destinationSearch");
    this.categoryFilter = document.querySelector("#categoryFilter");
    this.regionFilter = document.querySelector("#regionFilter");
    this.resetButton = document.querySelector("#resetDestinationFilters");
    this.resultCount = document.querySelector("#destinationResultCount");
    this.grid = document.querySelector("#destinationGrid");
    this.emptyState = document.querySelector("#destinationEmptyState");

    this.init();
  }

  init() {
    if (!this.hasRequiredElements()) {
      return;
    }

    this.populateFilter(this.categoryFilter, this.getUniqueValues("category"));
    this.populateFilter(this.regionFilter, this.getUniqueValues("region"));
    this.bindEvents();
    this.render();
  }

  hasRequiredElements() {
    return Boolean(
      this.searchInput &&
      this.categoryFilter &&
      this.regionFilter &&
      this.resetButton &&
      this.resultCount &&
      this.grid &&
      this.emptyState
    );
  }

  bindEvents() {
    this.searchInput.addEventListener("input", () => this.render());
    this.categoryFilter.addEventListener("change", () => this.render());
    this.regionFilter.addEventListener("change", () => this.render());
    this.resetButton.addEventListener("click", () => this.resetFilters());
  }

  getUniqueValues(key) {
    return [...new Set(this.destinations.map((destination) => destination[key]).filter(Boolean))].sort();
  }

  populateFilter(selectElement, values) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      selectElement.appendChild(option);
    });
  }

  getFilteredDestinations() {
    const searchTerm = this.searchInput.value.trim().toLowerCase();
    const selectedCategory = this.categoryFilter.value;
    const selectedRegion = this.regionFilter.value;

    return this.destinations.filter((destination) => {
      const searchableText = [
        destination.name,
        destination.region,
        destination.city,
        destination.category,
        destination.shortDescription,
        destination.bestSeason,
        ...this.getTags(destination)
      ].join(" ").toLowerCase();

      const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
      const matchesCategory = !selectedCategory || destination.category === selectedCategory;
      const matchesRegion = !selectedRegion || destination.region === selectedRegion;

      return matchesSearch && matchesCategory && matchesRegion;
    });
  }

  render() {
    const filteredDestinations = this.getFilteredDestinations();

    this.updateResultCount(filteredDestinations.length);
    this.grid.innerHTML = filteredDestinations.map((destination) => this.createCard(destination)).join("");
    this.emptyState.hidden = filteredDestinations.length > 0;
  }

  updateResultCount(count) {
    const label = count === 1 ? "destination" : "destinations";
    this.resultCount.textContent = `${count} ${label} found`;
  }

  createCard(destination) {
    const tags = this.getTags(destination)
      .map((tag) => `<span class="destination-tag">${this.formatTag(tag)}</span>`)
      .join("");

    const featuredBadge = destination.featured
      ? '<span class="badge text-bg-success">Featured</span>'
      : "";

    return `
      <article class="card destination-card h-100">
        <img src="${destination.image}" class="card-img-top destination-card-image" alt="${destination.name}">
        <div class="card-body">
          <div class="destination-card-header">
            <span class="destination-category">${destination.category}</span>
            ${featuredBadge}
          </div>
          <h2 class="h5 card-title">${destination.name}</h2>
          <p class="destination-location">${destination.city}, ${destination.region}</p>
          <p class="card-text">${destination.shortDescription}</p>
          <div class="destination-meta">
            <span>${destination.bestSeason}</span>
            <span>${destination.estimatedVisitHours} hrs</span>
          </div>
          <div class="destination-tags" aria-label="Destination tags">
            ${tags}
          </div>
        </div>
      </article>
    `;
  }

  formatTag(tag) {
    return String(tag)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  getTags(destination) {
    return Array.isArray(destination.tags) ? destination.tags : [];
  }

  resetFilters() {
    this.searchInput.value = "";
    this.categoryFilter.value = "";
    this.regionFilter.value = "";
    this.render();
    this.searchInput.focus();
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#destinationGrid")) {
      new DestinationExplorer(destinations);
    }
  });
}
