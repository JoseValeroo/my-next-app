'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface Pair {
  base: string;
  quote: string;
  value: number;
  change: number;
}

interface CurrencyCardProps {
  pair: Pair;
}

const cacheKey = "currencyDataCache";

async function fetchWithCache(url: string, cacheDuration = 600000) {
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    const { timestamp, data } = JSON.parse(cachedData);
    if (Date.now() - timestamp < cacheDuration) {
      return data;
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
    return data;
  } catch (error) {
    console.warn("Error al obtener datos de la API, usando valores dummy.");
    return { prices: Array(7).fill([Date.now(), Math.random() * 100]) };
  }
}

export function CurrencyCard({ pair }: CurrencyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Evitar ejecución en SSR
  
    async function fetchChartData() {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${pair.base.toLowerCase()}/market_chart?vs_currency=${pair.quote.toLowerCase()}&days=7`;
        const data = await fetchWithCache(url);
        if (!data.prices) throw new Error("No hay datos disponibles.");
        
        setChartData({
          labels: data.prices.map((point: [number, number]) => new Date(point[0]).toLocaleDateString()),
          datasets: [{ label: `${pair.base}/${pair.quote} Precio`, data: data.prices.map((point) => point[1]) }]
        });
      } catch (error: any) {
        console.error("Error al cargar datos del gráfico:", error.message);
        setError(`No se pudo obtener datos para ${pair.base}/${pair.quote}.`);
      }
    }
  
    fetchChartData();
  }, [pair.base, pair.quote]);
  

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      layout
      className="relative cursor-pointer rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
      whileHover={{ scale: 1.02 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-900"
              layoutId={`currency-${pair.base}-${pair.quote}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {pair.base}/{pair.quote}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pair.change.toFixed(4)}
                  </p>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="h-64 w-full">
                {chartData ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <p className="text-center text-gray-500">Cargando gráfico...</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pair.base}/{pair.quote}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {pair.value.toFixed(1)}%
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {pair.change.toFixed(4)}
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500">Cargando gráfico...</p>
        )}
      </div>
    </motion.div>
  );
}
