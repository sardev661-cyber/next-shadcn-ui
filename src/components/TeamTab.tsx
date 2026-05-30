"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
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
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Plus, Pencil, Trash2, CalendarIcon } from "lucide-react"
import { TeamMember, Project, generateId } from "@/lib/store"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Props {
  members: TeamMember[]
  projects: Project[]
  onAdd: (m: TeamMember) => void
  onUpdate: (m: TeamMember) => void
  onDelete: (userId: string) => void
}

const emptyMember: Omit<TeamMember, "userId"> = {
  role: "", name: "", email: "", position: "",
  birthdate: "", phone: "", projectId: "", isActive: true,
}

export function TeamTab({ members, projects, onAdd, onUpdate, onDelete }: Props) {
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState(emptyMember)
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [calOpen, setCalOpen] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<TeamMember | null>(null)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyMember)
    setBirthDate(undefined)
    setError("")
    setOpenForm(true)
  }

  const resetForm = () => {
    setEditing(null)
    setForm(emptyMember)
    setBirthDate(undefined)
    setError("")
  }

  const openEdit = (m: TeamMember) => {
    setEditing(m)
    setForm({ role: m.role, name: m.name, email: m.email, position: m.position,
      birthdate: m.birthdate, phone: m.phone, projectId: m.projectId, isActive: m.isActive })
    setBirthDate(m.birthdate ? new Date(m.birthdate + "T00:00:00") : undefined)
    setError("")
    setOpenForm(true)
  }

  const validate = () => {
    if (!form.name.trim()) return "El nombre es obligatorio."
    if (!form.email.trim()) return "El email es obligatorio."
    if (!form.role.trim()) return "El rol es obligatorio."
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    setTimeout(() => {
      if (editing) {
        onUpdate({ ...editing, ...form, birthdate: birthDate ? format(birthDate, "yyyy-MM-dd") : "" })
      } else {
        onAdd({ ...form, userId: generateId("u"), birthdate: birthDate ? format(birthDate, "yyyy-MM-dd") : "" })
      }
      setLoading(false)
      setOpenForm(false)
      resetForm()
    }, 1000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Gestiona los miembros y sus roles</CardDescription>
        </div>
        <Button type="button" className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Agregar Miembro
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No hay miembros registrados.</p>
          )}
          {members.map(m => (
            <div key={m.userId}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.role} · {m.position}</p>
                  <p className="text-xs text-muted-foreground">{m.email} · {m.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.isActive ? "default" : "secondary"}>
                  {m.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(m)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="destructive" className="gap-1" onClick={() => setConfirmDelete(m)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Form Dialog */}
      <Dialog open={openForm} onOpenChange={v => { setOpenForm(v); if (!v) setError("") }}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
              <DialogDescription>Completa la información del miembro del equipo.</DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Nombre completo <span className="text-red-500">*</span></Label>
                  <Input placeholder="Juan Pérez" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input type="email" placeholder="juan@ejemplo.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Rol <span className="text-red-500">*</span></Label>
                  <Input placeholder="Frontend Developer" value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Posición</Label>
                  <Select value={form.position} onValueChange={v => setForm({ ...form, position: v })}>
                    <SelectTrigger><SelectValue placeholder="Nivel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="555-0000" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Fecha de nacimiento</Label>
                  <Popover open={calOpen} onOpenChange={setCalOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start gap-2 font-normal">
                        <CalendarIcon className="h-4 w-4" />
                        {birthDate ? format(birthDate, "dd/MM/yyyy") : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={birthDate}
                        onSelect={d => { setBirthDate(d); setCalOpen(false) }}
                        locale={es}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Proyecto asignado</Label>
                <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona proyecto" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin proyecto</SelectItem>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Estado activo</p>
                  <p className="text-xs text-muted-foreground">El miembro puede ser asignado a proyectos</p>
                </div>
                <Switch checked={form.isActive}
                  onCheckedChange={v => setForm({ ...form, isActive: v })} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenForm(false)} disabled={loading}>Cancelar</Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Spinner className="text-current" size="sm" />}
                {loading ? "Guardando..." : editing ? "Guardar cambios" : "Agregar miembro"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Eliminar miembro</DialogTitle>
            <DialogDescription>
              ¿Eliminar a <strong>{confirmDelete?.name}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { if (confirmDelete) onDelete(confirmDelete.userId); setConfirmDelete(null) }}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}