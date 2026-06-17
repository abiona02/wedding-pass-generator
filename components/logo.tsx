import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  href = '/',
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn('inline-flex items-baseline gap-1.5', className)}
    >
      <span className="font-serif text-2xl font-semibold leading-none tracking-tight text-foreground">
        Ever
      </span>
      <span className="font-serif text-2xl font-semibold leading-none tracking-tight text-primary">
        Pass
      </span>
    </Link>
  )
}
