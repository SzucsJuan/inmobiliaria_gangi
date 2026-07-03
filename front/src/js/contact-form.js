document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = this.querySelector(".send-button");
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    const formData = {
      name: document.getElementById("name").value,
      to: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      subject: document.getElementById("subject").value,
      text: document.getElementById("message").value
    };

    try {
      let response = await fetch(`${API_BASE_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Mail enviado correctamente. Nos pondremos en contacto pronto.");
        this.reset();
      } else {
        const errorText = await response.text();
        console.error("Error del servidor:", response.status, errorText);
        alert(`Error al enviar el mail (${response.status}): ${errorText || "Inténtalo de nuevo más tarde."}`);
      }
    } catch (error) {
      console.error("Error enviando el formulario:", error);
      alert("Error de conexión al intentar enviar el mail. Revisa tu conexión o inténtalo más tarde.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });