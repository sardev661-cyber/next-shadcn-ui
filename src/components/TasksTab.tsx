"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Plus, Pencil, Trash2, CalendarIcon } from "lucide-react"
import { Task, Project, TeamMember, Priority, TaskStatus, generateId } from "@/lib/store"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const PAGE_SIZE = 5

interface Props {
  tasks: Task[]
  projects: Project[]
  members: TeamMember[]
  onAdd: (t: Task) => void
  onUpdate: (t: Task) => void
  onDelete: (id: string) => void
}

const statusVariant = (s: TaskStatus) =>
  s === "Completado" ? "default" : s === "En progreso" ? "secondary" : "outline"

const priorityColor: Record<Priority, string> = {
  Urgente: "destructive",
  Alta: "default",
  Media: "secondary",
  Baja: "outline",
}

const emptyTask = {
  description: "", projectId: "", status: "Pendiente" as TaskStatus,
  priority: "Media" as Priority, userId: "", dateline: "",
}

export function TasksTab({ tasks, projects, members, onAdd, onUpdate, onDelete }: Props) {
  const [page, setPage] = useState(1)
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [form, setForm] = useState(emptyTask)
  const [deadline, setDeadline] = useState<Date | undefined>()
  const [calOpen, setCalOpen] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Task | null>(null)

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const paginated = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openAdd = () => {
    setEditing(null); setForm(emptyTask); setDeadline(undefined); setError(""); setOpenForm(true)
  }
  const openEdit = (t: Task) => {
    setEditing(t)
    setForm({ description: t.description, projectId: t.projectId, status: t.status,
      priority: t.priority, userId: t.userId, dateline: t.dateline })
    setDeadline(t.dateline ? new Date(t.dateline + "T00:00:00") : undefined)
    setError(""); setOpenForm(true)
  }

  const validate = () => {
    if (!form.description.trim()) return "La descripción es obligatoria."
    if (!form.projectId) return "Selecciona un proyecto."
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    setTimeout(() => {
      const taskData = { ...form, dateline: deadline ? format(deadline, "yyyy-MM-dd") : "" }
      if (editing) {
        onUpdate({ ...editing, ...taskData })
      } else {
        onAdd({ ...taskData, id: generateId("t") })
      }
      setLoading(false); setOpenForm(false); setPage(1)
    }, 900)
  }

  const getMemberName = (id: string) => members.find(m => m.userId === id)?.name ?? "-"
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.title ?? "-"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Tareas</CardTitle>
          <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Nueva Tarea
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {tasks.length} tarea(s) en total · Página {page} de {totalPages}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Asignado</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No hay tareas registradas.
                  </TableCell>
                </TableRow>
              )}
              {paginated.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{task.description}</TableCell>
                  <TableCell className="text-sm">{getProjectName(task.projectId)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityColor[task.priority] as any}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{getMemberName(task.userId)}</TableCell>
                  <TableCell className="text-sm">{task.dateline || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(task)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(task)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <PaginationItem key={n}>
                  <Button
                    variant={page === n ? "default" : "outline"}
                    size="sm"
                    className="h-9 w-9"
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>

      {/* Form Dialog */}
      <Dialog open={openForm} onOpenChange={v => { setOpenForm(v); if (!v) setError("") }}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
              <DialogDescription>Completa los campos de la tarea.</DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Descripción <span className="text-red-500">*</span></Label>
                <Input placeholder="Implementar autenticación..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Proyecto <span className="text-red-500">*</span></Label>
                  <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Asignar a</Label>
                  <Select value={form.userId} onValueChange={v => setForm({ ...form, userId: v })}>
                    <SelectTrigger><SelectValue placeholder="Miembro" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {members.filter(m => m.isActive).map(m => (
                        <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as TaskStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En progreso">En progreso</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Prioridad</Label>
                  <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v as Priority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Fecha límite</Label>
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start gap-2 font-normal">
                      <CalendarIcon className="h-4 w-4" />
                      {deadline ? format(deadline, "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={d => { setDeadline(d); setCalOpen(false) }}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenForm(false)} disabled={loading}>Cancelar</Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Spinner className="text-current" size="sm" />}
                {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear tarea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Eliminar tarea</DialogTitle>
            <DialogDescription>
              ¿Eliminar la tarea <strong>"{confirmDelete?.description}"</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => {
              if (confirmDelete) onDelete(confirmDelete.id)
              setConfirmDelete(null)
            }}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}