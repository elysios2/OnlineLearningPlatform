import { Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";

// Sample reading content for the test
const readingContents = [
  {
    content: `La lectura rápida es una habilidad que puede transformar la manera en que procesas información. A diferencia de la lectura tradicional, que consiste en leer palabra por palabra, la lectura rápida implica escanear visualmente bloques de texto para extraer las ideas principales de manera más eficiente.

Para dominar esta técnica, es importante comprender que nuestros ojos pueden captar más información de la que normalmente procesamos. El cerebro humano tiene la capacidad de procesar grupos de palabras simultáneamente, en lugar de palabras individuales.

Algunas técnicas fundamentales incluyen la expansión del campo visual, la reducción de la subvocalización (la voz interna que "pronuncia" las palabras mientras leemos), y el uso de un marcador o dedo para guiar los ojos a través del texto a un ritmo más rápido.

Con práctica regular, muchas personas pueden duplicar o incluso triplicar su velocidad de lectura, manteniendo o incluso mejorando su nivel de comprensión. Esto se debe a que al leer más rápido, el cerebro se mantiene más enfocado y menos propenso a distraerse.

La lectura rápida no es solo sobre velocidad. También se trata de desarrollar mejores estrategias para filtrar y organizar la información, decidiendo qué partes necesitan más atención y cuáles pueden ser revisadas más rápidamente.

Los lectores avanzados aprenden a ajustar su velocidad según el tipo de material. Por ejemplo, un texto técnico complejo puede requerir una lectura más lenta y detallada, mientras que un artículo de noticias puede ser escaneado rápidamente para extraer los puntos clave.

Al dominar estas técnicas, no solo ahorrarás tiempo valioso, sino que también mejorarás tu capacidad para procesar y retener información, una habilidad invaluable en la era de la sobrecarga informativa en la que vivimos.`,
    wordCount: 290,
    questions: [
      {
        id: 1,
        text: "¿Cuál es la principal diferencia entre la lectura tradicional y la lectura rápida?",
        options: [
          { id: 1, text: "La lectura tradicional requiere concentración, la rápida no" },
          { id: 2, text: "La lectura rápida se enfoca en leer palabra por palabra" },
          { id: 3, text: "La lectura rápida implica escanear bloques de texto en lugar de palabras individuales" },
          { id: 4, text: "La lectura tradicional es más efectiva para la comprensión" }
        ],
        correctOptionId: 3
      },
      {
        id: 2,
        text: "¿Qué es la subvocalización en el contexto de la lectura?",
        options: [
          { id: 1, text: "Leer en voz alta" },
          { id: 2, text: "La voz interna que pronuncia las palabras mientras leemos" },
          { id: 3, text: "Hablar mientras se lee" },
          { id: 4, text: "Pronunciar solo las palabras difíciles" }
        ],
        correctOptionId: 2
      },
      {
        id: 3,
        text: "Según el texto, los lectores avanzados:",
        options: [
          { id: 1, text: "Leen todo al mismo ritmo" },
          { id: 2, text: "Solo leen material simple" },
          { id: 3, text: "Ajustan su velocidad según el tipo de material" },
          { id: 4, text: "Prefieren la lectura tradicional para textos complejos" }
        ],
        correctOptionId: 3
      },
      {
        id: 4,
        text: "¿Qué beneficio adicional ofrece la lectura rápida además de ahorrar tiempo?",
        options: [
          { id: 1, text: "Mejora la capacidad de procesar y retener información" },
          { id: 2, text: "Reduce la necesidad de releer material" },
          { id: 3, text: "Elimina la necesidad de tomar notas" },
          { id: 4, text: "Permite leer varios textos simultáneamente" }
        ],
        correctOptionId: 1
      },
      {
        id: 5,
        text: "¿Por qué la lectura rápida puede mejorar la comprensión según el texto?",
        options: [
          { id: 1, text: "Porque se lee menos contenido" },
          { id: 2, text: "Porque el cerebro se mantiene más enfocado y menos distraído" },
          { id: 3, text: "Porque se omiten las partes difíciles" },
          { id: 4, text: "Porque se lee principalmente títulos y subtítulos" }
        ],
        correctOptionId: 2
      }
    ]
  },
  {
    content: `La memoria y la retención de información son habilidades fundamentales que pueden desarrollarse y mejorarse con técnicas específicas. A diferencia de lo que muchos creen, la memoria excepcional no es simplemente un don innato, sino el resultado de prácticas estratégicas y consistentes.

Una de las técnicas más efectivas es la asociación, que consiste en conectar nueva información con conocimientos existentes. Nuestro cerebro almacena datos a través de redes de conexiones neuronales, y al crear asociaciones significativas, facilitamos tanto el almacenamiento como la recuperación de esa información.

El método del palacio de la memoria, también conocido como técnica de loci, aprovecha nuestra memoria espacial natural. Consiste en visualizar un lugar familiar (como tu casa) y ubicar mentalmente la información que deseas recordar en diferentes ubicaciones. Cuando necesitas recuperar esa información, simplemente recorres mentalmente ese espacio.

La repetición espaciada es otra estrategia basada en la evidencia científica. En lugar de repasar información repetidamente en una sola sesión, es más efectivo espaciar las revisiones a lo largo del tiempo, aumentando gradualmente los intervalos entre cada repaso.

La técnica Pomodoro, que alterna períodos de estudio intenso con breves descansos, ayuda a mantener la concentración y mejorar la asimilación. Estudios han demostrado que estos intervalos de descanso son cruciales para la consolidación de la memoria.

La comprensión profunda, más allá de la memorización superficial, es esencial para la retención a largo plazo. Cuando entendemos verdaderamente un concepto, creamos múltiples vías neuronales para acceder a esa información, lo que facilita su recuperación futura.

Finalmente, el descanso adecuado y una buena nutrición son fundamentales. El sueño juega un papel crucial en la consolidación de la memoria, mientras que ciertos nutrientes como los ácidos grasos omega-3 y los antioxidantes contribuyen a la salud cerebral y cognitiva.`,
    wordCount: 298,
    questions: [
      {
        id: 1,
        text: "Según el texto, la memoria excepcional es principalmente:",
        options: [
          { id: 1, text: "Un don innato que solo algunos poseen" },
          { id: 2, text: "El resultado de prácticas estratégicas y consistentes" },
          { id: 3, text: "Imposible de desarrollar después de cierta edad" },
          { id: 4, text: "Dependiente de factores genéticos únicamente" }
        ],
        correctOptionId: 2
      },
      {
        id: 2,
        text: "¿Qué es el método del palacio de la memoria?",
        options: [
          { id: 1, text: "Memorizar mientras se camina por un palacio" },
          { id: 2, text: "Usar imágenes de edificios famosos para recordar" },
          { id: 3, text: "Visualizar un lugar familiar y ubicar información en diferentes ubicaciones" },
          { id: 4, text: "Construir modelos mentales de palacios elaborados" }
        ],
        correctOptionId: 3
      },
      {
        id: 3,
        text: "¿En qué consiste la técnica de repetición espaciada?",
        options: [
          { id: 1, text: "Repasar información repetidamente en una sola sesión" },
          { id: 2, text: "Estudiar en diferentes espacios físicos" },
          { id: 3, text: "Revisar información aumentando gradualmente los intervalos entre repasos" },
          { id: 4, text: "Utilizar gráficos espaciales para organizar información" }
        ],
        correctOptionId: 3
      },
      {
        id: 4,
        text: "¿Qué papel juega el sueño en la memoria según el texto?",
        options: [
          { id: 1, text: "No tiene ningún efecto significativo" },
          { id: 2, text: "Es perjudicial para la memoria a corto plazo" },
          { id: 3, text: "Es crucial para la consolidación de la memoria" },
          { id: 4, text: "Solo ayuda a recordar experiencias emocionales" }
        ],
        correctOptionId: 3
      },
      {
        id: 5,
        text: "¿Por qué la comprensión profunda es importante para la retención a largo plazo?",
        options: [
          { id: 1, text: "Porque crea múltiples vías neuronales para acceder a la información" },
          { id: 2, text: "Porque requiere menos repetición" },
          { id: 3, text: "Porque es más fácil de lograr que la memorización" },
          { id: 4, text: "Porque consume menos energía cerebral" }
        ],
        correctOptionId: 1
      }
    ]
  }
];

// Validation schema for answers submission
const answersSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number(),
      answerId: z.number(),
    })
  ),
});

// Get reading content for the test
const getReadingContent = async (req: Request, res: Response) => {
  try {
    // Select a random reading content
    const randomIndex = Math.floor(Math.random() * readingContents.length);
    const selectedContent = readingContents[randomIndex];
    
    return res.json({
      content: selectedContent.content,
      wordCount: selectedContent.wordCount
    });
  } catch (error: any) {
    console.error("Error getting reading content:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get questions for the current reading
const getQuestions = async (req: Request, res: Response) => {
  try {
    // In a real implementation, we would track which content was shown
    // For this demo, just return questions from the first content
    const selectedContent = readingContents[0];
    
    // Format questions to not include the correct answer
    const formattedQuestions = selectedContent.questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options.map(o => ({
        id: o.id,
        text: o.text
      }))
    }));
    
    return res.json(formattedQuestions);
  } catch (error: any) {
    console.error("Error getting questions:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Initialize a reading test
const initTest = async (req: Request, res: Response) => {
  try {
    const { wordsPerMinute } = req.body;
    if (typeof wordsPerMinute !== 'number' || wordsPerMinute <= 0) {
      return res.status(400).json({ message: "Invalid words per minute value" });
    }

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new reading test
    const newTest = await storage.createReadingTest({
      userId: user.id,
      wordsPerMinute,
      comprehensionScore: 0, // Will be updated after answering questions
      questions: JSON.stringify({
        contentIndex: 0, // For simplicity, using the first content
        answers: []
      })
    });

    return res.json({ testId: newTest.id });
  } catch (error: any) {
    console.error("Error initializing test:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit answers for a reading test
const submitAnswers = async (req: Request, res: Response) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    // Validate answers
    const validation = answersSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid answers format", errors: validation.error });
    }

    const { answers } = validation.data;

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the reading test
    const test = await storage.getReadingTest(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Check if the test belongs to the user
    if (test.userId !== user.id) {
      return res.status(403).json({ message: "Not authorized to submit answers for this test" });
    }

    // For simplicity, we're using the first content
    const contentIndex = 0;
    const selectedContent = readingContents[contentIndex];

    // Calculate the comprehension score
    let correctAnswers = 0;
    
    answers.forEach(answer => {
      const question = selectedContent.questions.find(q => q.id === answer.questionId);
      if (question && question.correctOptionId === answer.answerId) {
        correctAnswers++;
      }
    });

    const comprehensionScore = Math.round((correctAnswers / selectedContent.questions.length) * 100);

    // Update the test with the comprehension score
    const updatedTest = await storage.updateReadingTest(testId, {
      comprehensionScore,
      questions: JSON.stringify({
        contentIndex,
        answers
      }),
      recommendations: generateRecommendations(test.wordsPerMinute, comprehensionScore)
    });

    if (!updatedTest) {
      return res.status(500).json({ message: "Failed to update test" });
    }

    return res.json({
      testId: updatedTest.id,
      wordsPerMinute: updatedTest.wordsPerMinute,
      comprehensionScore: updatedTest.comprehensionScore
    });
  } catch (error: any) {
    console.error("Error submitting answers:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get the result of a reading test
const getTestResult = async (req: Request, res: Response) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the reading test
    const test = await storage.getReadingTest(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Check if the test belongs to the user
    if (test.userId !== user.id) {
      return res.status(403).json({ message: "Not authorized to view this test" });
    }

    // Parse the questions JSON
    const questionsData = JSON.parse(test.questions as string);
    const contentIndex = questionsData.contentIndex || 0;
    const userAnswers = questionsData.answers || [];
    
    // Get the content used for this test
    const selectedContent = readingContents[contentIndex];
    
    // Format the question results
    const questionResults = userAnswers.map((answer: { questionId: number, answerId: number }) => {
      const question = selectedContent.questions.find(q => q.id === answer.questionId);
      if (!question) return null;
      
      const userAnswerOption = question.options.find(o => o.id === answer.answerId);
      const correctAnswerOption = question.options.find(o => o.id === question.correctOptionId);
      
      return {
        question: question.text,
        correct: question.correctOptionId === answer.answerId,
        userAnswer: userAnswerOption?.text || "No answer",
        correctAnswer: correctAnswerOption?.text || "Unknown"
      };
    }).filter(Boolean);

    return res.json({
      id: test.id,
      userId: test.userId,
      wordsPerMinute: test.wordsPerMinute,
      comprehensionScore: test.comprehensionScore,
      dateCompleted: test.dateCompleted,
      recommendations: test.recommendations,
      questionResults
    });
  } catch (error: any) {
    console.error("Error getting test result:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get the user's reading tests
const getUserTests = async (req: Request, res: Response) => {
  try {
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the user's tests
    const tests = await storage.getUserReadingTests(user.id);
    
    return res.json(tests);
  } catch (error: any) {
    console.error("Error getting user tests:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to generate personalized recommendations
function generateRecommendations(wordsPerMinute: number, comprehensionScore: number): string {
  let recommendations = "";

  // Reading speed recommendations
  if (wordsPerMinute < 150) {
    recommendations += "Tu velocidad de lectura está por debajo del promedio. Recomendamos comenzar con nuestro curso 'Fundamentos de Lectura Veloz' para mejorar tu velocidad base.\n\n";
  } else if (wordsPerMinute < 300) {
    recommendations += "Tu velocidad de lectura está cerca del promedio. Considera el curso 'Técnicas Intermedias de Lectura Rápida' para seguir mejorando.\n\n";
  } else if (wordsPerMinute < 500) {
    recommendations += "¡Tienes una buena velocidad de lectura! Para alcanzar niveles avanzados, te recomendamos nuestro curso 'Lectura Veloz - Nivel Avanzado'.\n\n";
  } else {
    recommendations += "¡Excelente velocidad de lectura! Ya estás en un nivel avanzado. Considera el curso 'Técnicas de Lectura Fotográfica' para llevar tus habilidades al siguiente nivel.\n\n";
  }

  // Comprehension recommendations
  if (comprehensionScore < 40) {
    recommendations += "Tu nivel de comprensión necesita mejora. Te sugerimos practicar con textos más simples y gradualmente aumentar la complejidad. El curso 'Fundamentos de Comprensión Lectora' podría ayudarte.\n\n";
  } else if (comprehensionScore < 70) {
    recommendations += "Tu comprensión es moderada. Practica técnicas de lectura activa y considera nuestro curso 'Mejora tu Comprensión y Retención'.\n\n";
  } else if (comprehensionScore < 90) {
    recommendations += "Tienes buena comprensión lectora. Para mejorar aún más, enfócate en técnicas de análisis crítico y síntesis de información.\n\n";
  } else {
    recommendations += "¡Excelente comprensión lectora! Continúa practicando con textos de mayor complejidad para mantener tus habilidades.\n\n";
  }

  // Balance between speed and comprehension
  if (wordsPerMinute > 300 && comprehensionScore < 50) {
    recommendations += "Nota: Tu velocidad es alta pero la comprensión es baja. Considera reducir ligeramente la velocidad para mejorar la comprensión.\n\n";
  } else if (wordsPerMinute < 200 && comprehensionScore > 90) {
    recommendations += "Nota: Tu comprensión es excelente pero podrías mejorar tu velocidad. Intenta leer progresivamente más rápido mientras mantienes tu nivel de comprensión.\n\n";
  }

  // General recommendations
  recommendations += "Recomendaciones generales:\n";
  recommendations += "- Practica regularmente, idealmente 15-20 minutos diarios.\n";
  recommendations += "- Usa un marcador o tu dedo para guiar tu vista por el texto.\n";
  recommendations += "- Intenta reducir la subvocalización (la voz interna que 'pronuncia' las palabras).\n";
  recommendations += "- Amplía gradualmente tu campo visual para captar más palabras en cada fijación.";

  return recommendations;
}

export default {
  getReadingContent,
  getQuestions,
  initTest,
  submitAnswers,
  getTestResult,
  getUserTests
};
