import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { DashboardShell } from '@/components/dashboard-shell'
import { DemoBootstrap } from '@/components/demo-bootstrap'
import { DemoPlaybackManager } from '@/components/demo-playback-manager'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Travel Intelligence Control Room',
  description: 'User profile demo platform for downstream agents and recommendation systems',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      lang="zh-CN"
    >
      <body className="font-sans">
        <DemoBootstrap />
        <DemoPlaybackManager />
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  )
}
