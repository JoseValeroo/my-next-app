const axios = require("axios");
const { faker } = require("@faker-js/faker");

// 📡 URL del endpoint de registro de usuarios
const BASE_URL = "/api/auth/create"; 

// 🧠 Función para esperar "ms" milisegundos
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🎲 Genera un usuario aleatorio
const generateUser = (index) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = `${firstName.toLowerCase()}${index}`;
  const email = `${username}@gmail.com`;

  return {
    user_handle: username,
    email_address: email,
    first_name: firstName,
    last_name: lastName,
    phone_number: `600${String(index).padStart(6, "0")}`,
    password: "test1234", // Se hashea en el backend automáticamente
  };
};

// 🚀 Función principal para registrar muchos usuarios
const registerManyUsers = async (cantidad = 100) => {
  for (let i = 1; i <= cantidad; i++) {
    const user = generateUser(i);

    try {
      await axios.post(BASE_URL, user);
      console.log(`✅ Registrado: ${user.user_handle}`);
    } catch (err) {
      console.error(`❌ Error con ${user.user_handle}:`, err.response?.data || err.message);
    }

    // ⏳ Esperar 100ms antes de enviar el siguiente
    await delay(100);
  }

  console.log("🎉 Proceso de registro de usuarios terminado.");
};

// 🔥 Ejecutamos el script
registerManyUsers();
