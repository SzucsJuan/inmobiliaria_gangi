document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      to: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      subject: document.getElementById("subject").value,
      text: document.getElementById("message").value
    };

    try {
      let response = await fetch("http://localhost:3000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let result = await response.text();
      alert('Mail enviado correctamente');
      document.getElementById("contactForm").reset();
    } catch (error) {
      console.error("Error enviando el formulario:", error);
    }
  });