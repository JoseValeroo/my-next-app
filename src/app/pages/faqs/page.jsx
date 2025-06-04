'use client';
import BackButton from "@/components/ui/BackButton"; // Ajusta la ruta según tu estructura de carpetas

export default function FAQsPage() {
  const faqs = [
    {
      question: "¿Qué es The View Island?",
      answer: "The View Island es una plataforma que ofrece artículos seleccionados, editoriales y opiniones sobre diversos temas como eventos mundiales, negocios y estilo de vida."
    },
    {
      question: "¿Cómo me suscribo?",
      answer: "Puedes suscribirte haciendo clic en el botón 'Suscribirse por 2,50 €' en la parte superior. Sigue las instrucciones en pantalla para completar tu suscripción."
    },
    {
      question: "¿Puedo acceder al contenido de forma gratuita?",
      answer: "Parte del contenido es gratuito, pero los artículos y funciones exclusivas requieren una suscripción."
    },
    {
      question: "¿Cómo contacto con el soporte?",
      answer: "Para soporte, por favor escríbenos a support@lure.com o visita la página de 'Contacto'."
    },
    {
      question: "¿Mi suscripción es reembolsable?",
      answer: "Las suscripciones no son reembolsables. Sin embargo, puedes cancelarla en cualquier momento para evitar futuros cargos."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto p-6">
        <BackButton href="/" />
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Preguntas frecuentes</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border bg-gray-100 p-4 dark:bg-gray-900 border-gray-300 dark:border-gray-800"
            >
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h2>
              <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
