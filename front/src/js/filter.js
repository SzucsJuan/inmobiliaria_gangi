function sortProperties(order) {
    const container = document.querySelector(".card-container");
  
    
    const cards = Array.from(container.children);
    cards.sort((a, b) => {
      const priceA = parseFloat(a.querySelector(".price").textContent.match(/U\$S\s([\d,]+)/)[1].replace(',', ''));
      const priceB = parseFloat(b.querySelector(".price").textContent.match(/U\$S\s([\d,]+)/)[1].replace(',', ''));
      return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
  
    container.innerHTML = "";
    cards.forEach(card => container.appendChild(card));
  }

  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        location: params.get("location"),
        type: params.get("type")
    };
}

async function applyFiltersFromURL() {
  const { location, type } = getQueryParams();

  if (location) {
      await filterByZone(location); // Filtrar por zona (ubicación)
  }
  if (type) {
      await filterByType(type); // Filtrar por tipo de propiedad
  }
}



  async function filterByZone(selectedZone) {
    try {

      const zonesData = await fetchData();
  

      const container = document.querySelector(".card-container");
      const cards = Array.from(container.children);
  

      const filteredCards = cards.filter(card => {
        const zoneElement = card.querySelector(".location");
        return zoneElement && zoneElement.textContent.includes(selectedZone);
      });
  

      container.innerHTML = "";
      if (filteredCards.length) {
        filteredCards.forEach(card => container.appendChild(card));
      } else {
        container.innerHTML = "<p style='margin-bottom: 20px; font-size: 20px;'>No se encontraron propiedades en esta ubicación.</p>";
      }
    } catch (error) {
      console.error("Error al filtrar propiedades por zona:", error);
    }
  }

  async function filterByType(selectedType) {
    try {
      const typesData = await fetchData();
  
      const container = document.querySelector(".card-container");
      const cards = Array.from(container.children);
  
      const filteredCards = cards.filter(card => {
        const typeElement = card.querySelector(".type"); 
        return typeElement && typeElement.textContent.includes(selectedType);
      });
  

      container.innerHTML = ""; 
      if (filteredCards.length) {
        filteredCards.forEach(card => container.appendChild(card));
      } else {
        container.innerHTML = "<p>No se encontraron propiedades de este tipo.</p>";
      }
    } catch (error) {
      console.error("Error al filtrar propiedades por tipo:", error);
    }
  }

  async function filterByMode(selectedType) {
    try {
      const operationsData = await fetchData();
  
      const container = document.querySelector(".card-container");
      const cards = Array.from(container.children);
  
      const filteredCards = cards.filter(card => {
        const typeElement = card.querySelector(".operation"); 
        return typeElement && typeElement.textContent.includes(selectedType);
      });
  

      container.innerHTML = ""; 
      if (filteredCards.length) {
        filteredCards.forEach(card => container.appendChild(card));
      } else {
        container.innerHTML = "<p>No se encontraron propiedades de este tipo.</p>";
      }
    } catch (error) {
      console.error("Error al filtrar propiedades por tipo:", error);
    }
  }

  async function resetFilters() {
    
    try {
      window.history.replaceState(null, "", window.location.pathname);
      const { propsData, zonesData, operationsData } = await fetchData();
  
      const container = document.querySelector(".card-container");
      container.innerHTML = ""; 
  
      propsData.records.forEach(property => {
        const [imageUrl] = property.imagenes;
        const { valor: price, calle: location, ambientes: rooms, dormitorios: bedrooms, sup_total: surface, descripcion: description, zona, operacion } = property;
  
        const zoneName = zonesData.records.find(z => z.id === property.zona)?.nombre || "Zona no especificada";
        const operationName = operationsData.records.find(o => o.id === property.operacion)?.nombre || "Operación no especificada";
  
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
                      <p>Ambientes: ${rooms ?? "No detallado"}</p>
                      <p>Dormitorios: ${bedrooms ?? "No detallado"}</p>
                      <p>Área total: ${surface}m²</p>
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
  
      console.log("Se han limpiado los filtros y se mostraron todas las propiedades.");
    } catch (error) {
      console.error("Error al limpiar los filtros:", error);
    }
  }
  
  
  document.addEventListener("DOMContentLoaded", applyFiltersFromURL);
  window.sortProperties = sortProperties;
