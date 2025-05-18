"use client";

import { useState, FormEvent } from "react";
import Axios from "axios";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton"; // Ajusta la ruta según tu estructura de carpetas



export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    // 🔥 Validaciones antes de enviar la solicitud
    if (!username || !email || !firstName || !lastName || !phoneNumber || !password || !confirmPassword) {
      setError("❌ Por favor, completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("❌ La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("❌ Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await Axios.post("/api/auth/create", {
        user_handle: username,
        email_address: email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        password: password,
      });

      if (response.status === 201) {
        setSuccessMessage("✅ Registro exitoso. ¡Ahora puedes iniciar sesión!");
        setUsername("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");

        // 🔥 Ocultar el mensaje después de unos segundos
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err: any) {
      // console.error("❌ Error en el registro:", err);

      if (err.response?.status === 400) {
        setError(err.response.data.error || "❌ El nombre de usuario, email o número de teléfono ya están en uso.");
      } else {
        setError("❌ Error al registrar el usuario. Inténtalo de nuevo.");
      }
    }
};

  const addUser = () => {
    console.log("📡 Enviando solicitud a backend...");
    Axios.post("/api/auth/create", {
      user_handle: username,
      email_address: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      password: password,
    })
      .then(() => {
        setSuccessMessage("Usuario creado correctamente");
        setTimeout(() => setSuccessMessage(""), 3000);
        setUsername("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
      })
      .catch(() => {
        setError("Hubo un error al crear el usuario.");
        setTimeout(() => setError(""), 3000);
      });
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-300 via-blue-700 to-blue-950 dark:from-gray-950 dark:via-blue-900 dark:to-gray-950 relative overflow-hidden">
      
     {/* Patrón de fondo animado */}
     <div className="absolute inset-0 w-full h-full">
     <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.1">
              <animate
                attributeName="d"
                dur="20s"
                repeatCount="indefinite"
                values="M0,0 L100,0 L100,100 L0,100 Z;
                      M0,10 L90,0 L100,90 L10,100 Z;
                      M0,0 L100,0 L100,100 L0,100 Z"
              />
            </path>
          </svg>
        </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-2xl overflow-hidden">

        {/* Sección izquierda */}
        <div className="flex items-center justify-center lg:justify-start bg-transparent p-12 text-white -mt-20">
          <BackButton href="/" />
          <div className="relative text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 mt-12">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 mt-3 -ml-11 lg:-ml-2">Registro</h1>
              <div className="w-5 h-5 border-2 border-white/30 rounded-full ml-3 mt-2"></div>
              <div className="w-6 h-6 border-2 border-white/50 rounded-full -ml-4 mt-2"></div>
            </div>
            <div>
              <p className="text-sm md:text-lg lg:text-lg opacity-90 flex justify-center ">Crea una cuenta para continuar</p>
            </div>
          </div>
        </div>

  
        {/* Sección derecha */}
        <Card className=" border border-none shadow-2xl rounded-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative z-10 mx-auto">

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <Image src="/logo.png" alt="Logo de LA ISLA DE LURE" width={100} height={140} className="mb-6 lg:w-[180px]"priority  />
            </div>
                {/* 🔥 Mensajes de error y éxito */}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
            {/* Inputs */}
            <Input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Input
              type="text"
              placeholder="Apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Input
              type="tel"
              placeholder="Número Telefónico"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            {/* Contraseña */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

             {/* Confirmar Contraseña */}
             <div className="relative">
              <Input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirmar Contraseña" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"/>
              
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {/* Botón de registro */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">
                Registrarse
              </button>
            </div>
          </form>
  
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <a href="/pages/login" className="text-blue-500 hover:text-blue-600">
                Inicia sesión
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
