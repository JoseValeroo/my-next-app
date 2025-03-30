"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { WiThermometer, WiRain, WiStrongWind, WiDaySunny, WiCloudy } from "react-icons/wi";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

interface WeatherWidgetProps {
  summary?: boolean;
  location?: any;
  onSummaryClick?: () => void;
  session?: boolean; // Prop para determinar si hay sesión
}

// Función para seleccionar el ícono según algunos datos del pronóstico
const getLoadingIcon = (forecastData: any[]): JSX.Element => {
  if (forecastData && forecastData.length > 0) {
    const today = forecastData[0];
    // Si hay precipitación significativa
    if (today.precipitation > 1) {
      return <WiRain className="text-blue-500 text-4xl" />;
    }
    // Si la velocidad del viento es alta
    if (today.windspeed > 20) {
      return <WiStrongWind className="text-gray-500 text-4xl" />;
    }
    // Si está nublado 
    if (today.humidity > 80) {
      return <WiCloudy className="text-gray-500 text-4xl" />;
    }
    // Por defecto, sol
    return <WiDaySunny className="text-yellow-500 text-4xl" />;
  }
  // Valor por defecto mientras no se disponga de datos
  return <WiDaySunny className="text-yellow-500 text-4xl" />;
};

const WeatherWidget = ({ summary = false, location, onSummaryClick, session }: WeatherWidgetProps) => {
  const [forecast, setForecast] = useState<any[]>([]);
  const [coords, setCoords] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
  
    const fetchGeocode = async () => {
      try {
        // Si no se pasa location, intenta obtener la ubicación real del usuario
        if (!location) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                if (isMounted) {
                  setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });
                }
              },
              (error) => {
                console.error("Error obteniendo la ubicación:", error);
                // Si falla, se usa la ubicación por defecto (Madrid)
                if (isMounted) setCoords({ latitude: 40.4168, longitude: -3.7038 });
              }
            );
          } else {
            // Si el navegador no soporta geolocalización, se usa la ubicación por defecto
            if (isMounted) setCoords({ latitude: 40.4168, longitude: -3.7038 });
          }
          return;
        }
  
        // Si se pasa location como objeto con latitud y longitud, se utiliza directamente
        if (typeof location === "object" && location.latitude && location.longitude) {
          if (isMounted) setCoords(location);
          return;
        }
  
        // Si se pasa location como string, se busca la ubicación mediante OpenStreetMap
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
        );
        const data = await res.json();
  
        if (data?.length > 0 && isMounted) {
          setCoords({
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
        } else if (isMounted) {
          setCoords({ latitude: 40.4168, longitude: -3.7038 });
        }
      } catch (err) {
        if (isMounted) setCoords({ latitude: 40.4168, longitude: -3.7038 });
      }
    };
  
    fetchGeocode();
  
    return () => {
      isMounted = false;
    };
  }, [location]);  

  useEffect(() => {
    let isMounted = true;
    
    const fetchForecast = async () => {
      if (!coords) return;

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,apparent_temperature_max,relative_humidity_2m_max&timezone=Europe%2FMadrid`
        );

        if (!response.ok) throw new Error("Error en pronóstico");
        
        const data = await response.json();
        const today = new Date();
        const nextThreeDays = [today, addDays(today, 1), addDays(today, 2)];
        
        const filteredDays = nextThreeDays
          .map((date) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            const index = data.daily.time.indexOf(formattedDate);
            
            return index !== -1 ? {
              date,
              max: data.daily.temperature_2m_max[index],
              min: data.daily.temperature_2m_min[index],
              precipitation: data.daily.precipitation_sum[index],
              windspeed: data.daily.windspeed_10m_max[index],
              apparentTemp: data.daily.apparent_temperature_max[index],
              humidity: data.daily.relative_humidity_2m_max[index],
            } : null;
          })
          .filter(Boolean);

        if (isMounted) setForecast(filteredDays);
      } catch (err) {
        if (isMounted) setError("Error cargando datos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, [coords]);

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-4">
        <div className="flex flex-col items-center justify-center space-y-3 min-h-[100px]">
          {/* Ícono animado con efecto pulse */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-12 w-12"
          >
            {/* Se escoge el ícono según datos si ya existen, o se muestra el default */}
            {getLoadingIcon(forecast)}
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Cargando datos meteorológicos...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Obteniendo información para {location || "tu ubicación"}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg mt-4">
        <p className="text-red-600 dark:text-red-400">⚠️ {error}</p>
      </div>
    );
  }

  if (summary) {
    return (
      <div
        className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onSummaryClick}
      >
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
          🌤️ El tiempo en {location || "tu ubicación"}
        </h3>
        {forecast[0] && (
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex items-center">
              <WiThermometer className="mr-2 text-2xl text-orange-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {forecast[0].max}° / {forecast[0].min}°
              </span>
            </div>
            <div className="flex items-center">
              <WiRain className="mr-2 text-2xl text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {forecast[0].precipitation}mm
              </span>
            </div>
            <div className="flex items-center">
              <WiStrongWind className="mr-2 text-2xl text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {forecast[0].windspeed}km/h
              </span>
            </div>
          </div>
        )}
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          Toca para ver detalles completos →
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-4">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Pronóstico en {location || "tu ubicación"}
      </h3>

      {/* Tarjetas por Día */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {forecast.map((day) => (
          <div
            key={day.date.toISOString()}
            className="p-4 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-700"
          >
            <h4 className="font-semibold mb-2 text-lg text-gray-800 dark:text-white">
              {format(day.date, "EEE dd", { locale: es })}
            </h4>
            <div className="flex items-center mb-1">
              <WiThermometer className="mr-2 text-xl text-orange-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {day.max}°C / {day.min}°C
              </span>
            </div>
            <div className="flex items-center mb-1">
              <WiRain className="mr-2 text-xl text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {day.precipitation} mm
              </span>
            </div>
            <div className="flex items-center">
              <WiStrongWind className="mr-2 text-xl text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {day.windspeed} km/h
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={forecast}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="tempMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff7300" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="tempMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#387908" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#387908" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(date, "EEE dd", { locale: es })}
              tick={{ fill: "#6b7280" }}
            />
            
            <YAxis
              yAxisId="left"
              tick={{ fill: "#6b7280" }}
              label={{
                value: "Temperatura (°C)",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
              }}
            />
            
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#6b7280" }}
              label={{
                value: "Precipitación (mm) / Viento (km/h)",
                angle: -90,
                position: "insideRight",
                fill: "#6b7280",
              }}
            />
            
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelFormatter={(value) =>
                format(value, "EEEE, dd MMMM", { locale: es })
              }
            />
            
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="max"
              stroke="url(#tempMax)"
              name="Temp. Máx"
              strokeWidth={2}
            />
            
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="min"
              stroke="url(#tempMin)"
              name="Temp. Mín"
              strokeWidth={2}
            />
            
            <Bar
              yAxisId="right"
              dataKey="precipitation"
              barSize={20}
              fill="#8884d8"
              name="Precipitación"
            />
            
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="windspeed"
              stroke="#0000ff"
              name="Viento"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherWidget;