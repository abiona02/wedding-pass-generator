'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events, guests } from '@/lib/db/schema'
import { and, desc, eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getEvents() {
  const userId = await getUserId()
  return db
    .select()
    .from(events)
    .where(eq(events.userId, userId))
    .orderBy(desc(events.createdAt))
}

export async function getEventsWithStats() {
  const userId = await getUserId()
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      coupleNames: events.coupleNames,
      eventType: events.eventType,
      eventDate: events.eventDate,
      venueName: events.venueName,
      accentColor: events.accentColor,
      guestCount: sql<number>`count(${guests.id})::int`,
      checkedInCount: sql<number>`count(${guests.id}) filter (where ${guests.checkedIn} = true)::int`,
      seatCount: sql<number>`coalesce(sum(${guests.seats}), 0)::int`,
    })
    .from(events)
    .leftJoin(guests, eq(guests.eventId, events.id))
    .where(eq(events.userId, userId))
    .groupBy(events.id)
    .orderBy(desc(events.createdAt))
  return rows
}

export async function getEvent(id: string) {
  const userId = await getUserId()
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), eq(events.userId, userId)))
  return event ?? null
}

type EventInput = {
  title: string
  coupleNames?: string
  eventType?: string
  eventDate?: string | null
  venueName?: string
  venueAddress?: string
  description?: string
  dressCode?: string
  accentColor?: string
}

export async function createEvent(input: EventInput) {
  const userId = await getUserId()
  const id = randomUUID()
  await db.insert(events).values({
    id,
    userId,
    title: input.title,
    coupleNames: input.coupleNames || null,
    eventType: input.eventType || 'wedding',
    eventDate: input.eventDate ? new Date(input.eventDate) : null,
    venueName: input.venueName || null,
    venueAddress: input.venueAddress || null,
    description: input.description || null,
    dressCode: input.dressCode || null,
    accentColor: input.accentColor || '#b08968',
  })
  revalidatePath('/dashboard')
  return id
}

export async function updateEvent(id: string, input: EventInput) {
  const userId = await getUserId()
  await db
    .update(events)
    .set({
      title: input.title,
      coupleNames: input.coupleNames || null,
      eventType: input.eventType || 'wedding',
      eventDate: input.eventDate ? new Date(input.eventDate) : null,
      venueName: input.venueName || null,
      venueAddress: input.venueAddress || null,
      description: input.description || null,
      dressCode: input.dressCode || null,
      accentColor: input.accentColor || '#b08968',
      updatedAt: new Date(),
    })
    .where(and(eq(events.id, id), eq(events.userId, userId)))
  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/events/${id}`)
}

export async function deleteEvent(id: string) {
  const userId = await getUserId()
  await db.delete(guests).where(and(eq(guests.eventId, id), eq(guests.userId, userId)))
  await db.delete(events).where(and(eq(events.id, id), eq(events.userId, userId)))
  revalidatePath('/dashboard')
}
