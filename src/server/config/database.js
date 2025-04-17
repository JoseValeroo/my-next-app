const db = require("mssql");

// Configuración para SQL Server
const dbConfig = {
    user: "root",
    password: "root",
    server: "localhost",
    database: "LURE",
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

// Crear pool de conexiones
let pool;
(async function initializePool() {
    try {
        pool = await db.connect(dbConfig);
        console.log("Conexión exitosa a SQL Server");
    } catch (err) {
        console.error("Error al conectar con SQL Server:", err);
    }
})();

// Helper para ejecutar consultas SQL
async function executeQuery(query, inputs = []) {
    if (!pool) {
        pool = await db.connect(dbConfig);
    }
    const request = pool.request();
    inputs.forEach(({ name, type, value }) => {
        request.input(name, type, value);
    });
    try {
        return await request.query(query);
    } catch (err) {
        console.error("Error al ejecutar consulta SQL:", err);
        throw err;
    }
}

module.exports = { executeQuery };