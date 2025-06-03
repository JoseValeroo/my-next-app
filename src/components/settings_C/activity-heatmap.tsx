

"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/settings_C/tooltip";
import { fetchUserActivity } from "@/server/service/userService";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityCellProps {
  date: string;
  count: number;
}

function ActivityCell({ date, count }: ActivityCellProps) {
  const getActivityColor = (count: number) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-800";
    if (count <= 3) return "bg-blue-200 dark:bg-blue-900";
    if (count <= 6) return "bg-blue-400 dark:bg-blue-700";
    return "bg-blue-600 dark:bg-blue-500";
  };

  return (
    <div className="flex flex-col items-center gap-1 w-10 sm:w-12">
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-md ${getActivityColor(count)}`}
            data-date={date}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {count} actividades
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(date), "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </TooltipContent>
      </Tooltip>
      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
        {format(new Date(date), 'd')}
      </span>
    </div>
  );
}

function StatsHeader({ activityData }: { activityData: ActivityData[] }) {
  const total = activityData.reduce((sum, day) => sum + day.count, 0);
  const average = (total / activityData.length).toFixed(1);
  const max = Math.max(...activityData.map(day => day.count));
  const activeDays = activityData.filter(day => day.count > 0).length;
  const consistency = ((activeDays / activityData.length) * 100).toFixed(0);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-4">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {format(new Date(), "MMMM yyyy", { locale: es })}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {activityData.length} días registrados
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{total}</p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
        </div>
        <div>
          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{average}</p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Promedio/día</p>
        </div>
        <div>
          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{max}</p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Máximo</p>
        </div>
        <div>
          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{consistency}%</p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Consistencia</p>
        </div>
      </div>
    </div>
  );
}

function ColorLegend() {
  return (
    <div className="flex flex-wrap gap-4 mt-8 justify-center text-sm px-4">
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded-sm" />
        <span>Sin actividad</span>
      </div>
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="h-4 w-4 bg-blue-200 dark:bg-blue-900 rounded-sm" />
        <span>Baja (1-3)</span>
      </div>
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="h-4 w-4 bg-blue-400 dark:bg-blue-700 rounded-sm" />
        <span>Media (4-6)</span>
      </div>
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <div className="h-4 w-4 bg-blue-600 dark:bg-blue-500 rounded-sm" />
        <span>Alta (7+)</span>
      </div>
    </div>
  );
}

export function ActivityHeatmap() {
  const { data: activityData, error, isLoading } = useQuery<ActivityData[]>({
  queryKey: ['userActivity'],
  queryFn: fetchUserActivity,
});

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Detectar sesión no iniciada
  const noSession = Boolean(error);

  // Generar datos vacíos si no hay sesión, o usar datos reales si hay
  const dataToUse: ActivityData[] = noSession
    ? allDays.map(d => ({ date: format(d, 'yyyy-MM-dd'), count: 0 }))
    : (activityData || []);

  if (!activityData && !error) return <div className="p-4 text-center">Cargando actividad...</div>;

  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardContent className="pt-6">
        {/* Estadísticas */}
        <StatsHeader activityData={dataToUse} />

        {/* Mensaje de no sesión si aplica */}
        {noSession ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No estás iniciado sesión. Inicia sesión para ver tu actividad.
          </div>
        ) : (
          <TooltipProvider>
            <div className="flex flex-col gap-4 items-center">
              {/* Filas de días */}
              {Array.from({ length: 3 }).map((_, row) => {
                const start = row * Math.ceil(allDays.length / 3);
                const end = start + Math.ceil(allDays.length / 3);
                return (
                  <div key={row} className="flex gap-3 justify-center w-full overflow-x-auto px-4">
                    {allDays.slice(start, end).map(date => {
                      const dateString = format(date, 'yyyy-MM-dd');
                      const count = dataToUse.find(item => item.date === dateString)?.count || 0;
                      const isCurrentMonth = isSameMonth(date, today);
                      return (
                        <div key={dateString} className={`flex-shrink-0 ${!isCurrentMonth ? 'opacity-50' : ''}`}>
                          <ActivityCell date={dateString} count={count} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        )}

        {/* Leyenda */}
        <ColorLegend />
      </CardContent>
    </Card>
  );
}