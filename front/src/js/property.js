async function fetchData() {
  try {
    const [
      propsResponse,
      zonesResponse,
      typesResponse,
      operationsResponse,
      variosResponse,
    ] = await Promise.all([
      fetch("http://localhost:3000/api/props"),
      fetch("http://localhost:3000/api/zones"),
      fetch("http://localhost:3000/api/types"),
      fetch("http://localhost:3000/api/operations-status"),
      fetch("http://localhost:3000/api/varios"),
    ]);

    if (
      !propsResponse.ok ||
      !zonesResponse.ok ||
      !typesResponse.ok ||
      !operationsResponse.ok ||
      !variosResponse.ok
    ) {
      throw new Error("Error en la respuesta de la API.");
    }

    const [propsData, zonesData, typesData, operationsData, variosData] =
      await Promise.all([
        propsResponse.json(),
        zonesResponse.json(),
        typesResponse.json(),
        operationsResponse.json(),
        variosResponse.json(),
      ]);

    propertyInfo(propsData, zonesData, typesData, operationsData, variosData);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

function getPropertyIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function propertyInfo(data, zonesData, typesData, operationsData, variosData) {
  const container = document.querySelector(".main-content");
  container.innerHTML = "";

  const propertyId = getPropertyIdFromURL();
  if (!propertyId) {
    container.innerHTML = "<p>Propiedad no encontrada.</p>";
    return;
  }

  const property = data.records.find((prop) => prop.nro == propertyId);
  if (!property) {
    container.innerHTML = "<p>Propiedad no encontrada.</p>";
    return;
  }

  const imageUrls = property.imagenes?.length
    ? property.imagenes
    : ["/front/src/assets/icons/logo2.png"];

  const {
    valor: price,
    expensas,
    calle: location,
    ambientes: rooms,
    dormitorios: bedrooms,
    banios: baños,
    antiguedad,
    sup_total: surface,
    sup_cubierta: surfaceCovered,
    lote_x: lotWidth,
    latitud,
    longitud,
    tipo,
    zona,
    operacion,
  } = property;

  const zoneName =
    zonesData?.records?.find((z) => z.id === zona)?.nombre ||
    "Zona desconocida";
  const typesName =
    typesData?.records?.find((t) => t.id === tipo)?.nombre ||
    "Tipo desconocido";
  const operationName =
    operationsData?.records?.find((o) => o.id === operacion)?.nombre ||
    "Operación desconocida";

  const variosList = property.varios
    ? property.varios
        .map((varioId) => {
          const vario = variosData.records.find((v) => v.id === varioId);
          return vario ? `<p>${vario.nombre}</p>` : "";
        })
        .join("")
    : "<p>No especificado</p>";

  const galleryHTML = `
    <div class="swiper mySwiper" style="width: 100%; max-width: 600px; height: 300px; margin-bottom: 20px;">
      <div class="swiper-wrapper">
        ${imageUrls
          .map(
            (url) => `
          <div class="swiper-slide">
            <img src="${url}" alt="Imagen propiedad" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" />
          </div>`
          )
          .join("")}
      </div>
  
      <!-- Controles -->
      <div class="swiper-button-next" style="color: white;"></div>
      <div class="swiper-button-prev" style="color: white;"></div>
      <div class="swiper-pagination"></div>
    </div>
  `;

  const propertyHTML = `
    <div class="property-header">
      <div class="property-address">${typesName} en ${operationName} <br> ${location} - ${zoneName}</div> 
      <div class="property-value"> <br> U$S ${price} - Expensas: $ ${expensas}</div>
    </div>

    ${galleryHTML}

    <h3 class="property-titles">Características</h3>
    <ul class="property-features">
      <li>Ambientes: ${rooms}</li>  
      <li>Dormitorios: ${bedrooms}</li>
      <li>Baños: ${baños}</li>
      ${antiguedad ? `<li>Antigüedad: ${antiguedad} años</li>` : ""}
    </ul>

    <h3 class="property-titles" style="margin-top: 1em;">Superficie y Medidas</h3>
    <ul class="property-features">
      <li>Superficie total: ${surface} m2</li>
      <li>Superficie cubierta: ${surfaceCovered} m2</li>
      ${lotWidth ? `<li>Ancho del lote: ${lotWidth} m2</li>` : ""}
    </ul>

    <h3 class="property-titles" style="margin-top: 1em;">Información adicional</h3>
    <ul class="varios-list">
      ${variosList}
    </ul>

    <h3 class="property-titles" style="margin-top: 2em;">Descripción</h3>
    <p>${property.descripcion}</p>

    <div class="property-map">
      <h3>Ubicación</h3>
      <p>${latitud}, ${longitud}</p>
      <iframe src=""
          width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
    
    <form class="contact-form">
      <h3>Contacto</h3>
      <label for="name">Nombre</label>
      <input type="text" id="name" name="name" required>
      
      <label for="email">Correo Electrónico</label>
      <input type="email" id="email" name="email" required>
      
      <label for="message">Mensaje</label>
      <textarea id="message" name="message" rows="4" required></textarea>
      
      <button type="submit">Enviar</button>
    </form>
  `;

  container.innerHTML = propertyHTML;

  new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});
