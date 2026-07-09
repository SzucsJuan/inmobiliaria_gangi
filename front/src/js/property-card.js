let propertyListState = { properties: [], zones: [], types: [], operations: [] };

async function fetchData() {
  const container = document.querySelector(".card-container");
  container.innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
  try {
    const { props, zones, types, operations } = await fetchListingData();

    propertyListState = {
      properties: props.records || [],
      zones: zones.records || [],
      types: types.records || [],
      operations: operations.records || [],
    };

    const { location, type } = getQueryParams();
    activeFilters.location = location;
    activeFilters.type = type;
    applyActiveFilters();
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    container.innerHTML =
      "<p>No se pudieron cargar las propiedades. Intentá de nuevo más tarde.</p>";
  }
}

function filterProperties(properties, { location, type, mode } = {}) {
  return properties.filter((property) => {
    const zoneName =
      propertyListState.zones.find((z) => z.id === property.zona)?.nombre
        ?.toLowerCase()
        .trim() || "";
    const typeName =
      propertyListState.types.find((t) => t.id === property.tipo)?.nombre
        ?.toLowerCase()
        .trim() || "";
    const modeName =
      propertyListState.operations.find((o) => o.id === property.operacion)
        ?.nombre?.toLowerCase()
        .trim() || "";

    const matchesLocation = location
      ? zoneName === location.toLowerCase().trim()
      : true;
    const matchesType = type ? typeName === type.toLowerCase().trim() : true;
    const matchesMode = mode ? modeName === mode.toLowerCase().trim() : true;

    return matchesLocation && matchesType && matchesMode;
  });
}

function renderCards(properties) {
  const container = document.querySelector(".card-container");

  if (!properties.length) {
    container.innerHTML = "<p>No se encontraron propiedades.</p>";
    return;
  }

  container.innerHTML = properties
    .map((property) => {
      const imageUrl = property.imagenes?.length
        ? property.imagenes[0]
        : "/assets/icons/logo2.png";

      const {
        nro: propertyId,
        valor: price,
        moneda,
        calle: location,
        ambientes: rooms,
        dormitorios: bedrooms,
        sup_total: surface,
        descripcion: description,
        tipo,
        zona,
        operacion,
      } = property;

      const zoneName =
        propertyListState.zones.find((z) => z.id === zona)?.nombre || "";
      const typesName =
        propertyListState.types.find((t) => t.id === tipo)?.nombre || "";
      const operationName =
        propertyListState.operations.find((o) => o.id === operacion)?.nombre ||
        "";

      return `
      <div class="card" data-id="${escapeHtml(propertyId)}" data-price="${price ?? 0}">
          <img src="${escapeHtml(imageUrl)}" alt="Imagen de la propiedad">
          <div class="card-info">
              <p class="price">${currencySymbol(moneda)} ${price} - <span class="operation">En ${escapeHtml(operationName)}</span></p>
              <p class="type">${escapeHtml(typesName)}</p>
              <p class="location">
                  <img src="/assets/icons/location-icon.svg" alt="Ubicación" class="location-icon">
                  ${escapeHtml(location)} - ${escapeHtml(zoneName)}
              </p>
              <div class="details">
                  <p>
                      <img src="/assets/icons/icon-house.svg" alt="Ambientes" class="house-icon">
                      Ambientes: ${rooms ?? "No detallado"}
                  </p>
                  <p>
                      <img src="/assets/icons/icon-bedroom.svg" alt="Dormitorios" class="house-icon">
                      Dormitorios: ${bedrooms ?? "No detallado"}
                  </p>
                  <p>
                      <img src="/assets/icons/icon-surface.svg" alt="Superficie" class="surface-icon">
                      Área total: ${surface}m²
                  </p>
              </div>
              <div class="aditional-info">
                  <p>${escapeHtml(description)}</p>
              </div>
          </div>
      </div>`;
    })
    .join("");
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) {
    const propertyId = card.getAttribute("data-id");
    window.location.href = `/property.html?id=${propertyId}`;
  }
});

document.querySelector("#dropdown6")?.addEventListener("click", (event) => {
  if (event.target.textContent.includes("Mayor precio")) {
    sortProperties("desc");
  } else if (event.target.textContent.includes("Menor precio")) {
    sortProperties("asc");
  }
});

document.addEventListener("DOMContentLoaded", fetchData);