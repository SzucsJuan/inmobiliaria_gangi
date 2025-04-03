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
          `Error en la respuesta de la API: ${propsResponse.status} / ${zonesResponse.status} / ${typesResponse.status} / ${operationsResponse.status}`
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
  
      propertyInfo(propsData, zonesData, typesData, operationsData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }
  
  function getPropertyIdFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get("id");
    }
    
    function propertyInfo(data, zonesData, typesData, operationsData) {
      const container = document.querySelector(".main-content");
      container.innerHTML = "";
    
      const propertyId = getPropertyIdFromURL();
      if (!propertyId) {
        console.log("No se proporcionó un ID de propiedad.");
        container.innerHTML = "<p>Propiedad no encontrada.</p>";
        return;
      }
    
      const property = data.records.find((prop) => prop.nro == propertyId);
      if (!property) {
        console.log("Propiedad no encontrada.");
        container.innerHTML = "<p>Propiedad no encontrada.</p>";
        return;
      }
    
      const imageUrl = property.imagenes?.length
        ? property.imagenes[0]
        : "/front/src/assets/icons/logo2.png";
    
      const {
        nro,
        inmob: codInmob,
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
        zonesData?.records?.find((z) => z.id === zona)?.nombre || "Zona desconocida";
      const typesName =
        typesData?.records?.find((t) => t.id === tipo)?.nombre || "Tipo desconocido";
      const operationName =
        operationsData?.records?.find((o) => o.id === operacion)?.nombre || "Operación desconocida";
    
      const propertyHTML = `
        <div class="direccion-box">
            <p class="titulo">${location}</p>
            <p class="ubicacion"><i class="fas fa-map-marker-alt"></i> ${zoneName}</p>
        </div>
        <div class="precio-box">
            <p class="precio">u$s ${price.toLocaleString()}</p>
            <button class="boton">${operationName}</button>
        </div>
    
        <div class="container">
            <div class="left-box">
                <img src="${imageUrl}" alt="Imagen de la propiedad">
            </div>
            <div class="right-boxes">
                <div class="right-box"></div>
                <div class="right-box">
                    <p class="codigo-inmueble">Código del inmueble: ${codInmob} - ${nro}</p>
                </div>
            </div>
        </div>
        <div class="left-column">
            <div class="caracteristicas-box">
                <p class="caracteristicas-title">Características: ${rooms} ambientes, ${bedrooms} dormitorios</p>
            </div>
            <div class="superficie-box">
                <p class="superficie-title">Superficie total: ${surface} m²</p>
            </div>
            <div class="descripcion-box">
                <p class="descripcion-title">${description || "No hay descripción disponible"}</p>
            </div>
        </div>
        <div class="right-column">
            <div class="ubicacion-box">
                <p class="ubicacion-title">Ubicación: ${zoneName}</p>
            </div>
            <div class="contact-form">
                <h3 class="title">Contáctenme</h3>
                <form>
                    <input type="text" placeholder="Nombre completo *" required />
                    <input type="email" placeholder="Correo *" required />
                    <input type="tel" placeholder="Teléfono *" required />
                    <textarea placeholder="Mensaje *" required></textarea>
                    <button type="submit" class="submit-btn">ENVIAR</button>
                </form>
            </div>
        </div>
      `;
    
      container.innerHTML = propertyHTML;
    }
  
  document.addEventListener("DOMContentLoaded", function () {
    fetchData();
  });
  