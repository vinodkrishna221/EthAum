"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const upvotesData = [
    { name: "Jan", total: 120 },
    { name: "Feb", total: 160 },
    { name: "Mar", total: 240 },
    { name: "Apr", total: 190 },
    { name: "May", total: 320 },
    { name: "Jun", total: 450 },
    { name: "Jul", total: 510 },
]

const engagementData = [
    { name: "Jan", views: 400, inquiries: 24 },
    { name: "Feb", views: 300, inquiries: 13 },
    { name: "Mar", views: 500, inquiries: 38 },
    { name: "Apr", views: 780, inquiries: 50 },
    { name: "May", views: 690, inquiries: 43 },
    { name: "Jun", views: 900, inquiries: 75 },
]

export function OverviewChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={upvotesData}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-slate-500 dark:text-slate-400">
                                                Total
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-slate-50">
                                                {payload[0].value}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export function EngagementChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={engagementData}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `${value}`}
                />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="inquiries" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}
