"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2, Eye, Users } from "lucide-react"
import { Project, TeamMember, Priority, ProjectStatus } from "@/lib/store"

const statusVariant = (s: ProjectStatus) =>
  s === "Completado" ? "default" : s === "En revisión" ? "secondary" : "outline"

const priorityColor: Record<Priority, string> = {
  Urgente: "bg-red-100 text-red-700 border-red-200",
  Alta: "bg-orange-100 text-orange-700 border-orange-200",
  Media: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Baja: "bg-green-100 text-green-700 border-green-200",
}

interface Props {
  projects: Project[]
  members: TeamMember[]
  onDelete: (id: string) => void
}

export function ProjectsTab({ projects, members, onDelete }: Props) {
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null)

  const getMemberNames = (ids: string[]) =>
    ids.map(id => members.find(m => m.userId === id)?.name ?? id)

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <Card key={project.id} className="flex flex-col rounded-3xl border border-border/70 bg-card/80 shadow-xl shadow-sky-200/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </div>
                <Badge variant={statusVariant(project.status)} className="shrink-0">
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                {/* Progreso */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                {/* Prioridad */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Prioridad:</span>
                  <span className={`px-2 py-0.5 rounded border text-xs font-medium ${priorityColor[project.priority]}`}>
                    {project.priority}
                  </span>
                </div>

                {/* Miembros */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {getMemberNames(project.memberIds).slice(0, 4).map((name, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.memberIds.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{project.memberIds.length - 4}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.memberIds.length} miembro(s)
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2 pt-3 border-t border-border/70 sm:flex-row">
                <Button size="sm" variant="outline" className="flex-1 gap-1"
                  onClick={() => setDetailProject(project)}>
                  <Eye className="h-3 w-3" /> Ver detalles
                </Button>
                <Button size="sm" variant="destructive" className="gap-1"
                  onClick={() => setConfirmDelete(project)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted-foreground">
            No hay proyectos. Crea el primero con el botón "Nuevo Proyecto".
          </div>
        )}
      </div>

      {/* Modal: Ver detalles */}
      <Dialog open={!!detailProject} onOpenChange={() => setDetailProject(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{detailProject?.title}</DialogTitle>
            <DialogDescription>{detailProject?.description}</DialogDescription>
          </DialogHeader>
          {detailProject && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Estado:</span>
                  <Badge variant={statusVariant(detailProject.status)} className="ml-2">{detailProject.status}</Badge>
                </div>
                <div><span className="text-muted-foreground">Prioridad:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded border text-xs font-medium ${priorityColor[detailProject.priority]}`}>
                    {detailProject.priority}
                  </span>
                </div>
                <div><span className="text-muted-foreground">Categoría:</span>
                  <span className="ml-2 font-medium capitalize">{detailProject.category}</span>
                </div>
                <div><span className="text-muted-foreground">Creado:</span>
                  <span className="ml-2 font-medium">{detailProject.createdAt}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-bold">{detailProject.progress}%</span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all"
                    style={{ width: `${detailProject.progress}%` }} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Miembros asignados:</p>
                <div className="space-y-2">
                  {detailProject.memberIds.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">Sin miembros asignados.</p>
                  )}
                  {getMemberNames(detailProject.memberIds).map((name, i) => {
                    const m = members.find(mb => mb.userId === detailProject.memberIds[i])
                    return (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">{m?.role}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailProject(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar eliminación */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Eliminar proyecto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar <strong>{confirmDelete?.title}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => {
              if (confirmDelete) onDelete(confirmDelete.id)
              setConfirmDelete(null)
            }}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}