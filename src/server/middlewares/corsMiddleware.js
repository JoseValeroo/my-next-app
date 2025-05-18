const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://miapp.local',
  'http://192.168.1.136',         // <- asegúrate de tener esta línea
  'http://192.168.1.136:3000',    // <- si accedes al puerto 3000 directo
];

module.exports = require('cors')({
  origin: true,         // refleja el Origin
  credentials: true
});