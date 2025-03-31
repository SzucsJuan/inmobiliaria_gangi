async function fetchProperties() {
    try {
        const response = await fetch('http://localhost:3000/api/props');
        const data = await response.json();
        // console.log('Datos obtenidos:', data);
        updateCard(data);
    } catch (error) {
        console.error('Error al obtener las propiedades:', error);
    }
}
function updateCard(data) {
    // console.log("Datos recibidos:", JSON.stringify(data, null, 2));

    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    if (data && Array.isArray(data.records) && data.records.length > 0) {
        console.log("Propiedades encontradas:", data.records.length);

        data.records.forEach(property => {
            if (Array.isArray(property.imagenes) && property.imagenes.length > 0) {
                const imageUrl = property.imagenes[0];
                const price = property.valor;
                const location = property.zona;
                const rooms = property.ambientes;
                const surface = property.sup_total;
                const description = property.descripcion;

                console.log("URL de la imagen:", imageUrl);

                const cardHTML = `
            <div class="card">
                <img src="${imageUrl}" alt="Imagen de la propiedad">
                <div class="card-info">
                    <p class="price">${price} ARS</p>
                    <p class="location">${location}</p>
                    <div class="details">
                        <p>Ambientes: ${rooms}</p>
                        <p>Área total: ${surface}m²</p>
                    </div>
                    <div class="additional-info">
                        <p>${description}</p>
                    </div>
                </div>
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

document.addEventListener('DOMContentLoaded', function () {
    fetchProperties();
});