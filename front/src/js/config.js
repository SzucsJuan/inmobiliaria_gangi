const API_BASE_URL = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://localhost:3000/api"
  : `${window.location.origin}/api`;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

async function fetchListingData({ includeVarios = false } = {}) {
  const endpoints = ["props", "zones", "types", "operations-status"];
  if (includeVarios) endpoints.push("varios");

  const responses = await Promise.all(
    endpoints.map((endpoint) => fetch(`${API_BASE_URL}/${endpoint}`))
  );

  const failedResponse = responses.find((response) => !response.ok);
  if (failedResponse) {
    throw new Error(`Error en la respuesta de la API: ${failedResponse.status}`);
  }

  const bodies = await Promise.all(responses.map((response) => response.json()));

  const result = {};
  endpoints.forEach((endpoint, index) => {
    const key = endpoint === "operations-status" ? "operations" : endpoint;
    result[key] = bodies[index];
  });

  return result;
}