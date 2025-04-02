async function fetchData() {
  try {
    const [propsResponse, zonesResponse, operationsResponse] = await Promise.all([
      fetch("http://localhost:3000/api/props"),
      fetch("http://localhost:3000/api/zones"),
      fetch("http://localhost:3000/api/operations-status"),
    ]);

    if (!propsResponse.ok || !zonesResponse.ok || !operationsResponse.ok) {
      throw new Error(
        `Error en la respuesta de la API: ${propsResponse.status} / ${operationsResponse.status} / ${zonesResponse.status}`
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

    // Tomamos solo los primeros 4 elementos
    const propertiesToShow = data.records.slice(0, 4);

    propertiesToShow.forEach((property) => {
      if (Array.isArray(property.imagenes) && property.imagenes.length > 0) {
        const imageUrl = property.imagenes[0];
        const price = property.valor;
        const street = property.calle;

        const zoneName = zonesData?.records?.find((z) => z.id === property.zona)?.nombre || "";
        const operationName = operationsData?.records?.find((o) => o.id === property.operacion)?.nombre || "";

        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${imageUrl}" alt="Imagen de la propiedad">
          <p class="price">U$S ${price} - <span class="operation">En ${operationName}</span></p>
          <h2 class="street"><img src="/front/src/assets/icons/location-icon.png" alt="Ubicación" class="location-icon">${street} - ${zoneName}</h2>
          <button>Ver más</button>
        `;
        container.appendChild(card);
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


// function initCarousel() {
//   const container = document.querySelector(".card-container");
//   const leftArrow = document.querySelector(".left-arrow");
//   const rightArrow = document.querySelector(".right-arrow");

//   if (!container || !leftArrow || !rightArrow) {
//     console.error("Error: No se encontraron elementos del carrusel.");
//     return;
//   }

//   let scrollAmount = 0;
//   const cards = document.querySelectorAll(".card");
//   if (cards.length === 0) {
//     console.warn("No hay tarjetas para mostrar en el carrusel.");
//     return;
//   }

//   const cardWidth = cards[0].offsetWidth + 20;
//   const visibleCards = Math.min(6, cards.length);
//   const maxScroll = Math.min(
//     (cards.length - visibleCards) * cardWidth,
//     cardWidth * visibleCards * 1 
//   );

//   const spacer = document.createElement("div");
//   spacer.style.width = `${120}px`; 
//   spacer.style.flexShrink = "0"; 
//   container.appendChild(spacer); 



//   leftArrow.addEventListener("click", function () {
//     scrollAmount = Math.max(scrollAmount - cardWidth * visibleCards, 0);
//     container.style.transform = `translateX(-${scrollAmount}px)`;
//   });

//   rightArrow.addEventListener("click", function () {
//     scrollAmount = Math.min(scrollAmount + cardWidth * visibleCards, maxScroll);
//     container.style.transform = `translateX(-${scrollAmount}px)`;
//   });


