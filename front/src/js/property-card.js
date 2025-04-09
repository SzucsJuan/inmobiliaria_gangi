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
        `Error en la respuesta de la API: ${propsResponse.status} / ${zonesResponse.status}`
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

    const filteredProperties = filterPropertiesFromURL(
      propsData.records,
      zonesData,
      typesData
    );

    updateCard(
      { records: filteredProperties },
      propsData,
      zonesData,
      typesData,
      operationsData
    );
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

function filterPropertiesFromURL(properties, zonesData, typesData) {
  const { location, type } = getQueryParams();

  console.log("Filtros desde la URL:", { location, type });
  console.log("Propiedades recibidas:", properties);

  const filteredProperties = properties.filter((property) => {
    const zoneObj = zonesData.records.find((z) => z.id === property.zona);
    const typeObj = typesData.records.find((t) => t.id === property.tipo);

    const zoneName = zoneObj ? zoneObj.nombre.toLowerCase().trim() : "";
    const typeName = typeObj ? typeObj.nombre.toLowerCase().trim() : "";

    console.log(`Propiedad: Zona=${zoneName}, Tipo=${typeName}`);

    let matchesLocation = location
      ? zoneName === location.toLowerCase().trim()
      : true;
    let matchesType = type ? typeName === type.toLowerCase().trim() : true;

    return matchesLocation && matchesType;
  });

  console.log("Propiedades filtradas:", filteredProperties);

  return filteredProperties.length ? filteredProperties : [];
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    location: params.get("location"),
    type: params.get("tipo"),
  };
}
function updateCard(
  { records: filteredProperties },
  data,
  zonesData,
  typesData,
  operationsData
) {
  const container = document.querySelector(".card-container");
  container.innerHTML = "";

  if (!data?.records?.length) {
    console.log("No hay propiedades disponibles.");
    container.innerHTML = "<p>No se encontraron propiedades.</p>";
    return;
  }

  // console.log("Propiedades encontradas:", data.records.length);

  data.records.forEach((property) => {
    const imageUrl = property.imagenes?.length
      ? property.imagenes[0]
      : "/front/src/assets/icons/logo2.png";

    const {
      nro: propertyId,
      valor: price,
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
      zonesData?.records?.find((z) => z.id === zona)?.nombre || "";
    const typesName =
      typesData?.records?.find((t) => t.id === tipo)?.nombre || "";
    const operationName =
      operationsData?.records?.find((o) => o.id === operacion)?.nombre || "";

    const cardHTML = `
      <div class="card" data-id="${propertyId}">
          <img src="${imageUrl}" alt="Imagen de la propiedad">
          <div class="card-info">
              <p class="price">U$S ${price} - <span class="operation">En ${operationName}</span></p>
              <p class="type">${typesName}</p>
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

          </div>
      </div>
    `;
//     Icono WP (ingresar dentro de cardHTML)
//     <div class="whatsapp-icon">
//     <a href="https://wa.me/" target="_blank"><img src="/front/src/assets/icons/icons8-whatsapp-50.png" alt="WhatsApp"></a>
// </div>
    container.innerHTML += cardHTML;
  });
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) {
    const propertyId = card.getAttribute("data-id");
    window.location.href = `/front/src/property.html?id=${propertyId}`;
  }
});

document.querySelector("#dropdown6").addEventListener("click", (event) => {
  if (event.target.textContent.includes("Mayor precio")) {
    sortProperties("desc");
  } else if (event.target.textContent.includes("Menor precio")) {
    sortProperties("asc");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});
