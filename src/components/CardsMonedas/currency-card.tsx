'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from 'next-themes';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Pair {
  base: string;
  quote: string;
  value: number;
  change: number;
}

interface CurrencyCardProps {
  pair: Pair;
}

export function CurrencyCard({ pair }: CurrencyCardProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const fetchChartData = async () => {
      let retries = 3;

      while (retries > 0) {
        try {
          const url = `http://${process.env.NEXT_PUBLIC_IP_BACKEND}:${process.env.NEXT_PUBLIC_PORT_BACKEND}` +
            `/api/crypto/chart/${pair.base}/${pair.quote}`;
          const response = await fetch(url);

          const data = await response.json();

          console.log('📊 Datos recibidos del backend:', data);

          if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
          }

          if (!data || !data.prices || !Array.isArray(data.prices)) {
            throw new Error('Datos del gráfico no disponibles');
          }

          if (!isMounted) return;

          setChartData({
            labels: data.prices.map((p: [number, number]) =>
              format(new Date(p[0]), 'dd MMM', { locale: es })
            ),
            datasets: [
              {
                label: `${pair.base.toUpperCase()}/${pair.quote.toUpperCase()} Precio`,
                data: data.prices.map((p: [number, number]) => p[1]),
                borderColor: resolvedTheme === 'dark' ? '#ffffff' : '#3b82f6',
                backgroundColor:
                  resolvedTheme === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
                pointBackgroundColor: resolvedTheme === 'dark' ? '#ffffff' : '#3b82f6',
                pointBorderColor: resolvedTheme === 'dark' ? '#ffffff' : '#3b82f6',
                tension: 0.3,
              },
            ],
          });

          setError(null);
          return;
        } catch (err: any) {
          console.error('❌ Error al cargar datos del gráfico:', err);
          retries -= 1;
          if (retries === 0 && isMounted) {
            setError(err.message || 'Error desconocido');
          }
          await new Promise((res) => setTimeout(res, 2000));
        }
      }
    };

    fetchChartData().finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [pair.base, pair.quote, resolvedTheme]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: resolvedTheme === 'dark' ? '#d1d5db' : '#4b5563' },
      },
      y: {
        ticks: { color: resolvedTheme === 'dark' ? '#d1d5db' : '#4b5563' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <motion.div layout className="relative cursor-pointer rounded-lg bg-white dark:bg-gray-900 p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pair.base.toUpperCase()}/{pair.quote.toUpperCase()}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {pair.value.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        {loading && <p className="text-center text-gray-500">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {chartData && !loading && !error && (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </motion.div>
  );
}
