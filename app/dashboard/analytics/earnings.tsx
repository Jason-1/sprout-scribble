"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TotalOrders } from "@/lib/infer-types";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { weeklyChart } from "./weekly-chart";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { monthlyChart } from "./monthly-chart";

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "week";

  const chartItems = totalOrders.map((order) => ({
    date: order.order.created!,
    revenue: order.order.total,
    profit: order.order.total - order.product.purchasePrice * order.quantity,
  }));

  const activeChart = useMemo(() => {
    const weekly = weeklyChart(chartItems);
    const monthly = monthlyChart(chartItems);
    if (filter === "week") {
      return weekly;
    }
    if (filter === "month") {
      return monthly;
    }
  }, [filter]);

  const activeTotal = useMemo(() => {
    if (filter === "month") {
      return monthlyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    }
    return weeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0);
  }, [filter]);

  const activeProfit = useMemo(() => {
    if (filter === "month") {
      return monthlyChart(chartItems).reduce(
        (acc, item) => acc + item.profit,
        0
      );
    }
    return weeklyChart(chartItems).reduce((acc, item) => acc + item.profit, 0);
  }, [filter]);

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>
          Your Revenue: ${activeTotal}
          Your Profit: ${activeProfit}
        </CardTitle>
        <CardDescription>History of your recent earnings</CardDescription>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=week", {
                scroll: false,
              })
            }
          >
            This week
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "month" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=month", {
                scroll: false,
              })
            }
          >
            This Month
          </Badge>
        </div>
        <CardContent className="h-96">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart data={activeChart}>
              <Tooltip
                content={(props) => (
                  <div>
                    {props.payload?.map((item) => {
                      return (
                        <div
                          className="bg-primary py-2 px-4 rounded-md shadow-lg"
                          key={item.payload.date}
                        >
                          <p>Revenue: ${item.value}</p>
                          <p>Profit: ${item.payload.profit}</p>
                          <p>Date: {item.payload.date}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
              <Bar dataKey="revenue" className="fill-primary" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
