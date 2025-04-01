document.addEventListener("DOMContentLoaded", function () {
  fetchProperties();
});

async function fetchProperties() {
  try {
    const response = await fetch("http://localhost:3000/api/props");
    const data = await response.json();
    console.log("Datos obtenidos:", data);
    updateCard(data);
  } catch (error) {
    console.error("Error al obtener las propiedades:", error);
  }
}

function updateCard(data) {
  const container = document.querySelector(".card-container");
  container.innerHTML = "";

  if (data && Array.isArray(data.records) && data.records.length > 0) {
    console.log("Propiedades encontradas:", data.records.length);

    data.records.forEach((property) => {
      if (Array.isArray(property.imagenes) && property.imagenes.length > 0) {
        const imageUrl = property.imagenes[0];
        const price = property.valor;
        const street = property.calle;

        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${imageUrl}" alt="Imagen de la propiedad">
          <h3 class="street">${street}</h3>
          <p class="price">${price} ARS</p>
          <button>Ver más</button>
        `;
        container.appendChild(card);
      }
    });

    initCarousel();
  } else {
    console.log("No hay propiedades disponibles.");
    container.innerHTML = "<p>No se encontraron propiedades.</p>";
  }
}

function initCarousel() {
  const container = document.querySelector(".card-container");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  if (!container || !leftArrow || !rightArrow) {
    console.error("Error: No se encontraron elementos del carrusel.");
    return;
  }

  let scrollAmount = 0;
  const cards = document.querySelectorAll(".card");
  if (cards.length === 0) {
    console.warn("No hay tarjetas para mostrar en el carrusel.");
    return;
  }

  const cardWidth = cards[0].offsetWidth + 20;
  const visibleCards = Math.min(6, cards.length);
  const maxScroll = Math.max(0, (cards.length - visibleCards) * cardWidth);

  leftArrow.addEventListener("click", function () {
    scrollAmount = Math.max(scrollAmount - cardWidth * visibleCards, 0);
    container.style.transform = `translateX(-${scrollAmount}px)`;
  });

  rightArrow.addEventListener("click", function () {
    scrollAmount = Math.min(scrollAmount + cardWidth * visibleCards, maxScroll);
    container.style.transform = `translateX(-${scrollAmount}px)`;
  });
}

