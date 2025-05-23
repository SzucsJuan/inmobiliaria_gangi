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
    inmob: inmobCode,
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
    descripcion,
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

  document.title = `${typesName} en ${operationName} en ${zoneName}`;

  const variosList = property.varios
    ? property.varios
        .map((varioId) => {
          const vario = variosData.records.find((v) => v.id === varioId);
          return vario ? `<p>${vario.nombre}</p>` : "";
        })
        .join("")
    : "<p>No especificado</p>";

  // --- Inicio: Lógica del Mapa ---
  const isValidCoords =
    typeof latitud === "number" &&
    typeof longitud === "number" &&
    !isNaN(latitud) &&
    !isNaN(longitud);

  const mapUrl = isValidCoords
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyCt6gdc1YJzjPpQ8Lzrfajna1f0nCWhzhw&q=${latitud},${longitud}&zoom=16&maptype=roadmap`
    : "";

  const mapHTML = isValidCoords
    ? `<iframe src="${mapUrl}" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    : "<p>La ubicación exacta no está disponible en el mapa.</p>";
  // --- Fin: Lógica del Mapa ---

  const galleryHTML = `
    <div class="swiper mySwiper" style="width: 100%; max-width: 800px; height: 600px; margin-bottom: 20px;">
      <div class="swiper-wrapper">
        ${imageUrls
          .map(
            (url) => `
          <div class="swiper-slide">
            <img src="${url}" alt="Imagen propiedad" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
          </div>`
          )
          .join("")}
      </div>
  
      <div class="swiper-button-next" style="color: white;"></div>
      <div class="swiper-button-prev" style="color: white;"></div>
      <div class="swiper-pagination"></div>
    </div>
  `;

  const propertyHTML = `
    <div class="property-header">
      <div class="property-address">
        <span class="property-category">${typesName}</span> 
        <span class="property-operation">${operationName}</span> <br> 
        <span class="property-zone">${location} - ${zoneName}</span>
      </div> 
      <div class="property-value"><span class="property-price">U$S ${price}</span> - <span class="property-exp">Expensas: $ ${expensas ?? ""}</span> 
        <br> <span class="property-code">Código del inmueble: ${inmobCode}-${propertyId}</span>
      </div>
    </div>

    ${galleryHTML}

    <h3 class="property-titles">Características</h3>
    <ul class="property-features">
      <li>Ambientes: ${rooms ?? "No especificado"}</li>  
      <li>Dormitorios: ${bedrooms ?? "No especificado"}</li>
      <li>Baños: ${baños ?? "No especificado"}</li>
      ${antiguedad ? `<li>Antigüedad: ${antiguedad} años</li>` : ""}
    </ul>

    <h3 class="property-titles" style="margin-top: 1em;">Superficie y Medidas</h3>
    <ul class="property-features">
      ${surface ? `<li>Superficie total: ${surface} m2</li>` : ""}
      ${
        surfaceCovered
          ? `<li>Superficie cubierta: ${surfaceCovered} m2</li>`
          : ""
      }
      ${lotWidth ? `<li>Ancho del lote: ${lotWidth} m2</li>` : ""}
    </ul>

    <h3 class="property-titles" style="margin-top: 1em;">Información adicional</h3>
    <ul class="varios-list">
      ${variosList}
    </ul>

    <h3 class="property-titles" style="margin-top: 2em;">Descripción</h3>
      <p>${descripcion || "Descripción no disponible."}</p>  
      <h3 class="property-titles" style="margin-top: 2em;">Ubicación</h3>
        ${mapHTML}
    </div>  

    
    <form class="contact-form" id="contactForm">
      <h3>Quiero que me contacten</h3>
        <input type="text" id="name" name="name" placeholder="Nombre completo *" required>
        <input type="email" id="email" name="email" placeholder="Correo *" required>
        <input type="tel" id="phone" name="phone" placeholder="Teléfono *" required>
        <input type="text" id="subject" name="subject" placeholder="Asunto *" required>
        <textarea id="message" name="message" placeholder="Mensaje *" required></textarea>
        <button type="submit" class="send-button">ENVIAR</button>
    </form>
  `;

  container.innerHTML = propertyHTML;

  const contactFormElement = document.getElementById("contactForm");

  if (contactFormElement) {
    contactFormElement.addEventListener("submit", async function (event) {
      event.preventDefault(); 

      const submitButton = this.querySelector('.send-button');
      const originalButtonText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';

      const formData = {
        name: document.getElementById("name").value,
        to: document.getElementById("email").value, 
        phone: document.getElementById("phone").value,
        subject: document.getElementById("subject").value,
        text: document.getElementById("message").value,
      };

      try {
        let response = await fetch("http://localhost:3000/api/send-email", { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          let result = await response.text(); 
          console.log("Respuesta del servidor:", result);
          alert('Mail enviado correctamente. Nos pondremos en contacto pronto.');
          this.reset(); 
        } else {

          let errorText = await response.text();
          console.error("Error del servidor:", response.status, errorText);
          alert(`Error al enviar el mail (${response.status}): ${errorText || 'Inténtalo de nuevo más tarde.'}`);
        }

      } catch (error) {
        console.error("Error en la comunicación con el servidor:", error);
        alert('Error de conexión al intentar enviar el mail. Revisa tu conexión o inténtalo más tarde.');
      } finally {
         submitButton.disabled = false; 
         submitButton.textContent = originalButtonText; 
      }
    });
  } else {
    console.error("Error: El formulario con ID 'contactForm' no se encontró después de añadir el HTML.");
  }

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
