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
const cron = require('node-cron');
const newsController = require('./controllers/newsController'); // 📌 Importamos el controlador de noticias

const app = express();
const PORT = 3001;

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

// cron.schedule('0 3 * * *', async () => { // 👈  EXPRESIÓN CRON MODIFICADA PARA PRUEBAS
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
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
