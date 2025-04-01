document.addEventListener("DOMContentLoaded", function () {
    const footerHTML = `
      <footer>
    <div class="footer-content" style="margin-top: 1em;">
      <div class="footer-logo"><img class="footer-logo" src="/front/src/assets/icons/logo2.png"
          alt="Logo de Inmobiliaria Gangi, especialistas en bienes raíces">
        <span class="footer-logo-title"><a href="/front/src/home.html"
            style="text-decoration: none; color: inherit;">Inmobiliaria Gangi</a></span>
      </div>
      <div>
        <h3 class="property-footer-title">Encontranos en</h3>
        <div class="contact-info">
          <p class="location-info">Av. Mitre 385 - Sanraf</p>
          <p class="location-info">(11) 3277-3991 / 3277-4723</p>
          <p class="location-info">diego.gangi@estudiogangi.com.ar</p>
        </div>
      </div>

      <div class="categories">
        <h3 class="property-footer-title">¿Qué estás buscando?</h3>
        <ul>
          <li class="property-type"><a href="#departamentos" style="text-decoration: none; color: white;">Departamentos</a></li>
          <li class="property-type"><a href="#locales" style="text-decoration: none; color: white;">Locales</a></li>
          <li class="property-type"><a href="#casas" style="text-decoration: none; color: white;">Casas</a></li>
          <li class="property-type"><a href="#lotes" style="text-decoration: none; color: white;">Lotes</a></li>
          <li class="property-type"><a href="#galpones" style="text-decoration: none; color: white;">Galpones</a></li>
          <li class="property-type"><a href="#oficinas" style="text-decoration: none; color: white;">Oficinas</a></li>
          <li class="property-type"><a href="#ph" style="text-decoration: none; color: white;">PH</a></li>
        </ul>
      </div>
      <div class="socials">
        <h3 class="property-footer-title">Nuestras redes</h3>
        <div style="justify-items: flex-start; display: flex; gap: 0.5em;">
          <img src="/front/src/assets/icons/icons8-whatsapp-50.png" alt="WhatsApp">
          <img src="/front/src/assets/icons/instagram-48.png" alt="Instagram">
        </div>

      </div>
    </div>
    <p class="property-type" style="text-align: center; margin-top: 2.4em;">2025 Estudio Gangi - Todos los derechos
      reservados</p>
  </footer>
    `;
  
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  });