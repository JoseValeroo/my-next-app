const express = require("express");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./middlewares/corsMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const followerRoutes = require("./routes/followerRoutes");
const communityRoutes = require("./routes/communityRoutes");
const storyRoutes = require("./routes/storyRoutes"); // 📌 Importamos las rutas de Stories
const newRoutes = require("./routes/newsRoutes");
const topicsRoutes = require("./routes/topicsRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cron = require('node-cron');
const newsController = require('./controllers/newsController'); // 📌 Importamos el controlador de noticias
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});


const app = express();
const PORT = process.env.PORT_BACKEND;
const adminRoutes = require("./routes/adminRoutes");
const cryptoRoutes = require('./routes/cryptoRoutes');

// Middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/followers", followerRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/news", newRoutes);
app.use("/api/topics", topicsRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use(
  '/uploads', 
  express.static(path.join(__dirname, 'public', 'uploads'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      } else if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
      }
    }
  }
));
app.use("/api", adminRoutes);
app.use("/api/messages", messageRoutes);

app.use('/api/crypto', cryptoRoutes);


//equire("./cron/newsletterCron");

// cron.schedule('0 3 * * *', async () => { // 👈  EXPRESIÓN CRON MODIFICADA PARA PRUEBAS
//     console.log('Ejecutando actualización de noticias... (PRUEBA CADA 10 MINUTOS)'); // Mensaje modificado para identificar pruebas
//     await newsController.updateDailyNews(); 
//     console.log('Actualización de noticias completada. (PRUEBA CADA 10 MINUTOS)'); // Mensaje modificado para identificar pruebas
// });

// (async () => {
//     console.log('🔄 Ejecutando actualización inicial de noticias...');
//     await newsController.updateDailyNews();
//     console.log('✅ Actualización inicial de noticias completada.');
// })();

// Servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://${process.env.IP_BACKEND}:${PORT}`);
  console.log('__dirname:', __dirname);
  console.log('Cargando .env desde:', path.resolve(__dirname, '../../.env'));
  console.log('IP_BACKEND=', process.env.IP_BACKEND);
  console.log('PORT_BACKEND=', process.env.PORT_BACKEND);
});
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await require("./path/a/tu/db.js").executeQuery("SELECT TOP 1 * FROM Users"); // Ajusta tabla
    res.json({ ok: true, rows: result.recordset });
  } catch (err) {
    console.error("❌ Error DB:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});
