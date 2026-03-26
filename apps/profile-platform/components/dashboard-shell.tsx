'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { PersonaId } from '@pascal-app/profile-core'
import {
  Bot,
  Boxes,
  ChartSpline,
  DatabaseZap,
  Layers3,
  LayoutDashboard,
  Sparkles,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDemoStore } from '@/stores/use-demo-store'

const navItems = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/journey', label: 'Journey', icon: Sparkles },
  { href: '/profiles', label: 'Profiles', icon: Layers3 },
  { href: '/agent-lab', label: 'Agent Lab', icon: Bot },
  { href: '/segments', label: 'Segments', icon: Target },
  { href: '/evaluation-center', label: 'Evaluation Center', icon: ChartSpline },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const catalog = useDemoStore((state) => state.catalog)
  const selectedPersonaId = useDemoStore((state) => state.selectedPersonaId)
  const setSelectedPersona = useDemoStore((state) => state.setSelectedPersona)
  const playbackState = useDemoStore((state) => state.playbackState)
  const currentRun = useDemoStore((state) => state.currentRun)

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-[290px] flex-col border-r border-[var(--line)] bg-[rgba(251,247,241,0.84)] px-6 py-7 backdrop-blur-xl lg:flex">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[var(--panel)] text-white shadow-[0_16px_40px_rgba(16,34,49,0.22)]">
              <DatabaseZap className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl text-[var(--panel)] tracking-[-0.04em]">
                Control Room
              </p>
              <p className="text-sm text-[var(--foreground-soft)]">
                画像基础设施 Demo for Agents
              </p>
            </div>
          </div>

          <div className="control-room-dark rounded-[28px] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Pipeline status</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-3xl tracking-[-0.05em]">
                  {playbackState === 'completed'
                    ? 'Complete'
                    : playbackState === 'playing'
                      ? 'Running'
                      : playbackState === 'paused'
                        ? 'Paused'
                        : 'Idle'}
                </p>
                <p className="mt-2 text-sm text-[var(--panel-muted)]">
                  {currentRun
                    ? `当前 run 绑定 ${currentRun.persona.displayName}`
                    : '等待启动 Demo pipeline'}
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 font-mono text-[11px] text-[var(--panel-muted)]">
                {currentRun ? currentRun.id.split('_').slice(-1)[0] : 'no-run'}
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-[18px] px-4 py-3 transition',
                  active
                    ? 'bg-[var(--panel)] text-white shadow-[0_18px_36px_rgba(16,34,49,0.16)]'
                    : 'text-[var(--foreground-soft)] hover:bg-white/80 hover:text-[var(--panel)]',
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto rounded-[24px] border border-[var(--line)] bg-white/74 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[var(--gold-soft)] p-2 text-[var(--panel)]">
              <Boxes className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm text-[var(--panel)]">Demo scope</p>
              <p className="text-xs text-[var(--foreground-soft)]">3 personas · 8 stages · 2 agents</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[290px]">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(247,241,231,0.8)] px-5 py-4 backdrop-blur-xl md:px-7 lg:px-9">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--foreground-soft)]">
                Audience: 内部评审
              </p>
              <p className="mt-2 text-sm text-[var(--foreground-soft)]">
                选择 persona 后，可在 Journey 发起完整回放，并在 Agent Lab 查看下游调用。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {catalog?.personas.map((persona) => (
                <button
                  className={cn(
                    'rounded-full border px-4 py-2 text-left transition',
                    selectedPersonaId === persona.id
                      ? 'border-transparent bg-[var(--panel)] text-white shadow-[0_14px_28px_rgba(16,34,49,0.16)]'
                      : 'border-[var(--line)] bg-white/72 text-[var(--foreground)] hover:bg-white',
                  )}
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id as PersonaId)}
                  type="button"
                >
                  <span className="block text-[11px] uppercase tracking-[0.18em] opacity-70">
                    {persona.travelArchetype}
                  </span>
                  <span className="block pt-1 text-sm">{persona.displayName}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="px-5 py-7 md:px-7 lg:px-9">{children}</main>
      </div>
    </div>
  )
}
