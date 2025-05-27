const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://miapp.local',
  `http://${process.env.IP_BACKEND}`,
  `http://${process.env.IP_BACKEND}:${process.env.PORT_BACKEND}`,
];

module.exports = require('cors')({
  origin: true,         // refleja el Origin
  credentials: true
});