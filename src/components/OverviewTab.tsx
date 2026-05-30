"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FolderKanban, CheckSquare, Users, TrendingUp } from "lucide-react"
import { Project, Task, TeamMember } from "@/lib/store"

interface Props {
  projects: Project[]
  tasks: Task[]
  members: TeamMember[]
}

export function OverviewTab({ projects, tasks, members }: Props) {
  // ── Metrics computed from live data ──────────────────────────────────────
  const totalProjects = projects.length
  const completedTasks = tasks.filter(t => t.status === "Completado").length
  const totalTasks = tasks.length
  const activeMembers = members.filter(m => m.isActive).length
  const avgProgress = totalProjects === 0
    ? 0
    : Math.round(projects.reduce((s, p) => s + p.progress, 0) / totalProjects)

  const recentActivity = [
    ...tasks.map(t => ({
      user: members.find(m => m.userId === t.userId)?.name ?? "Sin asignar",
      action: t.status === "Completado" ? "completó" : "actualizó",
      item: t.description,
      time: t.dateline,
    })),
  ].slice(0, 5)

  const stats = [
    {
      label: "Total Proyectos",
      value: totalProjects,
      sub: `${projects.filter(p => p.status === "En progreso").length} en progreso`,
      icon: FolderKanban,
    },
    {
      label: "Tareas Completadas",
      value: `${completedTasks}/${totalTasks}`,
      sub: totalTasks ? `${Math.round((completedTasks / totalTasks) * 100)}% completado` : "Sin tareas",
      icon: CheckSquare,
    },
    {
      label: "Progreso Promedio",
      value: `${avgProgress}%`,
      sub: "de todos los proyectos",
      icon: TrendingUp,
    },
    {
      label: "Miembros Activos",
      value: activeMembers,
      sub: `de ${members.length} en total`,
      icon: Users,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.label} className="rounded-3xl border border-border/70 bg-card/90 shadow-lg shadow-slate-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects progress summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de proyectos</CardTitle>
            <CardDescription>Distribución por estado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["En progreso", "Planificado", "En revisión", "Completado"] as const).map(status => {
              const count = projects.filter(p => p.status === status).length
              const pct = totalProjects ? Math.round((count / totalProjects) * 100) : 0
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{status}</span>
                    <span className="font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actualizaciones de tareas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin actividad reciente.</p>
              )}
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{a.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{a.user}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {a.action} <span className="font-medium">"{a.item}"</span>
                    </p>
                  </div>
                  {a.time && (
                    <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Tareas por prioridad</CardTitle>
          <CardDescription>Vista rápida del estado de tareas urgentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["Urgente", "Alta", "Media", "Baja"] as const).map(p => {
              const count = tasks.filter(t => t.priority === p).length
              const done = tasks.filter(t => t.priority === p && t.status === "Completado").length
              const colors: Record<string, string> = {
                Urgente: "border-red-200 bg-red-50",
                Alta: "border-orange-200 bg-orange-50",
                Media: "border-yellow-200 bg-yellow-50",
                Baja: "border-green-200 bg-green-50",
              }
              return (
                <div key={p} className={`p-4 rounded-lg border ${colors[p]}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1">{p}</p>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{done} completadas</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}