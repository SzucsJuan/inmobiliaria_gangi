async function fetchData() {
  try {
    const [propsResponse, zonesResponse, typesResponse, operationsResponse] =
      await Promise.all([
        fetch("http://localhost:3000/api/props"),
        fetch("http://localhost:3000/api/zones"),
        fetch("http://localhost:3000/api/types"),
        fetch("http://localhost:3000/api/operations-status"),
      ]);

    if (
      !propsResponse.ok ||
      !zonesResponse.ok ||
      !typesResponse.ok ||
      !operationsResponse.ok
    ) {
      throw new Error(
        `Error en la respuesta de la API: ${propsResponse.status} / ${operationsResponse.status} / ${zonesResponse.status} / ${typesResponse.status}`
      );
    }

    const [propsData, zonesData, typesData, operationsData] = await Promise.all(
      [
        propsResponse.json(),
        zonesResponse.json(),
        typesResponse.json(),
        operationsResponse.json(),
      ]
    );

    updateCard(propsData, zonesData, typesData, operationsData);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
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
          <h2 class="street"><img src="/front/src/assets/icons/location-icon.png" alt="Ubicación" class="location-icon">${street} 
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
      window.location.href = `/front/src/property.html?id=${propertyId}`;
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});
