async function fetchData() {
  try {
    const [propsResponse, zonesResponse, operationsResponse] = await Promise.all([
      fetch("http://localhost:3000/api/props"),
      fetch("http://localhost:3000/api/zones"),
      fetch("http://localhost:3000/api/operations-status"),
    ]);

    if (!propsResponse.ok || !zonesResponse.ok || !operationsResponse.ok) {
      throw new Error(
        `Error en la respuesta de la API: ${propsResponse.status} / ${zonesResponse.status}`
      );
    }

    const [propsData, zonesData, operationsData] = await Promise.all([
      propsResponse.json(),
      zonesResponse.json(),
      operationsResponse.json(),
    ]);

    updateCard(propsData, zonesData, operationsData);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

function updateCard(data, zonesData, operationsData) {
  const container = document.querySelector(".card-container");
  container.innerHTML = "";

  if (!data?.records?.length) {
    console.log("No hay propiedades disponibles.");
    container.innerHTML = "<p>No se encontraron propiedades.</p>";
    return;
  }

  console.log("Propiedades encontradas:", data.records.length);

  data.records.forEach((property) => {
    if (!property.imagenes?.length) {
      console.log("No hay imágenes disponibles para esta propiedad.");
      return;
    }

    const [imageUrl] = property.imagenes;
    const { valor: price, calle: location, ambientes: rooms, dormitorios: bedrooms, sup_total: surface, descripcion: description, zona, operacion } = property;

    const zoneName = zonesData?.records?.find((z) => z.id === zona)?.nombre || "";
    const operationName = operationsData?.records?.find((o) => o.id === operacion)?.nombre || "";

    const cardHTML = `
      <div class="card">
          <img src="${imageUrl}" alt="Imagen de la propiedad">
          <div class="card-info">
              <p class="price">U$S ${price} - <span class="operation">En ${operationName}</span></p>
              <p class="location">
                  <img src="/front/src/assets/icons/location-icon.png" alt="Ubicación" class="location-icon">
                  ${location} - ${zoneName}
              </p>
              <div class="details">
                  <p>
                      <img src="/front/src/assets/icons/icon-house.png" alt="Ambientes" class="house-icon">
                      Ambientes: ${rooms ?? "No detallado"}
                  </p>
                  <p>
                      <img src="/front/src/assets/icons/icon-bedroom.png" alt="Dormitorios" class="house-icon">
                      Dormitorios: ${bedrooms ?? "No detallado"}
                  </p>
                  <p>
                      <img src="/front/src/assets/icons/icon-surface.png" alt="Superficie" class="surface-icon">
                      Área total: ${surface}m²
                  </p>
              </div>
              <div class="aditional-info">
                  <p>${description}</p>
              </div>
              <div class="whatsapp-icon">
                  <img src="/front/src/assets/icons/icons8-whatsapp-50.png" alt="WhatsApp">
              </div>
          </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});
