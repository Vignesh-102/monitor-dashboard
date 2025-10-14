import express from "express";
import cors from "cors";

const app = express();
console.log('the port is', process.env.PORT);
const PORT = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(cors())

const apps = [
  { name: "Auth Service", url: "https://auth-service-2-nik4.onrender.com/actuator/health" },
  //{ name: "Ecommerce API", url: "https://ecommerce-backend-1s9y.onrender.com" },
];

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime().toFixed(2) + "s",
  });
});

app.get("/status", async (req, res) => {
  const results = await Promise.all(
    apps.map(async (appData) => {
      const start = Date.now();
      try {
        const response = await fetch(appData.url, { method: "HEAD" });
        const latency = Date.now() - start;
        console.log(response, 'the response');
        return {
          ...appData,
          status: response.ok ? "🟢 Up" : "🔴 Down",
          latency,
        };
      } catch (error) {
        console.log('error is', error);
        return { ...appData, status: "🔴 Down", latency: null };
      }
    })
  );

  res.json(results);
});

app.listen(PORT, () => console.log(`✅ Monitor running on http://localhost:${PORT}`));
