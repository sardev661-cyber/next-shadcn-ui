"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Plus } from "lucide-react"
import { Project, TeamMember, generateId, Priority, ProjectStatus } from "@/lib/store"

interface ProjectFormProps {
  members: TeamMember[]
  onAdd: (project: Project) => void
}

const emptyForm = {
  title: "", description: "", category: "", priority: "" as Priority | "",
  status: "Planificado" as ProjectStatus, memberIds: [] as string[],
}

export function ProjectForm({ members, onAdd }: ProjectFormProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!form.title.trim()) return "El nombre del proyecto es obligatorio."
    if (!form.category) return "Selecciona una categoría."
    if (!form.priority) return "Selecciona una prioridad."
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError("")
    setLoading(true)
    setTimeout(() => {
      onAdd({
        id: generateId("p"),
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority as Priority,
        status: form.status,
        progress: 0,
        memberIds: form.memberIds,
        createdAt: new Date().toISOString().slice(0, 10),
      })
      setForm(emptyForm)
      setLoading(false)
      setOpen(false)
    }, 1200)
  }

  const toggleMember = (uid: string) => {
    setForm(f => ({
      ...f,
      memberIds: f.memberIds.includes(uid)
        ? f.memberIds.filter(id => id !== uid)
        : [...f.memberIds, uid],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setError(""); setForm(emptyForm) } }}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo Proyecto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>Completa la información del proyecto.</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Nombre <span className="text-red-500">*</span></Label>
              <Input id="title" placeholder="Mi Proyecto" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" placeholder="Breve descripción..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Categoría <span className="text-red-500">*</span></Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Desarrollo Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="design">Diseño</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Prioridad <span className="text-red-500">*</span></Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v as Priority })}>
                  <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
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
              <Label>Estado inicial</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as ProjectStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planificado">Planificado</SelectItem>
                  <SelectItem value="En progreso">En progreso</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Miembros del equipo */}
            <div className="grid gap-2">
              <Label>Miembros del equipo</Label>
              <div className="border rounded-lg p-3 max-h-36 overflow-y-auto space-y-2">
                {members.length === 0 && (
                  <p className="text-sm text-muted-foreground">No hay miembros registrados.</p>
                )}
                {members.map(m => (
                  <div key={m.userId} className="flex items-center gap-2">
                    <Checkbox
                      id={`m-${m.userId}`}
                      checked={form.memberIds.includes(m.userId)}
                      onCheckedChange={() => toggleMember(m.userId)}
                    />
                    <label htmlFor={`m-${m.userId}`} className="text-sm cursor-pointer flex gap-2 items-center">
                      {m.name}
                      <Badge variant="outline" className="text-xs">{m.role}</Badge>
                    </label>
                  </div>
                ))}
              </div>
              {form.memberIds.length > 0 && (
                <p className="text-xs text-muted-foreground">{form.memberIds.length} miembro(s) seleccionado(s)</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Spinner className="text-current" size="sm" />}
              {loading ? "Creando..." : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}