"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, Settings2 } from "lucide-react"
import { AppSettings } from "@/lib/store"

interface Props {
  settings: AppSettings
  onSave: (s: AppSettings) => void
}

export function SettingsTab({ settings, onSave }: Props) {
  const [form, setForm] = useState(settings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setTimeout(() => {
      onSave(form)
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1200)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {saved && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>¡Configuración guardada correctamente!</AlertDescription>
        </Alert>
      )}

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" /> Configuración General
          </CardTitle>
          <CardDescription>Información básica de tu organización</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Nombre de la empresa</Label>
              <Input value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Email del administrador</Label>
              <Input type="email" value={form.adminEmail}
                onChange={e => setForm({ ...form, adminEmail: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Idioma</Label>
              <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Zona horaria</Label>
              <Select value={form.timezone} onValueChange={v => setForm({ ...form, timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                  <SelectItem value="America/Santiago">Santiago (GMT-4)</SelectItem>
                  <SelectItem value="America/Mexico_City">México DF (GMT-6)</SelectItem>
                  <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Máximo de proyectos activos</Label>
            <Input type="number" min={1} max={100} value={form.maxProjects}
              onChange={e => setForm({ ...form, maxProjects: Number(e.target.value) })}
              className="w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>Personaliza tu experiencia en el dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "notifications" as const,
              label: "Notificaciones",
              desc: "Recibir alertas de cambios en proyectos y tareas",
            },
            {
              key: "darkMode" as const,
              label: "Modo oscuro",
              desc: "Activar tema oscuro en la interfaz (requiere recarga)",
            },
            {
              key: "weeklyReport" as const,
              label: "Reporte semanal",
              desc: "Recibir resumen semanal de métricas por email",
            },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={form[item.key]}
                onCheckedChange={v => setForm({ ...form, [item.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2 px-8">
          {loading && <Spinner className="text-current" size="sm" />}
          {loading ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </form>
  )
}