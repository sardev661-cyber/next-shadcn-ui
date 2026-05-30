// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectStatus = "En progreso" | "Planificado" | "En revisión" | "Completado"
export type Priority = "Baja" | "Media" | "Alta" | "Urgente"
export type TaskStatus = "Pendiente" | "En progreso" | "Completado"
export type MemberStatus = "Activo" | "Inactivo"

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  progress: number
  category: string
  priority: Priority
  memberIds: string[]
  createdAt: string
}

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string
  dateline: string
}

export interface AppSettings {
  companyName: string
  adminEmail: string
  language: string
  timezone: string
  notifications: boolean
  darkMode: boolean
  weeklyReport: boolean
  maxProjects: number
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

export const initialMembers: TeamMember[] = [
  { userId: "u1", role: "Frontend Developer", name: "María García", email: "maria@example.com", position: "Senior", birthdate: "1993-04-12", phone: "555-1001", projectId: "p1", isActive: true },
  { userId: "u2", role: "Backend Developer", name: "Juan Pérez", email: "juan@example.com", position: "Mid", birthdate: "1990-08-25", phone: "555-1002", projectId: "p1", isActive: true },
  { userId: "u3", role: "UI/UX Designer", name: "Ana López", email: "ana@example.com", position: "Senior", birthdate: "1995-01-30", phone: "555-1003", projectId: "p2", isActive: false },
  { userId: "u4", role: "DevOps Engineer", name: "Carlos Ruiz", email: "carlos@example.com", position: "Lead", birthdate: "1988-11-15", phone: "555-1004", projectId: "p3", isActive: true },
  { userId: "u5", role: "Project Manager", name: "Laura Martínez", email: "laura@example.com", position: "Senior", birthdate: "1991-06-07", phone: "555-1005", projectId: "p1", isActive: true },
]

export const initialProjects: Project[] = [
  { id: "p1", title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", progress: 65, category: "web", priority: "Alta", memberIds: ["u1", "u2", "u5"], createdAt: "2025-09-01" },
  { id: "p2", title: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", progress: 90, category: "mobile", priority: "Media", memberIds: ["u3"], createdAt: "2025-09-15" },
  { id: "p3", title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", status: "Planificado", progress: 20, category: "web", priority: "Media", memberIds: ["u4"], createdAt: "2025-10-01" },
  { id: "p4", title: "API Gateway", description: "Microservicios con Node.js", status: "En progreso", progress: 45, category: "backend", priority: "Alta", memberIds: ["u2", "u4"], createdAt: "2025-10-10" },
  { id: "p5", title: "Design System", description: "Librería de componentes reutilizables", status: "Completado", progress: 100, category: "design", priority: "Baja", memberIds: ["u1", "u3"], createdAt: "2025-08-01" },
  { id: "p6", title: "Marketing Website", description: "Sitio web institucional", status: "En progreso", progress: 75, category: "web", priority: "Media", memberIds: ["u1"], createdAt: "2025-10-20" },
]

export const initialTasks: Task[] = [
  { id: "t1", description: "Implementar autenticación JWT", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2025-11-15" },
  { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "u3", dateline: "2025-11-20" },
  { id: "t3", description: "Configurar CI/CD pipeline", projectId: "p3", status: "Completado", priority: "Alta", userId: "u4", dateline: "2025-11-10" },
  { id: "t4", description: "Optimizar queries SQL", projectId: "p1", status: "En progreso", priority: "Urgente", userId: "u2", dateline: "2025-11-12" },
  { id: "t5", description: "Documentar API endpoints", projectId: "p4", status: "Pendiente", priority: "Baja", userId: "u5", dateline: "2025-11-25" },
  { id: "t6", description: "Integrar pasarela de pagos", projectId: "p1", status: "Pendiente", priority: "Urgente", userId: "u1", dateline: "2025-11-18" },
  { id: "t7", description: "Pruebas unitarias componentes", projectId: "p5", status: "Completado", priority: "Media", userId: "u3", dateline: "2025-11-05" },
  { id: "t8", description: "Deploy en producción", projectId: "p6", status: "En progreso", priority: "Alta", userId: "u4", dateline: "2025-11-30" },
]

export const initialSettings: AppSettings = {
  companyName: "Mi Empresa S.A.",
  adminEmail: "admin@miempresa.com",
  language: "es",
  timezone: "America/Lima",
  notifications: true,
  darkMode: false,
  weeklyReport: true,
  maxProjects: 20,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateId(prefix: string): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}