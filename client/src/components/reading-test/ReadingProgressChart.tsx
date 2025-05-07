import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedProgress } from "@/components/ui/animated-progress";

interface ReadingProgressChartProps {
  wordsPerMinute: number;
  comprehensionScore: number;
  testHistory?: Array<{
    date: string | Date;
    wordsPerMinute: number;
    comprehensionScore: number;
  }>;
  showHistory?: boolean;
}

export const ReadingProgressChart = ({
  wordsPerMinute,
  comprehensionScore,
  testHistory = [],
  showHistory = true,
}: ReadingProgressChartProps) => {
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    // Delay the animation to allow the component to render first
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Format history data for the chart
  const chartData = testHistory.slice(0, 5).map(test => ({
    date: typeof test.date === 'string' 
      ? new Date(test.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
      : test.date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    velocidad: test.wordsPerMinute,
    comprensión: test.comprehensionScore,
  })).reverse();

  // Calculate reading level based on WPM
  const getReadingLevel = (wpm: number) => {
    if (wpm < 150) return { level: "Principiante", color: "#94A3B8" };
    if (wpm < 300) return { level: "Intermedio", color: "#FFA500" };
    if (wpm < 500) return { level: "Avanzado", color: "#FF8000" };
    return { level: "Experto", color: "#E67300" };
  };
  
  const readingLevel = getReadingLevel(wordsPerMinute);
  
  // Normalize WPM for progress display (max 700 WPM)
  const normalizedWpm = Math.min((wordsPerMinute / 700) * 100, 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Progreso de Lectura</CardTitle>
        <CardDescription>Estadísticas de rendimiento lector</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Reading Speed Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Velocidad de Lectura</h4>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-orange-main text-white text-sm font-medium px-2 py-1 rounded-full"
              >
                {wordsPerMinute} PPM
              </motion.div>
            </div>
            
            <AnimatedProgress 
              value={normalizedWpm} 
              size="md" 
              color="#FF8000"
              className="mb-2"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500">Nivel: </span>
              <span className="font-medium" style={{ color: readingLevel.color }}>
                {readingLevel.level}
              </span>
            </motion.div>
          </div>
          
          {/* Comprehension Score Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Comprensión</h4>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-orange-secondary text-white text-sm font-medium px-2 py-1 rounded-full"
              >
                {comprehensionScore}%
              </motion.div>
            </div>
            
            <AnimatedProgress 
              value={comprehensionScore} 
              size="md" 
              color="#FFA500"
              className="mb-2"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500">Calificación: </span>
              <span className="font-medium text-orange-secondary">
                {comprehensionScore >= 90 ? 'Excelente' : 
                 comprehensionScore >= 75 ? 'Muy buena' : 
                 comprehensionScore >= 60 ? 'Buena' : 
                 comprehensionScore >= 40 ? 'Regular' : 'Necesita mejora'}
              </span>
            </motion.div>
          </div>
          
          {/* Reading History Section */}
          {showHistory && testHistory.length > 1 && (
            <div className="mt-8 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium mb-4">Historial de Progreso</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis yAxisId="left" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="velocidad" 
                      name="Velocidad (PPM)" 
                      fill="#FF8000" 
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={animateChart ? 1500 : 0}
                      isAnimationActive={animateChart}
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="comprensión" 
                      name="Comprensión (%)" 
                      fill="#FFA500" 
                      radius={[4, 4, 0, 0]}
                      animationBegin={300}
                      animationDuration={animateChart ? 1500 : 0}
                      isAnimationActive={animateChart}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingProgressChart;