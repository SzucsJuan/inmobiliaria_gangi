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

  if (data && Array.isArray(data.records) && data.records.length > 0) {
    console.log("Propiedades encontradas:", data.records.length);

    data.records.forEach((property) => {
      if (Array.isArray(property.imagenes) && property.imagenes.length > 0) {
        const imageUrl = property.imagenes[0];
        const price = property.valor;
        const location = property.calle;
        const rooms = property.ambientes;
        const bedrooms = property.dormitorios;
        const surface = property.sup_total;
        const description = property.descripcion;

        let zoneName = "";
        if (zonesData && Array.isArray(zonesData.records)) {
          const zonaEncontrada = zonesData.records.find(
            (z) => z.id === property.zona
          );
          if (zonaEncontrada) {
            zoneName = zonaEncontrada.nombre;
          }
        }

        let operationName = "";
        if (operationsData && Array.isArray(operationsData.records)) {
          const operationEncontrada = operationsData.records.find(
            (o) => o.id === property.operacion
          );
          if (operationEncontrada) {
            operationName = operationEncontrada.nombre;
          }
        }

        const cardHTML = `
                    <div class="card">
                        <img src="${imageUrl}" alt="Imagen de la propiedad">
                        <div class="card-info">
                            <p class="price">u$s ${price} - <span class="operation">En ${operationName}</span></p>
                            <p class="location">
                                <img src="/front/src/assets/icons/location-icon.png" alt="Ubicación" class="location-icon">
                                ${location} - ${zoneName}
                            </p>
                            <div class="details">
                                <p>
                                    <img src="/front/src/assets/icons/icon-house.png" alt="Ambientes" class="house-icon"> 
                                    Ambientes: ${rooms}
                                </p>
                                                                <p>
                                    <img src="/front/src/assets/icons/icon-bedroom.png" alt="Dormitorios" class="house-icon"> 
                                    Dormitorios: ${bedrooms}
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
      } else {
        console.log("No hay imágenes disponibles para esta propiedad.");
      }
    });
  } else {
    console.log("No hay propiedades disponibles.");
    container.innerHTML = "<p>No se encontraron propiedades.</p>";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});
