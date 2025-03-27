fetch('http://localhost:3000/api/data')
    .then(response => response.json())
    .then(data => console.log('Datos recibidos:', data))
    .catch(err => console.error('Error al obtener los datos:', err));
