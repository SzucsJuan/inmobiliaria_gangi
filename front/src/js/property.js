async function fetchData() {
    try {
      const [propsResponse, zonesResponse, typesResponse, operationsResponse, variosResponse] =
        await Promise.all([
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
        throw new Error(
          `Error en la respuesta de la API: ${propsResponse.status} / ${zonesResponse.status} / ${typesResponse.status} / ${operationsResponse.status}`
        );
      }
  
      const [propsData, zonesData, typesData, operationsData, variosData] = await Promise.all(
        [
          propsResponse.json(),
          zonesResponse.json(),
          typesResponse.json(),
          operationsResponse.json(),
          variosResponse.json(),
        ]
      );
  
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
        banios: baños,
        sup_total: surface,
        latitud: latitud,
        longitud: longitud,
        tipo,
        zona,
        operacion,
      } = property;
    
      const zoneName = zonesData?.records?.find((z) => z.id === zona)?.nombre || "Zona desconocida";
      const typesName = typesData?.records?.find((t) => t.id === tipo)?.nombre || "Tipo desconocido";
      const operationName =
        operationsData?.records?.find((o) => o.id === operacion)?.nombre || "Operación desconocida";
    
      // Obtener los "varios" en formato <p>Agua corriente:</p> etc.
      const variosList = property.varios
        ? property.varios
            .map((varioId) => {
              const vario = variosData.records.find((v) => v.id === varioId);
              return vario ? `<p>${vario.nombre}</p>` : "";
            })
            .join("")
        : "<p>No especificado</p>";
    
      const propertyHTML = `
        <div class="property-header">
            <div class="property-address">${location} - ${zoneName}</div>
            <div class="property-value">U$S ${price} - <span style="color: #8C5074;">En ${operationName}</span></div>
        </div>
        
        <div class="property-image">
            <img src="${imageUrl}" alt="Imagen de la propiedad">
        </div>
        
        <h3 class="caracteristicas">Características</h3>
        <ul class="property-features">
            <li>Ambientes: ${rooms}</li>  
            <li>Dormitorios: ${bedrooms}</li>
            <li>Baños: ${baños}</li>
            <li>Superficie: ${surface} m2</li>
        </ul>
        
        <h3 class="extras">Extras</h3>
        ${variosList}
    
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
      </div>
      `;
    
      container.innerHTML = propertyHTML;
    }
  
  document.addEventListener("DOMContentLoaded", function () {
    fetchData();
  });
  