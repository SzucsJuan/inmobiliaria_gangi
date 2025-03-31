async function propList() {
    const url = 'http://localhost:3000/props';
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Propiedades obtenidas del servidor:', data);
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
    }
  }
  
  propList();
  