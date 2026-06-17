import { CalendarHeart, Plus } from "lucide-react"
import { getEventsWithStats } from "@/app/actions/events"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/event-card"
import { EventFormDialog } from "@/components/event-form-dialog"

export default async function DashboardPage() {
  const events = await getEventsWithStats()

  const totalGuests = events.reduce((sum, e) => sum + (e.guestCount ?? 0), 0)
  const totalCheckedIn = events.reduce((sum, e) => sum + (e.checkedInCount ?? 0), 0)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Your events</h1>
          <p className="mt-1 text-muted-foreground">
            {events.length === 0
              ? "Create your first event to begin."
              : `${events.length} ${events.length === 1 ? "event" : "events"} · ${totalGuests} guests · ${totalCheckedIn} checked in`}
          </p>
        </div>
        <EventFormDialog
          trigger={
            <Button size="lg">
              <Plus className="size-4" />
              New event
            </Button>
          }
        />
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
            <CalendarHeart className="size-7" />
          </div>
          <h2 className="font-serif text-2xl font-semibold">No events yet</h2>
          <p className="max-w-sm text-muted-foreground leading-relaxed">
            Start by creating an event. You can add your guests and generate their passes right after.
          </p>
          <EventFormDialog
            trigger={
              <Button size="lg" className="mt-2">
                <Plus className="size-4" />
                Create an event
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
