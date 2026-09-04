const PROPERTIES_PER_PAGE = 9;

let activeFilters = { location: null, type: null, mode: null };
let activeSort = null;
let currentPage = 1;
let visibleProperties = [];

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    location: params.get("location"),
    type: params.get("tipo"),
  };
}

function sortByPrice(properties, order) {
  if (!order) return properties;

  return [...properties].sort((a, b) => {
    const priceA = parseFloat(a.valor) || 0;
    const priceB = parseFloat(b.valor) || 0;
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
}

function applyActiveFilters({ keepPage = false } = {}) {
  const filtered = filterProperties(propertyListState.properties, activeFilters);
  visibleProperties = sortByPrice(filtered, activeSort);
  if (!keepPage) currentPage = 1;
  renderCurrentPage();
}

function renderCurrentPage() {
  const totalPages = Math.ceil(visibleProperties.length / PROPERTIES_PER_PAGE);
  currentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

  const start = (currentPage - 1) * PROPERTIES_PER_PAGE;
  renderCards(visibleProperties.slice(start, start + PROPERTIES_PER_PAGE));
  renderPagination(totalPages);
}

function goToPage(page) {
  currentPage = page;
  renderCurrentPage();
  document
    .querySelector(".card-container")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);

  if (from > 2) items.push("...");
  for (let page = from; page <= to; page += 1) items.push(page);
  if (to < total - 1) items.push("...");
  items.push(total);

  return items;
}

function renderPagination(totalPages) {
  const container = document.querySelector(".pagination-container");
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  const buttons = getPageItems(currentPage, totalPages).map((item) => {
    if (item === "...") {
      return '<span class="pagination-ellipsis">…</span>';
    }
    const isActive = item === currentPage;
    return `<button type="button" class="pagination-btn${isActive ? " active" : ""}"
      data-page="${item}"${isActive ? ' aria-current="page"' : ""}>${item}</button>`;
  });

  container.innerHTML = `
    <nav class="pagination" aria-label="Paginación de propiedades">
      <button type="button" class="pagination-btn pagination-nav" data-page="${currentPage - 1}"
        ${currentPage === 1 ? "disabled" : ""} aria-label="Página anterior">‹ Anterior</button>
      ${buttons.join("")}
      <button type="button" class="pagination-btn pagination-nav" data-page="${currentPage + 1}"
        ${currentPage === totalPages ? "disabled" : ""} aria-label="Página siguiente">Siguiente ›</button>
    </nav>
    <p class="pagination-summary">Página ${currentPage} de ${totalPages} — ${visibleProperties.length} propiedades</p>`;
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
  activeSort = null;
  window.history.replaceState(null, "", window.location.pathname);
  applyActiveFilters();
}

function sortProperties(order) {
  activeSort = order;
  applyActiveFilters();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".pagination-btn");
  if (!button || button.disabled) return;

  const page = Number(button.dataset.page);
  if (Number.isInteger(page) && page !== currentPage) goToPage(page);
});

window.sortProperties = sortProperties;
