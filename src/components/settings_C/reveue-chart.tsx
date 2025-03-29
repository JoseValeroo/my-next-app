"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", revenue: 1000 },
  { month: "Feb", revenue: 2000 },
  { month: "Mar", revenue: 1500 },
  { month: "Apr", revenue: 3000 },
  { month: "May", revenue: 2500 },
  { month: "Jun", revenue: 4000 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Ingresos por producto</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Bar
              dataKey="revenue"
              fill="currentColor"
              className="fill-primary"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

