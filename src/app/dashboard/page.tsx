"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Data & types
import {
  initialProjects, initialMembers, initialTasks, initialSettings,
  Project, TeamMember, Task, AppSettings,
} from "@/lib/store"

// Tab components
import { OverviewTab }  from "@/components/OverviewTab"
import { ProjectsTab } from "@/components/ProjectsTab"
import { ProjectForm }  from "@/components/ProjectForm"
import { TeamTab }      from "@/components/TeamTab"
import { TasksTab }     from "@/components/TasksTab"
import { SettingsTab }  from "@/components/SettingsTab"

export default function DashboardPage() {
  // ── Global in-memory state ────────────────────────────────────────────────
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [members,  setMembers]  = useState<TeamMember[]>(initialMembers)
  const [tasks,    setTasks]    = useState<Task[]>(initialTasks)
  const [settings, setSettings] = useState<AppSettings>(initialSettings)

  // ── Projects ──────────────────────────────────────────────────────────────
  const addProject    = (p: Project)    => setProjects(prev => [p, ...prev])
  const deleteProject = (id: string)    => setProjects(prev => prev.filter(p => p.id !== id))

  // ── Team ──────────────────────────────────────────────────────────────────
  const addMember    = (m: TeamMember)  => setMembers(prev => [...prev, m])
  const updateMember = (m: TeamMember)  => setMembers(prev => prev.map(x => x.userId === m.userId ? m : x))
  const deleteMember = (id: string)     => setMembers(prev => prev.filter(m => m.userId !== id))

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const addTask    = (t: Task)  => setTasks(prev => [t, ...prev])
  const updateTask = (t: Task)  => setTasks(prev => prev.map(x => x.id === t.id ? t : x))
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id))

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", settings.darkMode)
    }
  }, [settings.darkMode])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),transparent_35%),var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-8 rounded-3xl border border-border/80 bg-card/80 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.5)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">Panel ejecutivo</p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">Dashboard de Proyectos</h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                {settings.companyName} · Gestión avanzada con shadcn/ui, métricas dinámicas y un flujo de trabajo más visual.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ProjectForm members={members} onAdd={addProject} />
              <div className="rounded-3xl bg-primary px-4 py-3 text-white shadow-lg shadow-primary/20">
                <p className="text-xs uppercase tracking-[0.3em] opacity-80">Proyectos activos</p>
                <p className="text-2xl font-semibold">{projects.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Resumen */}
          <TabsContent value="overview">
            <OverviewTab projects={projects} tasks={tasks} members={members} />
          </TabsContent>

          {/* Proyectos */}
          <TabsContent value="projects">
            <ProjectsTab
              projects={projects}
              members={members}
              onDelete={deleteProject}
            />
          </TabsContent>

          {/* Equipo */}
          <TabsContent value="team">
            <TeamTab
              members={members}
              projects={projects}
              onAdd={addMember}
              onUpdate={updateMember}
              onDelete={deleteMember}
            />
          </TabsContent>

          {/* Tareas */}
          <TabsContent value="tasks">
            <TasksTab
              tasks={tasks}
              projects={projects}
              members={members}
              onAdd={addTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          </TabsContent>

          {/* Configuración */}
          <TabsContent value="settings">
            <SettingsTab settings={settings} onSave={setSettings} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}