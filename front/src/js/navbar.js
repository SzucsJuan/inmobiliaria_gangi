document.addEventListener("DOMContentLoaded", function () {
    const headerHTML = `
      <header>
    <div class="header-container">
      <div class="navbar"><img src="/front/src/assets/icons/logo1.png"
          alt="Logo de Inmobiliaria Gangi, especialistas en bienes raíces" class="navbar-logo">
        <span class="navbar-title"><a href="/front/src/home.html"
            style="text-decoration: none; color: inherit;">Inmobiliaria Gangi</a></span>
      </div>
    </div>
    <nav>
      <div class="hamburger-menu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul class="nav-links">
        <li><a href="/front/src/home.html">Inicio</a></li>
        <li><a href="/front/src/property-list.html">Propiedades</a></li>
        <li><a href="/front/src/contact.html">Contacto</a></li>
      </ul>
    </nav>

  </header>
    `;
  
    document.body.insertAdjacentHTML("beforebegin", headerHTML);
  });