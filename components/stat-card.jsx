import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatCard({ title, value, description, icon, trend }) {
  return (
    
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={`mt-1 text-xs ${trend.isPositive ? "text-success" : "text-destructive"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
