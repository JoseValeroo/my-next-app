'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  const plans = [
    {
      name: "Mensual",
      price: "9.99",
      features: [
        "Todo el contenido original de Lure",
        "Disponible en la app de Lure",
        "Comparte con tu familia"
      ],
    },
    {
      name: "Anual",
      price: "19.99",
      features: [
        "Todo el contenido original de Lure",
        "Disponible en la app de Lure",
        "Comparte con tu familia",
        "Ahorra con el plan anual"
      ],
    },
    {
      name: "Premium",
      price: "29.99",
      features: [
        "Todo el contenido original de Lure",
        "Disponible en la app de Lure",
        "Comparte con tu familia",
        "Calidad 4K HDR",
        "Descargas sin conexión"
      ],
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-100 to-gray-400 dark:from-gray-950 dark:to-gray-800 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-4xl text-gray-900 dark:text-gray-300 font-bold md:text-5xl"
        >
          Choose Your Plan
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="relative overflow-hidden border-gray-800 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white backdrop-blur-xl">
                <CardHeader className="space-y-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300">{plan.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-300">${plan.price}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="text-center text-gray-700 dark:text-gray-300">
                      {feature}
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-white text-gray-700 hover:bg-blue-300 dark:hover:bg-blue-700">
                    Try It Free
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

