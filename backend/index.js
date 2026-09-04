const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const emailRoutes = require("./routes/emailRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes, intentá de nuevo más tarde." },
});

app.use("/api", apiLimiter);

app.get("/api/data", (req, res) => {
  res.json({ message: "API ready" });
});

const argencasasProxy = (endpoint) => async (req, res) => {
  const apiKey = process.env.API_KEY;
  const url = `https://api.argencasas.com/${endpoint}?api_key=${apiKey}`;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status}`);
      return res.status(response.status).send(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error al obtener ${endpoint}:`, error);
    res.status(500).send("Error al obtener datos");
  }
};

/*
 * Argencasas pagina `props` de 50 en 50 (ignora `limit`), así que una sola
 * llamada devuelve la mitad del catálogo. Como los filtros del listado son
 * client-side y corren sobre el array completo, con datos parciales filtran
 * mal: hay que juntar todas las páginas antes de responder.
 */
const UPSTREAM_PAGE_SIZE = 50;
const MAX_UPSTREAM_PAGES = 10;
const PROPS_CACHE_TTL_MS = 5 * 60 * 1000;

const argencasasFetch = async (endpoint, params = {}) => {
  const fetch = (await import("node-fetch")).default;
  const query = new URLSearchParams({ api_key: process.env.API_KEY, ...params });
  const response = await fetch(`https://api.argencasas.com/${endpoint}?${query}`);

  if (!response.ok) {
    const error = new Error(`Error HTTP ${response.status} en ${endpoint}`);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  return response.json();
};

const fetchAllProps = async () => {
  const firstPage = await argencasasFetch("props");
  const records = [...(firstPage.records || [])];
  const seen = new Set(records.map((record) => record.nro));
  const total = Number(firstPage.count) || records.length;

  for (let page = 1; page < MAX_UPSTREAM_PAGES && records.length < total; page += 1) {
    const nextPage = await argencasasFetch("props", {
      offset: page * UPSTREAM_PAGE_SIZE,
    });

    // Si el proveedor deja de paginar, repite la página y esto corta el loop.
    const newRecords = (nextPage.records || []).filter(
      (record) => !seen.has(record.nro)
    );
    if (!newRecords.length) break;

    newRecords.forEach((record) => seen.add(record.nro));
    records.push(...newRecords);
  }

  if (records.length < total) {
    console.warn(`props: se obtuvieron ${records.length} de ${total} registros`);
  }

  return { ...firstPage, count: total, offset: 0, records };
};

const cache = new Map();
const inFlight = new Map();

// Ante un fallo al refrescar, prefiere servir la copia vieja antes que cortar
// el listado: datos de hasta unos minutos son mejores que una página vacía.
const getCached = async (key, ttlMs, produce) => {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  if (!inFlight.has(key)) {
    inFlight.set(
      key,
      produce()
        .then((data) => {
          cache.set(key, { data, expiresAt: Date.now() + ttlMs });
          return data;
        })
        .finally(() => inFlight.delete(key))
    );
  }

  try {
    return await inFlight.get(key);
  } catch (error) {
    if (cached) {
      console.warn(`${key}: falló la actualización, se sirve la copia en caché.`);
      return cached.data;
    }
    throw error;
  }
};

app.get("/api/props", async (req, res) => {
  try {
    res.json(await getCached("props", PROPS_CACHE_TTL_MS, fetchAllProps));
  } catch (error) {
    console.error("Error al obtener props:", error);
    res
      .status(error.status || 500)
      .send(error.statusText ? `Error: ${error.statusText}` : "Error al obtener datos");
  }
});

app.get("/api/zones", argencasasProxy("zonas"));
app.get("/api/operations-status", argencasasProxy("operaciones"));
app.get("/api/types", argencasasProxy("tipos"));
app.get("/api/varios", argencasasProxy("varios"));

app.use("/api", emailRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});