let activeFilters = { location: null, type: null, mode: null };

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    location: params.get("location"),
    type: params.get("tipo"),
  };
}

function applyActiveFilters() {
  const filtered = filterProperties(propertyListState.properties, activeFilters);
  renderCards(filtered);
}

function filterByZone(selectedZone) {
  activeFilters.location = selectedZone;
  applyActiveFilters();
}

function filterByType(selectedType) {
  activeFilters.type = selectedType;
  applyActiveFilters();
}

function filterByMode(selectedMode) {
  activeFilters.mode = selectedMode;
  applyActiveFilters();
}

function resetFilters() {
  activeFilters = { location: null, type: null, mode: null };
  window.history.replaceState(null, "", window.location.pathname);
  renderCards(propertyListState.properties);
}

function sortProperties(order) {
  const container = document.querySelector(".card-container");
  const cards = Array.from(container.children);

  cards.sort((a, b) => {
    const priceA = parseFloat(a.dataset.price) || 0;
    const priceB = parseFloat(b.dataset.price) || 0;
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });

  container.innerHTML = "";
  cards.forEach((card) => container.appendChild(card));
}

window.sortProperties = sortProperties;