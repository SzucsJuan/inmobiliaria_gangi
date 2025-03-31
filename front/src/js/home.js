async function fetchProperties() {
  try {
    const response = await fetch("http://localhost:3000/api/props");
    const data = await response.json();
    console.log('Datos obtenidos:', data);
    updateCard(data);
  } catch (error) {
    console.error("Error al obtener las propiedades:", error);
  }
}
function updateCard(data) {
  const container = document.querySelector(".carousel");
  container.innerHTML = "";

  if (data && Array.isArray(data.records) && data.records.length > 0) {
    console.log("Propiedades encontradas:", data.records.length);

    const propertiesToShow = data.records.slice(0, 5);

    propertiesToShow.forEach((property) => {
      if (Array.isArray(property.imagenes) && property.imagenes.length > 0) {
        const imageUrl = property.imagenes[0];
        const price = property.valor;
        const street = property.calle;

        const cardHTML = `
                    <div class="card">
                        <img src="${imageUrl}" alt="Imagen de la propiedad">
                        <h3 class="street">${street}</h3>
                        <p class="price">${price} ARS</p>
                        <button>Ver más</button>
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
  fetchProperties();
});
