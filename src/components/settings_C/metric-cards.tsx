import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: number
  isPositive?: boolean
}

function MetricCard({ title, value, change, isPositive = true }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />}
            {Math.abs(change)}%
          </span>{" "}
          comparado con mes anterior
        </p>
      </CardContent>
    </Card>
  )
}

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Total Orders" value="658" change={2.5} />
      <MetricCard title="Total Revenue" value="$948.55" change={-15.5} isPositive={false} />
      <MetricCard title="Total Customers" value="12,946" change={7.2} />
      <MetricCard title="Total Return" value="987" change={10.4} isPositive={false} />
    </div>
  )
}

