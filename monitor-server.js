import express from "express";

const app = express();
const PORT = 4000;

app.use(express.static("public"));

const apps = [
  { name: "Auth Service", url: "https://auth-service-2-nik4.onrender.com" },
  { name: "Ecommerce API", url: "https://ecommerce-backend-1s9y.onrender.com" },
];

app.get("/status", async (req, res) => {
  const results = await Promise.all(
    apps.map(async (appData) => {
      const start = Date.now();
      try {
        const response = await fetch(appData.url, { method: "GET" });
        const latency = Date.now() - start;
        console.log(response, 'the response')
        return {
          ...appData,
          status: response.ok ? "🟢 Up" : "🔴 Down",
          latency,
        };
      } catch (error) {
        return { ...appData, status: "🔴 Down", latency: null };
      }
    })
  );

  res.json(results);
});

app.listen(PORT, () => console.log(`✅ Monitor running on http://localhost:${PORT}`));
