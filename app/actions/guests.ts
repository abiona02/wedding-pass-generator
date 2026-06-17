'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events, guests } from '@/lib/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

function generatePassCode() {
  // URL-safe, human-distinguishable code
  return randomUUID().replace(/-/g, '').slice(0, 20)
}

export async function getGuests(eventId: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(guests)
    .where(and(eq(guests.eventId, eventId), eq(guests.userId, userId)))
    .orderBy(asc(guests.createdAt))
}

type GuestInput = {
  eventId: string
  name: string
  email?: string
  phone?: string
  seats?: number
  tableAssignment?: string
  rsvpStatus?: string
}

export async function createGuest(input: GuestInput) {
  const userId = await getUserId()
  // verify event ownership
  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.id, input.eventId), eq(events.userId, userId)))
  if (!event) throw new Error('Event not found')

  const id = randomUUID()
  await db.insert(guests).values({
    id,
    userId,
    eventId: input.eventId,
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    seats: input.seats ?? 1,
    tableAssignment: input.tableAssignment || null,
    rsvpStatus: input.rsvpStatus || 'pending',
    passCode: generatePassCode(),
  })
  revalidatePath(`/dashboard/events/${input.eventId}`)
  return id
}

export async function updateGuest(
  id: string,
  input: Omit<GuestInput, 'eventId'> & { eventId: string },
) {
  const userId = await getUserId()
  await db
    .update(guests)
    .set({
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      seats: input.seats ?? 1,
      tableAssignment: input.tableAssignment || null,
      rsvpStatus: input.rsvpStatus || 'pending',
      updatedAt: new Date(),
    })
    .where(and(eq(guests.id, id), eq(guests.userId, userId)))
  revalidatePath(`/dashboard/events/${input.eventId}`)
}

export async function deleteGuest(id: string, eventId: string) {
  const userId = await getUserId()
  await db.delete(guests).where(and(eq(guests.id, id), eq(guests.userId, userId)))
  revalidatePath(`/dashboard/events/${eventId}`)
}

export async function toggleCheckIn(id: string, eventId: string, checkedIn: boolean) {
  const userId = await getUserId()
  await db
    .update(guests)
    .set({
      checkedIn,
      checkedInAt: checkedIn ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(and(eq(guests.id, id), eq(guests.userId, userId)))
  revalidatePath(`/dashboard/events/${eventId}`)
  revalidatePath(`/dashboard/events/${eventId}/check-in`)
}
