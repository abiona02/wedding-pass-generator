'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events, guests } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Public: look up a guest pass and its event by passCode. No auth required —
// guests open this from their invitation link / QR code.
export async function getPassByCode(passCode: string) {
  const [row] = await db
    .select({
      guest: guests,
      event: events,
    })
    .from(guests)
    .innerJoin(events, eq(guests.eventId, events.id))
    .where(eq(guests.passCode, passCode))
  return row ?? null
}

// Organizer-only: check in a guest by passCode (used by the scanner flow).
export async function checkInByCode(passCode: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return { ok: false as const, reason: 'unauthorized' as const }
  }
  const userId = session.user.id

  const [row] = await db
    .select({ guest: guests, event: events })
    .from(guests)
    .innerJoin(events, eq(guests.eventId, events.id))
    .where(and(eq(guests.passCode, passCode), eq(guests.userId, userId)))

  if (!row) return { ok: false as const, reason: 'not_found' as const }

  const alreadyCheckedIn = row.guest.checkedIn

  if (!alreadyCheckedIn) {
    await db
      .update(guests)
      .set({ checkedIn: true, checkedInAt: new Date(), updatedAt: new Date() })
      .where(and(eq(guests.id, row.guest.id), eq(guests.userId, userId)))
    revalidatePath(`/dashboard/events/${row.event.id}`)
    revalidatePath(`/dashboard/events/${row.event.id}/check-in`)
  }

  return {
    ok: true as const,
    alreadyCheckedIn,
    guest: {
      name: row.guest.name,
      seats: row.guest.seats,
      tableAssignment: row.guest.tableAssignment,
      checkedInAt: row.guest.checkedInAt,
    },
    event: { title: row.event.title, coupleNames: row.event.coupleNames },
  }
}
