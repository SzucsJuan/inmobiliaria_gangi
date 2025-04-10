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
          <li class="property-type"><a href="/front/src/property-list.html" style="text-decoration: none; color: white;">Propiedades</a></li>
          <li class="property-type"><a href="/front/src/contact.html" style="text-decoration: none; color: white;">Contacto</a></li>
        </ul>
      </div>
       <div class="socials">
          <h3 class="property-footer-title">Nuestras redes</h3>
          <div style="justify-items: flex-start; display: flex; gap: 0.5em; align-items: center;"> <a href="https://wa.me/5491165779585" target="_blank" rel="noopener noreferrer">
          <img src="/front/src/assets/icons/icons8-whatsapp-50.png" alt="WhatsApp" style="display: block; width: 32px; height: 32px;"> </a>

          <a href="https://www.instagram.com/inmobiliaria_gangi/" target="_blank" rel="noopener noreferrer">
          <img src="/front/src/assets/icons/instagram-48.png" alt="Instagram" style="display: block; width: 32px; height: 32px;"> </a>

  </div>
</div>

      </div>
    </div>
    <p class="property-type" style="text-align: center; margin-top: 2.4em;">2025 Estudio Gangi - Todos los derechos
      reservados</p>
  </footer>
    `;
  
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  });