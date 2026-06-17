import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { QrCode, CalendarHeart, Users, ScanLine, Sparkles, MailCheck } from 'lucide-react'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  const features = [
    {
      icon: CalendarHeart,
      title: 'Effortless events',
      body: 'Create a wedding or celebration in moments, with every detail kept beautifully in one place.',
    },
    {
      icon: Users,
      title: 'Guest management',
      body: 'Track RSVPs, seats, and table assignments with a clear, sortable guest list.',
    },
    {
      icon: QrCode,
      title: 'Bespoke QR passes',
      body: 'Every guest receives a personalized digital invitation with a scannable pass.',
    },
    {
      icon: ScanLine,
      title: 'Seamless check-in',
      body: 'Scan passes at the door and watch your arrivals update in real time.',
    },
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              For planners &amp; couples
            </span>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Beautiful passes for unforgettable celebrations
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
              EverPass turns your guest list into elegant digital invitations
              with QR check-in — so every arrival feels as polished as the day
              itself.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/sign-up">Create your first event</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-sm">
            <img
              src="/hero-wedding.png"
              alt="A romantic wedding ceremony arch in golden hour light"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-card/50">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Everything you need, from save-the-date to the last dance
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                A calm, considered workflow that replaces spreadsheets and
                paper lists with something genuinely lovely to use.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-background p-6"
                >
                  <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-accent px-8 py-14 text-center">
            <MailCheck className="size-10 text-primary" />
            <h2 className="max-w-xl font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Give your guests an arrival worth remembering
            </h2>
            <p className="max-w-md text-muted-foreground leading-relaxed">
              Set up your event, add your guests, and share their passes in
              minutes.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Crafted for celebrations. EverPass.
          </p>
        </div>
      </footer>
    </div>
  )
}
