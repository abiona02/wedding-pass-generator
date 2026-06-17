'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEvent, updateEvent } from '@/app/actions/events'
import type { Event } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const ACCENT_COLORS = [
  { name: 'Champagne', value: '#b08968' },
  { name: 'Blush', value: '#c98b8b' },
  { name: 'Sage', value: '#7e8a6f' },
  { name: 'Slate', value: '#5c6b7a' },
  { name: 'Ink', value: '#3a3a3a' },
  { name: 'Gold', value: '#a98b3c' },
]

function toDateInput(date: Date | string | null | undefined) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 16)
}

export function EventFormDialog({
  event,
  trigger,
}: {
  event?: Event
  trigger: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accentColor, setAccentColor] = useState(event?.accentColor ?? '#b08968')
  const isEdit = Boolean(event)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const payload = {
      title: String(fd.get('title')),
      coupleNames: String(fd.get('coupleNames') || ''),
      eventType: String(fd.get('eventType') || 'wedding'),
      eventDate: String(fd.get('eventDate') || '') || null,
      venueName: String(fd.get('venueName') || ''),
      venueAddress: String(fd.get('venueAddress') || ''),
      description: String(fd.get('description') || ''),
      dressCode: String(fd.get('dressCode') || ''),
      accentColor,
    }

    try {
      if (isEdit && event) {
        await updateEvent(event.id, payload)
        toast.success('Event updated')
      } else {
        const id = await createEvent(payload)
        toast.success('Event created')
        router.push(`/dashboard/events/${id}`)
      }
      setOpen(false)
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isEdit ? 'Edit event' : 'Create an event'}
          </DialogTitle>
          <DialogDescription>
            Add the details that will appear on your guests&apos; passes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Event title</Label>
            <Input
              id="title"
              name="title"
              placeholder="The Wedding of…"
              defaultValue={event?.title}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="coupleNames">Couple / hosts</Label>
              <Input
                id="coupleNames"
                name="coupleNames"
                placeholder="Ava & Liam"
                defaultValue={event?.coupleNames ?? ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="eventType">Type</Label>
              <Select name="eventType" defaultValue={event?.eventType ?? 'wedding'}>
                <SelectTrigger id="eventType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="celebration">Celebration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="eventDate">Date &amp; time</Label>
            <Input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              defaultValue={toDateInput(event?.eventDate)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="venueName">Venue name</Label>
              <Input
                id="venueName"
                name="venueName"
                placeholder="The Grand Hall"
                defaultValue={event?.venueName ?? ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dressCode">Dress code</Label>
              <Input
                id="dressCode"
                name="dressCode"
                placeholder="Black tie"
                defaultValue={event?.dressCode ?? ''}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="venueAddress">Venue address</Label>
            <Input
              id="venueAddress"
              name="venueAddress"
              placeholder="123 Rose Avenue, Springfield"
              defaultValue={event?.venueAddress ?? ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Note to guests</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="We can't wait to celebrate with you."
              defaultValue={event?.description ?? ''}
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Pass accent color</Label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setAccentColor(c.value)}
                  className={`size-8 rounded-full border-2 transition ${
                    accentColor === c.value
                      ? 'border-foreground'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.name}
                  aria-pressed={accentColor === c.value}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
