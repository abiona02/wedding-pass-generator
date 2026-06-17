import type React from 'react'
import { Logo } from '@/components/logo'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Logo className="mb-10" />
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-2 mb-8 text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-accent lg:block">
        <img
          src="/auth-wedding.png"
          alt="Elegant wedding tablescape with soft candlelight"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        <blockquote className="absolute bottom-12 left-12 right-12 text-card">
          <p className="font-serif text-2xl leading-relaxed text-pretty text-background">
            &ldquo;Every guest greeted, every seat accounted for, every moment
            unforgettable.&rdquo;
          </p>
        </blockquote>
      </div>
    </main>
  )
}
