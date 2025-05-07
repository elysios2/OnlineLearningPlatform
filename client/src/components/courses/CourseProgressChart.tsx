import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedProgress } from "@/components/ui/animated-progress";

interface CourseProgressChartProps {
  progress: number;
  remainingModules?: number;
  completedModules?: number;
  courseTitle: string;
  estimatedTimeToComplete?: number;
  lastActivity?: Date;
  showDetailedStats?: boolean;
}

export const CourseProgressChart = ({
  progress = 0,
  remainingModules = 3,
  completedModules = 1,
  courseTitle,
  estimatedTimeToComplete = 240,
  lastActivity,
  showDetailedStats = true,
}: CourseProgressChartProps) => {
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    // Delay the animation to allow the component to render first
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate estimated time remaining in hours
  const timeRemaining = Math.round((estimatedTimeToComplete * (100 - progress)) / 100);
  
  // Data for pie chart
  const data = [
    { name: "Completado", value: progress, color: "#FF8000" },
    { name: "Restante", value: 100 - progress, color: "#E5E7EB" },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Progreso del Curso</CardTitle>
        <CardDescription>{courseTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column: Circular progress chart */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    animationBegin={0}
                    animationDuration={animateChart ? 1500 : 0}
                    isAnimationActive={animateChart}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Progreso']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-3xl font-bold text-orange-main"
                >
                  {progress}%
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-sm text-gray-500"
                >
                  completado
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right column: Stats and linear progress */}
          <div className="space-y-6">
            <div>
              <AnimatedProgress 
                value={progress} 
                showValue 
                label="Progreso total" 
                color="#FF8000"
                size="lg"
              />
            </div>
            
            {showDetailedStats && (
              <>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-2xl font-bold text-orange-main"
                    >
                      {completedModules}
                    </motion.div>
                    <div className="text-xs text-gray-500">Módulos completados</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="text-2xl font-bold text-gray-700"
                    >
                      {remainingModules}
                    </motion.div>
                    <div className="text-xs text-gray-500">Módulos restantes</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Tiempo estimado restante</div>
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ delay: 1, duration: 0.7 }}
                    className="flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-main mr-2">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg font-semibold">
                      {timeRemaining} min
                    </span>
                  </motion.div>
                </div>
                {lastActivity && (
                  <div className="text-xs text-gray-500">
                    Última actividad: {lastActivity.toLocaleDateString()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgressChart;