import { destinations } from "./data.js";

export class FeaturedDestinations {
  constructor(destinationList, containerSelector) {
    this.destinations = Array.isArray(destinationList) ? destinationList : [];
    this.container = document.querySelector(containerSelector);
  }

  init() {
    if (!this.container) {
      return;
    }

    const featuredDestinations = this.destinations
      .filter((destination) => destination.featured)
      .slice(0, 4);

    if (featuredDestinations.length === 0) {
      this.container.innerHTML = '<p class="text-muted mb-0">Featured destinations are not available yet.</p>';
      return;
    }

    this.container.innerHTML = featuredDestinations
      .map((destination) => this.createCard(destination))
      .join("");
  }

  createCard(destination) {
    return `
      <article class="card home-featured-card h-100">
        <img src="${destination.image}" class="card-img-top home-featured-image" alt="${destination.name}">
        <div class="card-body">
          <p class="home-featured-category">${destination.category}</p>
          <h3 class="h5 card-title">${destination.name}</h3>
          <p class="home-featured-location">${destination.city}, ${destination.region}</p>
          <p class="card-text">${destination.shortDescription}</p>
        </div>
      </article>
    `;
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const featuredDestinations = new FeaturedDestinations(destinations, "#homeFeaturedDestinations");
    featuredDestinations.init();
  });
}
