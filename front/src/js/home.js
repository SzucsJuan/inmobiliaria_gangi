async function fetchData() {
  const container = document.querySelector(".card-container");
  container.innerHTML = "<p>Cargando propiedades...</p>";
  try {
    const { props, zones, types, operations } = await fetchListingData();
    updateCard(props, zones, types, operations);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    container.innerHTML =
      "<p>No se pudieron cargar las propiedades. Intentá de nuevo más tarde.</p>";
  }
}

function updateCard(data, zonesData, typesData, operationsData) {
  const container = document.querySelector(".card-container");
  container.innerHTML = "";

  if (data && Array.isArray(data.records) && data.records.length > 0) {
    console.log("Propiedades encontradas:", data.records.length);

    const propertiesToShow = data.records.slice(0, 4);

    propertiesToShow.forEach((property) => {
      if (Array.isArray(property.imagenes) && property.imagenes.length > 0) {
        const imageUrl = property.imagenes[0];
        const price = property.valor;
        const street = property.calle;
        const propertyId = property.nro;

        const zoneName =
          zonesData?.records?.find((z) => z.id === property.zona)?.nombre || "";
        const typesName =
          typesData?.records?.find((t) => t.id === property.tipo)?.nombre || "";
        const operationName =
          operationsData?.records?.find((o) => o.id === property.operacion)
            ?.nombre || "";

        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-id", propertyId);
        card.innerHTML = `
          <img src="${imageUrl}" alt="Imagen de la propiedad">
          <p class="price">U$S ${price} - <span class="operation">En ${operationName}</span></p>
          <p class="street">${typesName}</p>
          <h2 class="street"><img src="/assets/icons/location-icon.png" alt="Ubicación" class="location-icon">${street} 
              <br> <span class="zone" style='margin-left: 19px;'>${zoneName}</span></h2>
        `;
        container.appendChild(card);
      }
    });
  } else {
    console.log("No hay propiedades disponibles.");
    container.innerHTML = "<p>No se encontraron propiedades.</p>";
  }
}

document.querySelector(".card-container").addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) {
    const propertyId = card.getAttribute("data-id");
    if (propertyId) {
      window.location.href = `/property.html?id=${propertyId}`;
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});
