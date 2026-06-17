import Link from "next/link"
import { CalendarDays, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type EventCardData = {
  id: string
  title: string
  coupleNames: string | null
  eventType: string
  eventDate: Date | null
  venueName: string | null
  accentColor: string
  guestCount: number
  checkedInCount: number
}

function formatDate(date: Date | null) {
  if (!date) return "Date to be set"
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Link href={`/dashboard/events/${event.id}`} className="group block">
      <Card className="h-full overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5">
        <div className="h-1.5 w-full" style={{ backgroundColor: event.accentColor }} aria-hidden="true" />
        <CardHeader className="gap-1">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="font-sans text-[0.65rem] uppercase tracking-wider">
              {event.eventType}
            </Badge>
          </div>
          <h3 className="font-serif text-2xl leading-tight text-foreground">{event.title}</h3>
          {event.coupleNames ? (
            <p className="font-serif text-base italic text-muted-foreground">{event.coupleNames}</p>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          {event.venueName ? (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="truncate">{event.venueName}</span>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="mt-auto flex items-center justify-between border-t border-border/60 pt-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4 text-primary" />
            <span>
              {event.guestCount} {event.guestCount === 1 ? "guest" : "guests"}
            </span>
          </div>
          <span className="font-sans text-xs text-muted-foreground">
            {event.checkedInCount} checked in
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
