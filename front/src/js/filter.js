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
        container.innerHTML = "<p>No se encontraron propiedades en esta ubicación.</p>";
      }
    } catch (error) {
      console.error("Error al filtrar propiedades por zona:", error);
    }
  }
  

  window.sortProperties = sortProperties;
